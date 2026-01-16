import React, { useState } from 'react';
import { Palette, ArrowRight, CheckCircle, RefreshCcw } from 'lucide-react';

const questions = [
    {
        id: 1,
        question: "How do you want your room to feel?",
        options: [
            { text: "Cozy and Warm", style: "Rustic" },
            { text: "Clean and Airy", style: "Minimalist" },
            { text: "Rich and Moody", style: "Industrial" },
            { text: "Bright and Playful", style: "Bohemian" }
        ]
    },
    {
        id: 2,
        question: "Which material do you prefer?",
        options: [
            { text: "Natural Wood & Stone", style: "Rustic" },
            { text: "Glass & Steel", style: "Modern" },
            { text: "Hemp & Rattan", style: "Bohemian" },
            { text: "Velvet & Brass", style: "Glam" }
        ]
    },
    {
        id: 3,
        question: "Pick a color palette",
        options: [
            { text: "Neutrals & Earth Tones", style: "Minimalist" },
            { text: "Black, Grey & Brick", style: "Industrial" },
            { text: "Jewel Tones & Gold", style: "Glam" },
            { text: "Pastels & White", style: "Scandinavian" }
        ]
    },
    {
        id: 4,
        question: "What's your ideal furniture shape?",
        options: [
            { text: "Clean straight lines", style: "Modern" },
            { text: "Curved and soft", style: "Mid-Century" },
            { text: "Rough and raw", style: "Industrial" },
            { text: "Ornate and detailed", style: "Traditional" }
        ]
    },
    {
        id: 5,
        question: "What about decor?",
        options: [
            { text: "Less is more", style: "Minimalist" },
            { text: "Plants everywhere!", style: "Bohemian" },
            { text: "Vintage finds", style: "Eclectic" },
            { text: "Art pieces", style: "Modern" }
        ]
    }
];

const StyleQuiz = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);

    const handleAnswer = (style) => {
        const newAnswers = [...answers, style];
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers) => {
        const counts = {};
        finalAnswers.forEach(s => {
            counts[s] = (counts[s] || 0) + 1;
        });

        const topStyle = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        setResult(topStyle);
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers([]);
        setResult(null);
    };

    return (
        <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-2 flex justify-center items-center gap-2">
                <Palette className="text-pink-400" /> Style Personality Quiz
            </h1>
            <p className="text-gray-400 mb-10">Discover your unique interior design style in less than a minute.</p>

            {!result ? (
                <div className="bg-neutral-900/50 p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>

                    <h2 className="text-2xl font-bold text-white mb-8">{questions[step].question}</h2>

                    <div className="grid gap-4">
                        {questions[step].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option.style)}
                                className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-500/50 transition-all hover:scale-[1.02]"
                            >
                                <span className="text-gray-200 font-medium group-hover:text-white">{option.text}</span>
                                <ArrowRight size={18} className="text-gray-500 group-hover:text-pink-400 opacity-0 group-hover:opacity-100 transition" />
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 text-xs text-gray-500 uppercase tracking-widest">
                        Question {step + 1} of {questions.length}
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in bg-gradient-to-b from-purple-900/40 to-neutral-900/40 p-10 rounded-3xl border border-purple-500/30">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/20 text-purple-300 mb-6 ring-4 ring-purple-500/10">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-gray-400 text-sm uppercase tracking-wide mb-2">Your Design Personality is</h2>
                    <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6">
                        {result}
                    </h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                        You love aesthetics that speak to this style. Use our AI Generator with the keyword <strong>"{result}"</strong> to get perfect results!
                    </p>

                    <button
                        onClick={resetQuiz}
                        className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition"
                    >
                        <RefreshCcw size={16} /> Retake Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default StyleQuiz;
