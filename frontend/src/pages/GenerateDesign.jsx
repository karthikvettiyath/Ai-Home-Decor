import React, { useState } from 'react';
import { generateDesign } from '../services/aiService';
import { Sparkles, Palette, Armchair, Lightbulb, Layout, ArrowRight, ImageIcon, Upload, X } from 'lucide-react';

const GenerateDesign = () => {
    const [prompt, setPrompt] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearFile = () => {
        setUploadedFile(null);
        setPreviewUrl(null);
        setSelectedImage(null); // Clear the encoded image as well
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!prompt.trim() && !selectedImage) { // Check for either prompt or image
            setError('Please provide a prompt or upload an image.');
            return;
        }

        setLoading(true);
        setResult(null);
        setError('');

        try {
            const data = await generateDesign(prompt, selectedImage); // Pass selectedImage
            setResult(data);

            // Save design to localStorage
            const savedDesigns = JSON.parse(localStorage.getItem('ai_home_decor_designs') || '[]');
            const newDesign = {
                ...data,
                date: new Date().toISOString(),
                prompt: prompt,
                // If we had a generated image URL here we would save it, but logic is separate currently.
                // We'll trust the user to save the image manually or enhance this later if needed.
            };
            savedDesigns.unshift(newDesign);
            localStorage.setItem('ai_home_decor_designs', JSON.stringify(savedDesigns));

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate design. API Limit or Server Error.');
            if (err.response && err.response.status === 429) {
                alert("AI limit reached. Please wait 20 seconds.");
            } else if (err.response && err.response.data && err.response.data.message) {
                alert(`Error: ${err.response.data.message}`);
            } else {
                alert("AI failed. Check backend logs.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }

    };

    const handleGenerateImage = () => {
        setImageLoading(true);

        const designPrompt = result && result.colorPalette
            ? `${result.concept}, ${result.layout}, ${result.colorPalette.join(' ')}, interior design, photorealistic, 4k, high quality`
            : prompt;

        const encodedPrompt = encodeURIComponent(designPrompt);
        const randomSeed = Math.floor(Math.random() * 10000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${randomSeed}`;

        setImage(imageUrl);

        setTimeout(() => setImageLoading(false), 2000);
    };

    return (
        <div className="mx-auto max-w-5xl">
            <h1 className="mb-2 text-3xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-purple-400" /> AI Design Generator
            </h1>
            <p className="mb-8 text-gray-400">Describe your dream room to get an AI redesign plan.</p>

            <div className="rounded-2xl bg-neutral-900/50 p-8 shadow-2xl border border-white/10 backdrop-blur-sm">
                <form onSubmit={handleGenerate}>
                    <div className="mb-8">
                        <label className="mb-3 block text-sm font-medium text-gray-300">Current Room Photo (Optional)</label>
                        <div
                            className={`group relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer overflow-hidden ${selectedImage ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'}`}
                            onClick={() => document.getElementById('imageInput').click()}
                        >
                            <input
                                type="file"
                                id="imageInput"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {selectedImage ? (
                                <div className="relative h-64 w-full">
                                    <img src={selectedImage} alt="Preview" className="h-full w-full object-contain mx-auto rounded-lg" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                        <p className="text-xs text-green-400 font-semibold flex items-center justify-center gap-1"><Sparkles size={12} /> Image Selected</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                        className="absolute top-2 right-2 bg-neutral-900/80 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-full p-2 transition border border-white/10"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-4">
                                    <div className="rounded-full bg-white/5 p-4 ring-1 ring-white/10 group-hover:scale-110 transition">
                                        <Upload className="h-8 w-8 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500 mt-1">JPEG, PNG up to 10MB</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <label className="mb-3 block text-sm font-medium text-gray-300">Room Details & Preferences</label>
                    <textarea
                        className="w-full rounded-xl bg-neutral-950/50 border border-white/10 p-4 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition"
                        rows="3"
                        placeholder="E.g., A modern living room with japandi style, warm wood tones, and modular furniture..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={loading || (!prompt && !selectedImage)}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-lg transition-all ${loading || (!prompt && !selectedImage) ? 'bg-neutral-800 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/20 hover:-translate-y-0.5'}`}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
                                    <span>Generating...</span>
                                </div>
                            ) : (
                                <>Generate Plan <Layout size={18} /></>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerateImage}
                            disabled={imageLoading || !prompt}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-lg transition-all ${imageLoading || !prompt ? 'bg-neutral-800 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 hover:shadow-teal-500/20 hover:-translate-y-0.5'}`}
                        >
                            {imageLoading ? <>Rendering...</> : <>Visualize Idea <ImageIcon size={18} /></>}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-center text-red-400 bg-red-900/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
            </div>

            {/* Independent Image Visualizer Section */}
            {image && (
                <div className="mt-8 animate-fade-in rounded-2xl bg-neutral-900/50 p-6 shadow-2xl border border-white/10 backdrop-blur-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                        <ImageIcon className="text-teal-400" size={24} /> AI Visualizer
                    </h3>
                    <div className="rounded-xl overflow-hidden relative group shadow-2xl ring-1 ring-white/10">
                        <img src={image} alt="Generated Design" className="w-full h-96 object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-neutral-900/80 p-4 text-gray-300 text-sm backdrop-blur-md border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform">
                            <span className="text-teal-400 font-bold">Prompt:</span> {prompt}
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-center text-gray-600">AI Generated Visualization (Pollinations.ai)</p>
                </div>
            )}

            {result && (
                <div className="mt-12 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            Design Concept: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{result.concept}</span>
                        </h2>
                        <button
                            onClick={() => alert("Design saved to your personal gallery!")}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition text-sm font-medium border border-white/10"
                        >
                            <Sparkles size={16} className="text-yellow-400" /> Save Design
                        </button>
                    </div>

                    {result.rawText ? (
                        <div className="rounded-xl bg-red-900/10 p-6 border border-red-500/20 text-red-200">
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><X size={18} /> Formatting Issue</h3>
                            <pre className="whitespace-pre-wrap text-sm opacity-80">{result.rawText}</pre>
                            <p className="mt-4 text-xs">The AI response wasn't perfect JSON, but here is the raw text.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Result Hero Image (Fallback or Generated) */}
                            {result.image && (
                                <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group h-80 md:h-96">
                                    <img src={result.image} alt={result.concept} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute bottom-0 left-0 p-8">
                                        <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2 font-medium tracking-wide uppercase">
                                            <Sparkles size={14} />
                                            AI Concept Visualization
                                        </div>
                                        <h3 className="text-3xl font-bold text-white shadow-sm">{result.concept}</h3>
                                    </div>
                                </div>
                            )}

                            {/* Color Palette */}
                            <div className="group rounded-2xl bg-neutral-900/50 p-6 shadow-lg border border-white/5 backdrop-blur-sm transition hover:bg-neutral-800/50 hover:border-pink-500/30">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-100">
                                    <Palette className="text-pink-400" size={20} /> Color Palette
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {result.colorPalette && result.colorPalette.map((color, idx) => (
                                        <div key={idx} className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-2 pr-4 py-1.5 text-sm font-medium text-gray-300 shadow-sm transition hover:scale-105 hover:bg-white/10">
                                            <div className="h-6 w-6 rounded-full border border-white/10 shadow-inner" style={{ backgroundColor: color.split(' ')[0] }}></div>
                                            {color}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Layout */}
                            <div className="group rounded-2xl bg-neutral-900/50 p-6 shadow-lg border border-white/5 backdrop-blur-sm transition hover:bg-neutral-800/50 hover:border-blue-500/30">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-100">
                                    <Layout className="text-blue-400" size={20} /> Layout & Flow
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{result.layout}</p>
                            </div>

                            {/* Furniture */}
                            <div className="group rounded-2xl bg-neutral-900/50 p-6 shadow-lg border border-white/5 backdrop-blur-sm md:col-span-2 transition hover:bg-neutral-800/50 hover:border-orange-500/30">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-100">
                                    <Armchair className="text-orange-400" size={20} /> Recommended Furniture
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {result.furniture && result.furniture.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 rounded-xl bg-white/5 p-4 hover:bg-white/10 transition border border-white/5">
                                            <div className="rounded-full bg-orange-400/10 p-1.5 shadow-sm">
                                                <ArrowRight size={14} className="text-orange-400" />
                                            </div>
                                            <span className="text-gray-300 font-medium text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Lighting & Decor */}
                            <div className="group rounded-2xl bg-neutral-900/50 p-6 shadow-lg border border-white/5 backdrop-blur-sm md:col-span-2 transition hover:bg-neutral-800/50 hover:border-yellow-500/30">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-100">
                                    <Lightbulb className="text-yellow-400" size={20} /> Lighting & Decor
                                </h3>
                                <div className="grid gap-8 sm:grid-cols-2">
                                    <div className="relative pl-6 border-l-2 border-yellow-500/30">
                                        <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider opacity-80">Lighting Strategy</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{result.lighting}</p>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-green-500/30">
                                        <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider opacity-80">Decor & Accessories</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{result.decor}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GenerateDesign;
