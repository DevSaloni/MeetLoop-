import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('c:/Users/Saloni Pawar/Documents/meetloop/server/.env') });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Testing models for API Key:", key ? key.substring(0, 10) + "..." : "MISSING");
    
    if (!key) return;

    const genAI = new GoogleGenerativeAI(key);
    const modelsToTest = [
        'gemini-1.5-flash', 
        'gemini-1.5-flash-latest', 
        'gemini-1.5-pro', 
        'gemini-1.5-pro-latest', 
        'gemini-pro'
    ];
    
    for (const modelName of modelsToTest) {
        try {
            console.log(`Trying ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("test");
            console.log(`✅ Model ${modelName} is WORKING: ${result.response.text().substring(0, 20)}`);
        } catch (err) {
            console.log(`❌ Model ${modelName} FAILED: ${err.message}`);
        }
    }
}

listModels();
