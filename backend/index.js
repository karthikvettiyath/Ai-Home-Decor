const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const crypto = require("crypto");

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "*"
}));
app.use(express.json());

// Initialize SDK
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing in backend .env");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Smart Fallback System ---
const smartFallbacks = {
    bedroom: {
        concept: "Serene Sanctuary Bedroom",
        colorPalette: ["Soft Sage #9DC183", "Cream #FFFDD0", "Warm Oak #C6A664"],
        furniture: ["Upholstered Platform Bed", "Mid-century Nightstands", "Velvet Accent Chair"],
        lighting: "Dimmable bedside sconces, warm ambient pendant light",
        layout: "Bed centered on main wall, seating nook by window",
        decor: "Textured wool rug, botanical wall art, layered bedding",
        image: "/fallback_images/bedroom.png"
    },
    kitchen: {
        concept: "Modern Farmhouse Kitchen",
        colorPalette: ["Navy Blue #000080", "Crisp White #FFFFFF", "Brass #B5A642"],
        furniture: ["Large Kitchen Island with seating", "Open Shelving units", "Bar Stools"],
        lighting: "Industrial glass pendants over island, under-cabinet warm LEDs",
        layout: "Open concept with work triangle optimization",
        decor: "Potted herbs, vintage runner rug, copper cookware display",
        image: "/fallback_images/kitchen.png"
    },
    living: {
        concept: "Urban Industrial Living Room",
        colorPalette: ["Charcoal #36454F", "Brick Red #CB4154", "Iron Grey #434B4D"],
        furniture: ["Leather Chesterfield Sofa", "Reclaimed Wood Coffee Table", "Metal Bookshelves"],
        lighting: "Floor lamp with Edison bulbs, track lighting",
        layout: "Conversational arrangement focused on fireplace or TV",
        decor: "Abstract metal art, geometric throw pillows, large area rug",
        image: "/fallback_images/living.png"
    },
    dining: {
        concept: "Elegant Formal Dining",
        colorPalette: ["Deep Burgundy #800020", "Gold #FFD700", "Cream #FFFDD0"],
        furniture: ["Mahogany Dining Table", "Upholstered Dining Chairs", "Buffet Sideboard"],
        lighting: "Crystal chandelier, wall sconces",
        layout: "Central table arrangement with ample circulation space",
        decor: "Large mirror, centerpiece vase, table runner",
        image: "/fallback_images/dining.png"
    },
    bathroom: {
        concept: "Spa-Inspired Bathroom",
        colorPalette: ["Seafoam Green #93E9BE", "White #FFFFFF", "Bamboo #E3C69D"],
        furniture: ["Freestanding Bathtub", "Floating Vanity", "Teak Shower Bench"],
        lighting: "Recessed spotlights, backlit mirror",
        layout: "Wet zone separated from dry vanity area",
        decor: "Plush towels, aromatherapy candles, bamboo mats",
        image: "/fallback_images/bathroom.png"
    },
    office: {
        concept: "Minimalist Productivity Hub",
        colorPalette: ["Cool Grey #8C92AC", "Matte Black #28282B", "Pure White #FFFFFF"],
        furniture: ["Ergonomic Mesh Chair", "Standing Desk", "Floating Shelves"],
        lighting: "Adjustable desk lamp, bright overhead recessed lighting",
        layout: "Desk facing room entry, dedicated reading corner",
        decor: "Succulent plants, motivational typography art, cable organizers",
        image: "/fallback_images/office.png"
    },
    bookshelf: {
        concept: "Cozy Library Corner",
        colorPalette: ["Dark Walnut #5C4033", "Leather Brown #8B4513", "Warm Beige #F5F5DC"],
        furniture: ["Floor-to-ceiling Bookshelves", "Wingback Reading Chair", "Ottoman"],
        lighting: "Reading lamp, shelf accent lighting",
        layout: "Corner arrangement focused on comfort and accessibility",
        decor: "Hardcover books collection, small plants, throw blanket",
        image: "/fallback_images/bookshelf.png"
    },
    tables: {
        concept: "Stylish Coffee Table Display",
        colorPalette: ["Neutral Greys #808080", "Black #000000", "Metallics #D4AF37"],
        furniture: ["Modern Coffee Table", "Side Tables", "Nested Tables"],
        lighting: "Ambient room lighting",
        layout: "Central placement in seating area",
        decor: "Art books, decorative trays, ceramic vases",
        image: "/fallback_images/tables.png"
    },
    default: {
        concept: "Modern Minimal Living Space",
        colorPalette: ["Warm White #F5F5F5", "Charcoal Gray #2E2E2E", "Natural Wood #C2A878"],
        furniture: ["Low-profile sectional sofa", "Wooden coffee table", "Accent lounge chair"],
        lighting: "Soft ambient ceiling lights combined with warm floor lamps",
        layout: "Open-plan layout emphasizing natural light and clean movement",
        decor: "Indoor plants, textured rugs, abstract wall art",
        image: "/fallback_images/living.png"
    }
};

function getSmartFallback(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes("bed") || p.includes("sleep")) return smartFallbacks.bedroom;
    if (p.includes("kitchen") || p.includes("cook")) return smartFallbacks.kitchen;
    if (p.includes("bath") || p.includes("wash") || p.includes("toilet")) return smartFallbacks.bathroom;
    if (p.includes("dining") || p.includes("eat") || p.includes("dinner")) return smartFallbacks.dining;
    if (p.includes("book") || p.includes("read") || p.includes("library") || p.includes("shelf")) return smartFallbacks.bookshelf;
    if (p.includes("office") || p.includes("work") || p.includes("desk")) return smartFallbacks.office;
    if (p.includes("table")) return smartFallbacks.tables;
    if (p.includes("living") || p.includes("sofa") || p.includes("lounge") || p.includes("tv")) return smartFallbacks.living;
    return smartFallbacks.default;
}

let lastCallTime = 0;

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const GEMINI_ENABLED = process.env.GEMINI_ENABLED !== "false";
const CACHE_TTL_MS = Number(process.env.DESIGN_CACHE_TTL_MS || 10 * 60 * 1000); // 10 min

let geminiCooldownUntil = 0;
let lastGeminiLogAt = 0;

// Simple in-memory cache + in-flight de-dupe (good enough for single-node dev)
const responseCache = new Map(); // key -> { expiresAt, payload }
const inflight = new Map(); // key -> Promise<payload>

function makeCacheKey({ prompt, image }) {
    const normalizedPrompt = String(prompt || "").trim();
    // distinct cache key if image is present (hash the image string to save space/ensure uniqueness)
    const normalizedImage = String(image || "").substring(0, 100) + (image ? image.length : 0);
    return crypto.createHash("sha256").update(normalizedPrompt + normalizedImage).digest("hex");
}

function cacheGet(key) {
    const entry = responseCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        responseCache.delete(key);
        return null;
    }
    return entry.payload;
}

function cacheSet(key, payload, ttlMs = CACHE_TTL_MS) {
    responseCache.set(key, { expiresAt: Date.now() + ttlMs, payload });
}

function extractRetryAfterSeconds(error) {
    const details = error?.errorDetails;
    if (Array.isArray(details)) {
        const retryInfo = details.find((d) => d && d["@type"] === "type.googleapis.com/google.rpc.RetryInfo");
        const retryDelay = retryInfo?.retryDelay;
        if (typeof retryDelay === "string") {
            const match = retryDelay.match(/^(\d+)s$/);
            if (match) return Number(match[1]);
        }
    }
    return null;
}

function isQuotaOrRateLimitError(error) {
    const status = error?.status;
    if (status === 429) return true;
    const msg = String(error?.message || "");
    return msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate");
}

function isDailyQuotaError(error) {
    const details = error?.errorDetails;
    if (!Array.isArray(details)) return false;
    const quotaFailure = details.find((d) => d && d["@type"] === "type.googleapis.com/google.rpc.QuotaFailure");
    const violations = quotaFailure?.violations;
    if (!Array.isArray(violations)) return false;
    return violations.some((v) => String(v?.quotaId || "").toLowerCase().includes("perday"));
}

// Utility: call Gemini using SDK
async function callGemini(prompt, imageBase64) {
    try {
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        const parts = [
            {
                text: `
You are an expert interior designer.

User request:
"${prompt}"

Return STRICT JSON ONLY.
No markdown.
No backticks.

Format:
{
  "concept": "Short title",
  "colorPalette": ["Color + hex"],
  "furniture": ["Item 1", "Item 2"],
  "lighting": "Description",
  "layout": "Description",
  "decor": "Description",
  "image": "URL"
}
`
            }
        ];

        if (imageBase64) {
            const matches = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
                const mimeType = `image/${matches[1]}`;
                const data = matches[2];
                parts.unshift({
                    inlineData: {
                        data: data,
                        mimeType: mimeType
                    }
                });
            }
        }

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: parts
                }
            ]
        });

        // SDK response handling
        const response = await result.response;
        return response.text();
    } catch (error) {
        throw error;
    }
}

// Utility: call Gemini Chat
async function callGeminiChat(message, history = []) {
    try {
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        // Convert simplistic history to Gemini format
        const chatHistory = history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "You are an expert interior design assistant. Help the user with design advice, color matching, and furniture selection. Keep answers concise and helpful." }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to help with professional interior design advice." }]
                },
                ...chatHistory
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        throw error;
    }
}

app.get("/", (req, res) => {
    res.send("Backend running successfully");
});

const { authenticateUser } = require("./middleware/auth");

app.post("/api/generate-design", authenticateUser, async (req, res) => {
    try {
        // Rate limit (7s)
        const now = Date.now();
        if (now - lastCallTime < 7000) {
            const retryAfterSeconds = Math.ceil((7000 - (now - lastCallTime)) / 1000);
            res.set("Retry-After", String(retryAfterSeconds));
            return res.status(429).json({
                success: false,
                message: "Please wait a few seconds",
                retryAfterSeconds
            });
        }
        lastCallTime = now;

        const { prompt, image } = req.body;
        if ((!prompt || !prompt.trim()) && !image) {
            return res.status(400).json({
                success: false,
                message: "Prompt or image required"
            });
        }

        const cacheKey = makeCacheKey({ prompt, image });
        const cached = cacheGet(cacheKey);
        if (cached) {
            return res.json({
                success: true,
                ...cached,
                cached: true
            });
        }

        if (inflight.has(cacheKey)) {
            const payload = await inflight.get(cacheKey);
            return res.json({
                success: true,
                ...payload,
                deduped: true
            });
        }

        const work = (async () => {
            // Skip Gemini if disabled/misconfigured or cooling down
            if (!process.env.GEMINI_API_KEY || !GEMINI_ENABLED || Date.now() < geminiCooldownUntil) {
                const retryAfterSeconds = Date.now() < geminiCooldownUntil
                    ? Math.max(1, Math.ceil((geminiCooldownUntil - Date.now()) / 1000))
                    : null;
                const fallbackData = getSmartFallback(prompt || "");
                fallbackData.note = "Fallback used (Gemini disabled/unavailable)";

                return {
                    source: "fallback",
                    data: fallbackData,
                    meta: {
                        gemini: {
                            enabled: Boolean(process.env.GEMINI_API_KEY) && GEMINI_ENABLED,
                            model: GEMINI_MODEL,
                            cooldown: Date.now() < geminiCooldownUntil,
                            retryAfterSeconds
                        }
                    }
                };
            }

            // Try Gemini
            try {
                const text = await callGemini(prompt, image);

                let parsed;
                try {
                    // Remove markdown code blocks if present
                    const cleaned = text.replace(/```json|```/g, "").trim();
                    parsed = JSON.parse(cleaned);
                } catch {
                    parsed = { rawText: text };
                }

                return {
                    source: GEMINI_MODEL,
                    data: parsed
                };
            } catch (err) {
                if (isQuotaOrRateLimitError(err)) {
                    const retryAfterSeconds = extractRetryAfterSeconds(err) ?? 60;
                    const isDaily = isDailyQuotaError(err);
                    // If daily quota is exceeded, avoid spamming Gemini for a while.
                    const cooldownSeconds = isDaily ? Math.max(retryAfterSeconds, 6 * 60 * 60) : retryAfterSeconds;
                    geminiCooldownUntil = Date.now() + cooldownSeconds * 1000;

                    const nowLog = Date.now();
                    if (nowLog - lastGeminiLogAt > 60_000) {
                        lastGeminiLogAt = nowLog;
                        console.warn(
                            `⚠️ Gemini rate/quota limited (HTTP 429). Cooling down for ~${cooldownSeconds}s. ` +
                            `Set GEMINI_ENABLED=false to silence attempts, or configure billing/quotas. Model=${GEMINI_MODEL}`
                        );
                    }

                    const fallbackData = getSmartFallback(prompt || "");
                    fallbackData.note = "Fallback used due to Gemini rate/quota limit";

                    return {
                        source: "fallback",
                        data: fallbackData,
                        meta: {
                            gemini: {
                                enabled: true,
                                model: GEMINI_MODEL,
                                errorCode: "GEMINI_RATE_LIMITED",
                                retryAfterSeconds
                            }
                        }
                    };
                }

                // Unexpected failure: still fall back, but log it.
                console.warn("⚠️ Gemini failed:", err?.message || err);
                // Fallback response (guaranteed demo)
                const fallbackData = getSmartFallback(req.body.prompt || "");
                fallbackData.note = "Fallback used due to Gemini error (Smart Demo Mode)";

                return {
                    source: "fallback",
                    data: fallbackData,
                    meta: {
                        gemini: {
                            enabled: true,
                            model: GEMINI_MODEL,
                            errorCode: "GEMINI_ERROR"
                        }
                    }
                };
            }
        })();

        inflight.set(cacheKey, work);
        const payload = await work;
        inflight.delete(cacheKey);

        cacheSet(cacheKey, payload);

        return res.json({
            success: true,
            ...payload
        });
    } catch (err) {
        // If something outside the handler blew up (should be rare), return a predictable error.
        console.error("❌ /api/generate-design handler crashed:", err?.message || err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

app.post("/api/chat", authenticateUser, async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ success: false, message: "Message required" });

        // Check if fallback mode is active (Gemini disabled/cooling down)
        if (!process.env.GEMINI_API_KEY || !GEMINI_ENABLED || Date.now() < geminiCooldownUntil) {
            return res.json({
                success: true,
                reply: "I'm currently in demo mode (offline). If I were fully connected, I'd give you specific advice about that! For now, try generating a full design plan.",
                source: "fallback"
            });
        }

        try {
            const reply = await callGeminiChat(message, history || []);
            res.json({ success: true, reply, source: GEMINI_MODEL });
        } catch (err) {
            console.error("Gemini Chat Error:", err);
            if (isQuotaOrRateLimitError(err)) {
                // Trigger cooldown logic roughly similar to main generation
                geminiCooldownUntil = Date.now() + 60000;
                return res.json({
                    success: true,
                    reply: "I'm receiving too many requests right now. Please ask me again in a minute!",
                    source: "fallback"
                });
            }
            res.status(500).json({ success: false, message: "AI Error" });
        }

    } catch (err) {
        console.error("/api/chat error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.listen(5000, () => {
    console.log("🚀 Backend running at http://localhost:5000");
});
