import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// ============================================================================
// GEMINI SERVICE WRAPPER
// ============================================================================

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY;

/**
 * Returns a configured instance of Gemini 3.1 Pro via LangChain.
 * @param temperature Creativity level (0.0 - 1.0)
 * @returns ChatGoogleGenerativeAI instance or null if API key is missing.
 */
export const getGeminiModel = (temperature: number = 0.7, apiKey?: string) => {
    const key = apiKey || API_KEY;
    if (!key) {
        console.warn("GeminiService: VITE_GOOGLE_API_KEY is not set.");
        return null;
    }

    return new ChatGoogleGenerativeAI({
        model: "gemini-3.1-pro", // Specific model version as requested
        maxOutputTokens: 2048,
        temperature,
        apiKey: key,
    });
};

/**
 * Returns a configured instance of Gemini Embeddings.
 * Uses "text-embedding-004" which is the current state-of-the-art from Google.
 * @returns GoogleGenerativeAIEmbeddings instance or null if API key is missing.
 */
export const getGeminiEmbeddings = () => {
    if (!API_KEY) {
        console.warn("GeminiService: VITE_GOOGLE_API_KEY is not set.");
        return null; // Let the consumer handle the fallback logic
    }

    return new GoogleGenerativeAIEmbeddings({
        modelName: "text-embedding-004",
        apiKey: API_KEY,
    });
};
