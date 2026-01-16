const admin = require("../firebaseAdmin");

const authenticateUser = async (req, res, next) => {
    // If backend is in "demo/dev" mode without firebase creds, maybe we want to bypass?
    // But usually safer to fail secure. 
    // Let's check for token.

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(403).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

module.exports = { authenticateUser };
