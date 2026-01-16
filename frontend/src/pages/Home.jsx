import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Palette, Layers, Image as ImageIcon } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-neutral-900 text-white selection:bg-purple-500 selection:text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 via-neutral-900/50 to-neutral-900"></div>

                <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-48 lg:px-8 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="mb-6 inline-block rounded-full bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20 backdrop-blur-sm">
                            <Sparkles className="inline-block mr-1 w-4 h-4" /> AI-Powered Interior Design
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-7xl">
                            Transform Your Space <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Instantly</span>
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                            Upload a room photo or describe your vision. Our AI generates professional interior design concepts, color palettes, and photorealistic renders in seconds.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/user-dashboard"
                                className="group relative rounded-full bg-white px-8 py-3.5 text-sm font-bold text-neutral-900 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                Start Designing Free
                                <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a href="#features" className="text-sm font-semibold leading-6 text-white hover:text-purple-300 transition">
                                Learn more <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 sm:py-32 bg-neutral-950">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-purple-400">Everything you need</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Professional Design Tools, Democratized
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col rounded-2xl bg-neutral-900/50 p-8 ring-1 ring-white/10 backdrop-blur-sm"
                            >
                                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-white">
                                    <div className="rounded-lg bg-blue-500/10 p-2 ring-1 ring-blue-500/30">
                                        <Layers className="h-6 w-6 text-blue-400" aria-hidden="true" />
                                    </div>
                                    Smart Layouts
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                                    <p className="flex-auto">Optimal furniture arrangement suggestions based on traffic flow and focal points.</p>
                                </dd>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col rounded-2xl bg-neutral-900/50 p-8 ring-1 ring-white/10 backdrop-blur-sm"
                            >
                                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-white">
                                    <div className="rounded-lg bg-pink-500/10 p-2 ring-1 ring-pink-500/30">
                                        <Palette className="h-6 w-6 text-pink-400" aria-hidden="true" />
                                    </div>
                                    Curated Palettes
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                                    <p className="flex-auto">AI-generated color harmonies that match your mood, from "Serene Minimalist" to "Bold Industrial".</p>
                                </dd>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col rounded-2xl bg-neutral-900/50 p-8 ring-1 ring-white/10 backdrop-blur-sm"
                            >
                                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-white">
                                    <div className="rounded-lg bg-teal-500/10 p-2 ring-1 ring-teal-500/30">
                                        <ImageIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />
                                    </div>
                                    Realistic Renders
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                                    <p className="flex-auto">Visualize the final look with high-fidelity generated images that bring concepts to life.</p>
                                </dd>
                            </motion.div>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 py-10 text-center">
                <p className="text-sm text-gray-500">&copy; 2024 Ai Home Decor. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Home;
