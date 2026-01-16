import axios from "axios";
import { auth } from "../firebase-config";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

export const generateDesign = async (prompt, imageBase64 = null) => {
    const headers = await getAuthHeaders();
    const res = await axios.post(
        `${API_URL}/api/generate-design`,
        {
            prompt,
            image: imageBase64
        },
        {
            headers,
            timeout: 60_000
        }
    );

    if (res.data && res.data.success === false) {
        const err = new Error(res.data.message || "Request failed");
        err.response = { status: res.status, data: res.data };
        throw err;
    }

    return res.data.data;
};

export const chatWithAI = async (message, history) => {
    const headers = await getAuthHeaders();
    const res = await axios.post(`${API_URL}/api/chat`, { message, history }, { headers });
    return res.data.reply;
};
