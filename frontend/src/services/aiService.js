import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const generateDesign = async (prompt, imageBase64 = null) => {
    const res = await axios.post(
        `${API_URL}/api/generate-design`,
        {
            prompt,
            image: imageBase64
        },
        {
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
    const res = await axios.post(`${API_URL}/api/chat`, { message, history });
    return res.data.reply;
};
