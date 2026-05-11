import { logger } from "../utils/logger.js";
import { config } from "../config/env.js";

export type ChatRole = "system" | "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

export interface AiChatResult {
  success: boolean;
  text: string;
  model: string;
}

// ─── Internal: send one request to a specific model ──────────────────────────
async function sendRequest(
  modelId: string,
  messages: ChatMessage[],
  temperature = 0.7,
  max_tokens?: number
) {
  const apiKey = config.openrouter.apiKey;
  if (!apiKey) {
    const err: any = new Error("OPENROUTER_API_KEY is missing. Set it in backend/.env and restart.");
    err.status = 500;
    throw err;
  }

  const body: Record<string, unknown> = {
    model: modelId,
    messages,
    temperature,
  };
  if (max_tokens != null) body.max_tokens = max_tokens;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.openrouter.timeout);

  let resp: Response;
  try {
    resp = await fetch(`${config.openrouter.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": config.openrouter.referer || "http://localhost",
        "X-Title": config.openrouter.title || "react-ecommerce",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (fetchErr: any) {
    clearTimeout(timeoutId);
    if (fetchErr?.name === "AbortError") {
      const err: any = new Error(`Request timed out after ${config.openrouter.timeout / 1000}s`);
      err.status = 504;
      throw err;
    }
    throw fetchErr;
  }

  clearTimeout(timeoutId);

  let data: any;
  try {
    data = await resp.json();
  } catch {
    const err: any = new Error("Failed to parse OpenRouter response");
    err.status = 502;
    throw err;
  }

  if (!resp.ok) {
    const errMsg =
      data?.error?.message || data?.error || `OpenRouter error: ${resp.status}`;
    const upstreamCode =
      (data?.error?.code && isFinite(Number(data.error.code)) && Number(data.error.code)) ||
      resp.status ||
      502;
    const err: any = new Error(errMsg);
    err.status = upstreamCode >= 400 ? upstreamCode : 502;
    err.details = data;
    throw err;
  }

  return data;
}

// ─── Public: call OpenRouter with automatic fallback ─────────────────────────
export async function callOpenRouterChat(
  messages: ChatMessage[]
): Promise<AiChatResult> {
  if (!config.openrouter.apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing. Set it in backend/.env and restart.");
  }

  const primaryModel = config.openrouter.model;
  const fallbackModel = config.openrouter.modelFallback;

  logger.info(`[AI Service] Primary model: ${primaryModel}, messages: ${messages.length}`);

  // ── Try primary model ──
  try {
    const data = await sendRequest(primaryModel, messages);
    const text: string =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      "";

    if (!text) throw new Error("Empty response from primary model");

    const usedModel: string = data?.model || primaryModel;
    logger.info(`[AI Service] Success with model=${usedModel}, chars=${text.length}`);
    return { success: true, text, model: usedModel };

  } catch (err: any) {
    const msg: string = err?.message || String(err);
    logger.warn(`[AI Service] Primary model '${primaryModel}' failed: ${msg}`);

    // ── Try fallback model ──
    if (fallbackModel && fallbackModel !== primaryModel) {
      logger.info(`[AI Service] Retrying with fallback model: ${fallbackModel}`);
      try {
        const data = await sendRequest(fallbackModel, messages);
        const text: string =
          data?.choices?.[0]?.message?.content ??
          data?.choices?.[0]?.delta?.content ??
          "";

        if (!text) throw new Error("Empty response from fallback model");

        const usedModel: string = data?.model || fallbackModel;
        logger.info(`[AI Service] Fallback success with model=${usedModel}, chars=${text.length}`);
        return { success: true, text, model: usedModel };

      } catch (fallbackErr: any) {
        const fallbackMsg: string = fallbackErr?.message || String(fallbackErr);
        logger.error(`[AI Service] Fallback model '${fallbackModel}' also failed: ${fallbackMsg}`);
      }
    }

    // ── Both failed — throw so the controller returns a real HTTP 500 ──
    const primaryErrMsg = err?.message || String(err);
    const finalMsg = fallbackModel && fallbackModel !== primaryModel
      ? `All AI models failed. Primary (${primaryModel}): ${primaryErrMsg}`
      : `AI model (${primaryModel}) failed: ${primaryErrMsg}`;

    const finalErr: any = new Error(finalMsg);
    finalErr.status = err?.status || 502;
    throw finalErr;
  }
}
