import { db } from "../config/db.js";
import { cartCustomFields, returnsPolicies, returnRequests, aiFeatures, aiFaqs } from "../models/schema.js";

export class DynamicPagesService {
    // Cart Custom Fields
    async getCartCustomFields() {
        return await db.select().from(cartCustomFields).where({ active: 1 }).orderBy(cartCustomFields.order);
    }

    // Returns Policies
    async getReturnsPolicies() {
        return await db.select().from(returnsPolicies).where({ active: 1 }).orderBy(returnsPolicies.order);
    }

    async submitReturnRequest(data: any) {
        return await db.insert(returnRequests).values(data);
    }

    async getReturnRequests() {
        return await db.select().from(returnRequests).orderBy(returnRequests.createdAt);
    }

    // AI Features
    async getAiFeatures() {
        return await db.select().from(aiFeatures).where({ active: 1 }).orderBy(aiFeatures.order);
    }

    async getAiFaqs(category?: string) {
        if (category) {
            return await db.select().from(aiFaqs).where({ active: 1, category }).orderBy(aiFaqs.order);
        }
        return await db.select().from(aiFaqs).where({ active: 1 }).orderBy(aiFaqs.order);
    }

    // Seed data
    async seedDynamicPages() {
        try {
            // Seed cart custom fields
            const customFieldsCheck = await db.select().from(cartCustomFields);
            if (customFieldsCheck.length === 0) {
                await db.insert(cartCustomFields).values([
                    {
                        fieldName: "gift_message",
                        fieldType: "textarea",
                        fieldLabel: "Gift Message",
                        fieldPlaceholder: "Add a personalized message for the recipient",
                        required: 0,
                        order: 1
                    },
                    {
                        fieldName: "delivery_instructions",
                        fieldType: "text",
                        fieldLabel: "Delivery Instructions",
                        fieldPlaceholder: "Any special delivery instructions?",
                        required: 0,
                        order: 2
                    },
                    {
                        fieldName: "gift_wrap",
                        fieldType: "checkbox",
                        fieldLabel: "Gift Wrap (₹50 extra)",
                        required: 0,
                        order: 3
                    }
                ]);
            }

            // Seed returns policies
            const policiesCheck = await db.select().from(returnsPolicies);
            if (policiesCheck.length === 0) {
                await db.insert(returnsPolicies).values([
                    {
                        title: "30-Day Return Policy",
                        content: "<p>We offer a hassle-free 30-day return policy. If you're not satisfied with your purchase, you can return it within 30 days for a full refund.</p>",
                        icon: "fa-calendar",
                        order: 1
                    },
                    {
                        title: "Free Return Shipping",
                        content: "<p>Return shipping is on us! We'll provide a prepaid shipping label for all returns within India.</p>",
                        icon: "fa-truck",
                        order: 2
                    },
                    {
                        title: "Easy Refund Process",
                        content: "<p>Refunds are processed within 5-7 business days after we receive your return. The amount will be credited to your original payment method.</p>",
                        icon: "fa-refresh",
                        order: 3
                    },
                    {
                        title: "Condition Requirements",
                        content: "<p>Items must be unused, unworn, and in original packaging with all tags attached. We cannot accept returns on sale items or gift cards.</p>",
                        icon: "fa-check-circle",
                        order: 4
                    }
                ]);
            }

            // Seed AI features
            const aiFeaturesCheck = await db.select().from(aiFeatures);
            if (aiFeaturesCheck.length === 0) {
                await db.insert(aiFeatures).values([
                    {
                        title: "AI-Powered Size Recommendations",
                        description: "Get personalized size recommendations based on your measurements and previous purchases. Our AI analyzes thousands of fit data points to suggest the perfect size for you.",
                        icon: "fa-magic",
                        order: 1
                    },
                    {
                        title: "Smart Style Suggestions",
                        description: "Discover outfits that match your style preferences. Our AI learns from your browsing history and suggests complementary items to complete your look.",
                        icon: "fa-lightbulb-o",
                        order: 2
                    },
                    {
                        title: "Virtual Try-On",
                        description: "See how clothes look on you before buying. Upload your photo and our AI will show you how different outfits would look on your body type.",
                        icon: "fa-camera",
                        order: 3
                    },
                    {
                        title: "Price Drop Alerts",
                        description: "Never miss a deal! Our AI tracks price changes and notifies you when items on your wishlist go on sale.",
                        icon: "fa-bell",
                        order: 4
                    }
                ]);
            }

            // Seed AI FAQs
            const faqsCheck = await db.select().from(aiFaqs);
            if (faqsCheck.length === 0) {
                await db.insert(aiFaqs).values([
                    {
                        question: "How accurate are the AI size recommendations?",
                        answer: "Our AI size recommendations have a 95% accuracy rate based on customer feedback. The system improves over time as it learns from more data.",
                        category: "Size Recommendations",
                        order: 1
                    },
                    {
                        question: "Is my data safe when using AI features?",
                        answer: "Absolutely! We use industry-standard encryption and never share your personal data with third parties. All AI processing is done securely on our servers.",
                        category: "Privacy",
                        order: 2
                    },
                    {
                        question: "Can I disable AI features?",
                        answer: "Yes, you can disable AI features anytime from your account settings. However, you'll miss out on personalized recommendations and smart features.",
                        category: "Settings",
                        order: 3
                    },
                    {
                        question: "How does the virtual try-on work?",
                        answer: "Upload a full-body photo, and our AI will map the clothing onto your image using advanced computer vision. It takes into account your body shape and proportions for realistic results.",
                        category: "Virtual Try-On",
                        order: 4
                    }
                ]);
            }

            return { message: "Dynamic pages data seeded successfully" };
        } catch (error) {
            console.error("Seeding error:", error);
            throw error;
        }
    }
}
