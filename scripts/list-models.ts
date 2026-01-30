import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function list() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    try {
        const result = await genAI.listModels();
        console.log("AVAILABLE MODELS:");
        result.models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${m.name}`);
            }
        });
    } catch (e: any) {
        console.error("FAILED TO LIST MODELS:", e.message);
    }
}
list();
