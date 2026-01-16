const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

const fs = require('fs');
const path = require('path');

if (!admin.apps.length) {
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
        try {
            const serviceAccount = require(serviceAccountPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log("✅ Firebase Admin initialized with serviceAccountKey.json");
        } catch (error) {
            console.error("❌ Failed to load serviceAccountKey.json:", error.message);
        }
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Option 1: Full JSON string
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        // Option 2: Individual vars
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle newlines in private key
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            })
        });
    } else {
        console.warn("⚠️ Firebase Admin not initialized: Missing credentials. Auth verification will fail.");
    }
}

module.exports = admin;
