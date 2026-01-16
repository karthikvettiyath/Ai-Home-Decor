const admin = require('./firebaseAdmin');

async function testFirebase() {
    console.log("Testing Firebase Admin Initialization...");
    try {
        // Just try to access auth service to see if it throws "app not initialized"
        const auth = admin.auth();
        console.log("✅ Firebase Admin Auth service accessed successfully.");
        console.log("Service Account ID:", admin.app().options.credential.serviceAccountId || "Loaded from Cert");
    } catch (error) {
        console.error("❌ Firebase Admin Error:", error);
    }
}

testFirebase();
