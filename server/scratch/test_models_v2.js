import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found in .env');
        return;
    }

    console.log('Testing with API Key:', apiKey.substring(0, 10) + '...');

    try {
        // Try to list models using default initialization
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Note: The SDK might not expose a direct "listModels" method easily without deeper imports,
        // but we can test common ones.
        
        const testModels = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro',
            'gemini-pro-vision'
        ];

        for (const modelName of testModels) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                // Try a very simple prompt
                const result = await model.generateContent('hi');
                console.log(`✅ Model ${modelName} is WORKING.`);
            } catch (err) {
                console.log(`❌ Model ${modelName} FAILED:`, err.message);
            }
        }
    } catch (error) {
        console.error('General Error:', error);
    }
}

checkModels();
