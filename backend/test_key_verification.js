async function testApi() {
    console.log("Testing Chat API...");
    try {
        const chatRes = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Hello, are you working?" })
        });
        const chatData = await chatRes.json();
        console.log("Chat Response:", chatData);
    } catch (err) {
        console.error("Chat API Failed:", err.message);
    }

    console.log("\nTesting Design Generation API...");
    try {
        const designRes = await fetch('http://localhost:5000/api/generate-design', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: "A modern minimalist living room" })
        });
        const designData = await designRes.json();
        console.log("Design Response:", JSON.stringify(designData, null, 2));
    } catch (err) {
        console.error("Design API Failed:", err.message);
    }
}

testApi();
