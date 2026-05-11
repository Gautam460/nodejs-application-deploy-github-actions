import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../components";
import {
  FaPaperPlane,
  FaMicrophone,
  FaVolumeUp,
  FaVolumeMute,
  FaTrash,
  FaMoon,
  FaSun,
  FaRobot,
  FaUser,
  FaPlus,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { chatbotApi } from "../api/chatbot.api";
import "../assets/css/chat.css";

const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

// ─── Simple inline markdown renderer ─────────────────────────────────────────
const renderMarkdown = (text = "") => {
  return text.split("\n").map((line, i) => {
    // Bullet points: lines starting with "- " or "* "
    const isBullet = /^[\-\*]\s+/.test(line);
    const content = isBullet ? line.replace(/^[\-\*]\s+/, "") : line;

    // Inline: **bold**, *italic*, `code`
    const parts = [];
    let remaining = content;
    let key = 0;
    const inlineRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match;
    while ((match = inlineRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{remaining.slice(lastIndex, match.index)}</span>);
      }
      if (match[2]) parts.push(<strong key={key++}>{match[2]}</strong>);
      else if (match[3]) parts.push(<em key={key++}>{match[3]}</em>);
      else if (match[4]) parts.push(<code key={key++}>{match[4]}</code>);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < remaining.length) {
      parts.push(<span key={key++}>{remaining.slice(lastIndex)}</span>);
    }

    if (isBullet) return <li key={i}>{parts}</li>;
    if (!content.trim()) return <br key={i} />;
    return <p key={i}>{parts}</p>;
  });
};


// ─── Mode config ──────────────────────────────────────────────────────────────
const MODES = [
  {
    value: "custom",
    label: "🤖 Custom Bot",
    desc: "Answers from our trained Q&A database",
    color: "#7c3aed",
  },
  {
    value: "ai",
    label: "✨ AI Chat",
    desc: "Powered by OpenRouter (free tier)",
    color: "#0ea5e9",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toHistoryForApi = (msgs) => {
  const trimmed = Array.isArray(msgs) ? msgs.slice(-20) : [];
  return trimmed
    .filter((m) => m && (m.type === "user" || m.type === "bot") && typeof m.text === "string" && m.text.trim())
    .map((m) => ({ role: m.type === "user" ? "user" : "assistant", content: m.text }));
};

// ─── Main component ───────────────────────────────────────────────────────────
const AiInfo = () => {
  const [mode, setMode] = useState("custom");
  const [modeDropOpen, setModeDropOpen] = useState(false);

  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! I'm your AI assistant. Use the dropdown above to switch between **Custom Bot** (our Q&A database) and **AI Chat** (OpenRouter AI). How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [suggestions, setSuggestions] = useState([]);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sendingRef = useRef(false);
  const modeDropRef = useRef(null);

  // Fetch suggestions from DB for custom bot
  useEffect(() => {
    chatbotApi.getActive()
      .then((res) => setSuggestions(res.data?.data || []))
      .catch(() => {});
  }, []);

  // Close mode dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modeDropRef.current && !modeDropRef.current.contains(e.target)) {
        setModeDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Speech synthesis
  const speakText = (text) => {
    if (!speakEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language === "hi" ? "hi-IN" : "en-US";
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  // Speech recognition setup
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const recognition = new SR();
      recognition.lang = language === "hi" ? "hi-IN" : "en-US";
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        setInput(spoken);
        setTimeout(() => handleSend(spoken), 250);
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [language]);

  // ── Custom bot send ──────────────────────────────────────────────────────────
  const sendCustom = async (userText) => {
    setMessages((prev) => [...prev, { type: "user", text: userText }, { type: "bot", text: "" }]);
    setInput("");
    setIsTyping(true);
    try {
      const res = await chatbotApi.match(userText);
      const { answer } = res.data;
      setIsTyping(false);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.type === "bot") updated[updated.length - 1] = { ...last, text: answer };
        return updated;
      });
      speakText(answer);
    } catch {
      setIsTyping(false);
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.type === "bot") {
          updated[updated.length - 1] = { ...updated[updated.length - 1], text: "Sorry, something went wrong." };
        }
        return updated;
      });
    }
  };

  // ── AI (OpenRouter) send ─────────────────────────────────────────────────────
  const sendAI = async (userText) => {
    const history = toHistoryForApi(messages);

    setMessages((prev) => [...prev, { type: "user", text: userText }, { type: "bot", text: "" }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${apiBaseUrl}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history, language }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Request failed (${res.status})`);
      }

      const aiText = json.text || "";
      setIsTyping(false);
      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.type === "bot") {
          updated[lastIdx] = { ...updated[lastIdx], text: aiText };
        }
        return updated;
      });
      speakText(aiText);
    } catch (err) {
      setIsTyping(false);
      const msg = err instanceof Error ? err.message : "AI request failed";
      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.type === "bot") {
          updated[lastIdx] = { ...updated[lastIdx], text: `❌ ${msg}` };
        } else {
          updated.push({ type: "bot", text: `❌ ${msg}` });
        }
        return updated;
      });
    }
  };

  // ── Unified send ─────────────────────────────────────────────────────────────
  const handleSend = async (textOverride) => {
    const userText = (typeof textOverride === "string" ? textOverride : input).trim();
    if (!userText || sendingRef.current) return;
    sendingRef.current = true;
    try {
      if (mode === "custom") {
        await sendCustom(userText);
      } else {
        await sendAI(userText);
      }
    } finally {
      sendingRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleClearChat = () => {
    setMessages([{ type: "bot", text: "Conversation cleared. How can I help?" }]);
    localStorage.removeItem("chatHistory");
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (listening) recognitionRef.current.stop();
    else recognitionRef.current.start();
    setListening(!listening);
  };

  const currentMode = MODES.find((m) => m.value === mode);

  return (
    <div className={`ai-page-container ${darkMode ? "dark" : "light"}`}>
      <Navbar />
      <div className="gpt-layout">
        {/* ── Sidebar ── */}
        <div className={`gpt-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <button className="new-chat-btn" onClick={handleClearChat}>
              <FaPlus /> New Chat
            </button>
            <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="sidebar-content">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="sidebar-section">
                <h5>Suggestions</h5>
                {suggestions.slice(0, 8).map((faq) => (
                  <div
                    key={faq.id}
                    className="sidebar-item"
                    onClick={() => setInput(faq.question)}
                  >
                    {faq.question}
                  </div>
                ))}
              </div>
            )}

            {/* Settings */}
            <div className="sidebar-section">
              <h5>Settings</h5>
              <div className="sidebar-item" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light Mode" : "Dark Mode"}
              </div>
              <div className="sidebar-item" onClick={() => setSpeakEnabled(!speakEnabled)}>
                {speakEnabled ? <FaVolumeUp /> : <FaVolumeMute />} {speakEnabled ? "Mute Voice" : "Enable Voice"}
              </div>
              <div className="sidebar-item" onClick={handleClearChat}>
                <FaTrash /> Clear History
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar-small"><FaUser /></div>
              <span>User</span>
            </div>
          </div>
        </div>

        {/* ── Main Chat Area ── */}
        <div className="gpt-main">
          {/* Mobile header */}
          <div className="mobile-header">
            <button onClick={() => setSidebarOpen(true)}><FaBars /></button>
            <span>AI Assistant</span>
          </div>

          {/* Mode selector bar */}
          <div className="mode-selector-bar">
            <div className="mode-selector-inner" ref={modeDropRef}>
              <button
                className="mode-toggle-btn"
                onClick={() => setModeDropOpen((o) => !o)}
                style={{ borderColor: currentMode?.color }}
              >
                <span className="mode-dot" style={{ background: currentMode?.color }} />
                <span className="mode-label">{currentMode?.label}</span>
                <FaChevronDown
                  size={11}
                  style={{
                    marginLeft: 6,
                    transform: modeDropOpen ? "rotate(180deg)" : "none",
                    transition: "0.2s",
                  }}
                />
              </button>

              {modeDropOpen && (
                <div className="mode-dropdown">
                  {MODES.map((m) => (
                    <button
                      key={m.value}
                      className={`mode-option ${mode === m.value ? "active" : ""}`}
                      onClick={() => { setMode(m.value); setModeDropOpen(false); }}
                      style={mode === m.value ? { borderColor: m.color } : {}}
                    >
                      <div className="mode-option-dot" style={{ background: m.color }} />
                      <div>
                        <div className="mode-option-title">{m.label}</div>
                        <div className="mode-option-desc">{m.desc}</div>
                      </div>
                      {mode === m.value && <span className="mode-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mode-info-pill" style={{ color: currentMode?.color }}>
              {mode === "custom"
                ? `${suggestions.length} Q&A entries in database`
                : "Using OpenRouter free tier"}
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container" style={{ overflowY: "auto", flex: 1 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.type}`}>
                <div className="message-content">
                  <div
                    className={`avatar ${msg.type} ${msg.type === "bot" && isSpeaking && i === messages.length - 1 ? "speaking" : ""}`}
                    style={msg.type === "bot" ? { background: currentMode?.color } : {}}
                  >
                    {msg.type === "bot" ? <FaRobot /> : <FaUser />}
                  </div>
                  <div className="text-bubble">
                    <div className="sender-name">
                      {msg.type === "bot" ? currentMode?.label : "You"}
                    </div>
                    <div className="markdown-body">
                      <ul style={{ listStyle: "disc", paddingLeft: 20, margin: 0 }}>
                        {renderMarkdown(msg.text || "").filter((el) => el?.type === "li")}
                      </ul>
                      {renderMarkdown(msg.text || "").filter((el) => el?.type !== "li")}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-row bot">
                <div className="message-content">
                  <div className="avatar bot" style={{ background: currentMode?.color }}>
                    <FaRobot />
                  </div>
                  <div className="text-bubble typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-container-wrapper">
            <div className="input-box">
              <input
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === "custom"
                    ? "Ask from our Q&A knowledge base..."
                    : "Message AI (powered by OpenRouter)..."
                }
              />
              <div className="input-actions">
                <button
                  className={`action-btn ${listening ? "active" : ""}`}
                  onClick={toggleMic}
                  title="Voice input"
                >
                  <FaMicrophone />
                </button>
                <button
                  className="send-btn"
                  onClick={handleSend}
                  disabled={!input}
                  style={{ background: currentMode?.color }}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
            <div className="disclaimer">
              {mode === "custom"
                ? "Custom Bot answers are pre-defined by our team. Switch to AI Chat for open-ended questions."
                : "AI Chat powered by OpenRouter — responses may not always be accurate."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInfo;
