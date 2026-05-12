import dotenv from 'dotenv';
dotenv.config();

async function listAllModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found in .env');
        return;
    }

    const versions = ['v1beta', 'v1'];
    
    for (const v of versions) {
        console.log(`\nChecking API Version: ${v}`);
        const url = `https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (response.ok) {
                console.log(`✅ Success for ${v}! Found ${data.models?.length || 0} models.`);
                data.models.forEach(m => {
                    console.log(` - ${m.name}`);
                });
            } else {
                console.log(`❌ Error for ${v}: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            console.log(`💥 Request Failed for ${v}:`, err.message);
        }
    }
}

listAllModels();
