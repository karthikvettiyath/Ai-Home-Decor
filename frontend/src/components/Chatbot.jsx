import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '../services/aiService';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hi! I\'m your AI Design Assistant. Ask me about color palettes, furniture styles, or layout ideas!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const getLocalFallbackReply = (text) => {
        const t = text.toLowerCase();
        if (t.includes('color') || t.includes('paint')) return "Since I'm in offline mode, I suggest sticking to the 60-30-10 rule: 60% neutral main color, 30% secondary color, and 10% accent color. Try a warm beige text with navy accents!";
        if (t.includes('sofa') || t.includes('chair') || t.includes('furniture')) return "For furniture, prioritize comfort and scale. Measure your space twice! A modular sectional is great for flexibility in living rooms.";
        if (t.includes('kitchen')) return "In kitchens, lighting is key. Ensure you have task lighting under cabinets in addition to overhead lights.";
        if (t.includes('small') || t.includes('space')) return "For small spaces, use mirrors to reflect light and create the illusion of depth. Multi-functional furniture is your best friend.";
        return "I'm currently offline (API Limit), but I can still help you generate a full room design if you go to the main tool!";
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');

        // Add user message
        const newHistory = [...messages, { role: 'user', text: userMsg }];
        setMessages(newHistory);
        setLoading(true);

        try {
            // Call API
            const reply = await chatWithAI(userMsg, newHistory);

            // Check if backend returned a specific fallback indicator
            if (reply.includes("demo mode") || reply.includes("too many requests")) {
                const smartReply = getLocalFallbackReply(userMsg);
                setMessages(prev => [...prev, { role: 'ai', text: `(Offline) ${smartReply}` }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: reply }]);
            }
        } catch (error) {
            const fallback = getLocalFallbackReply(userMsg);
            setMessages(prev => [...prev, { role: 'ai', text: `(Connection Error) ${fallback}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all border border-white/20"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl bg-neutral-900/95 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col max-h-[600px]"
                    >
                        {/* Header */}
                        <div className="bg-white/5 p-4 border-b border-white/10 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Design Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-xs text-gray-400">Online</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-purple-600 text-white rounded-br-none'
                                            : 'bg-white/10 text-gray-200 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-purple-400" />
                                        <span className="text-xs text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-500 transition"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
