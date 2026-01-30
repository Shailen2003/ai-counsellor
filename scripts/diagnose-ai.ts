import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Manually load .env since we are in a script
dotenv.config({ path: path.join(process.cwd(), ".env") });

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-pro"
];

async function runDiagnostics() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("CRITICAL: GEMINI_API_KEY not found in .env");
        return;
    }

    console.log(`Starting diagnostics with API Key: ${apiKey.substring(0, 6)}...`);
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of modelsToTest) {
        try {
            process.stdout.write(`Testing [${modelName}]... `);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("hi");
            const text = result.response.text();
            console.log(`✅ SUCCESS (Response: ${text.substring(0, 10)}...)`);
            console.log(`\n\nRECOMMENDATION: Use "${modelName}" in gemini.ts`);
            return;
        } catch (e: any) {
            if (e.message.includes("404")) {
                console.log("❌ 404 (Not Found)");
            } else if (e.message.includes("429")) {
                console.log("❌ 429 (Quota Exceeded)");
            } else {
                console.log(`❌ ERROR: ${e.message.substring(0, 50)}...`);
            }
        }
    }
    console.log("\nNo models worked. Please check your Google AI Studio account for billing/terms issues.");
}

runDiagnostics();
