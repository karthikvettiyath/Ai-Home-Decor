import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Trash2 } from 'lucide-react';

const UserDashboard = () => {
    const [designs, setDesigns] = React.useState([]);

    React.useEffect(() => {
        const savedDesigns = JSON.parse(localStorage.getItem('ai_home_decor_designs') || '[]');
        setDesigns(savedDesigns);
    }, []);

    const handleDelete = (indexToDelete) => {
        if (window.confirm('Are you sure you want to delete this design?')) {
            const updatedDesigns = designs.filter((_, index) => index !== indexToDelete);
            setDesigns(updatedDesigns);
            localStorage.setItem('ai_home_decor_designs', JSON.stringify(updatedDesigns));
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="mb-6 text-3xl font-bold text-white tracking-tight">Welcome Back!</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <Link to="/generate-design" className="group relative rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-1 shadow-lg transition hover:scale-105 hover:shadow-purple-500/25">
                    <div className="flex h-full flex-col justify-between rounded-xl bg-neutral-900/90 p-6 backdrop-blur-sm transition group-hover:bg-neutral-900/0">
                        <div>
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-200 group-hover:bg-white/20 group-hover:text-white transition">
                                <PenTool size={24} />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">Create New Design</h3>
                            <p className="text-gray-400 group-hover:text-white/90">Generate a professional room redesign with AI instantly.</p>
                        </div>
                        <div className="mt-6 flex items-center gap-2 font-semibold text-purple-400 group-hover:text-white">
                            Start Generating <span className="text-xl">→</span>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-white border-b border-white/10 pb-4">My Design Gallery</h2>
                {designs.length === 0 ? (
                    <div className="rounded-2xl bg-neutral-900/50 border border-dashed border-white/10 p-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
                            <PenTool className="text-gray-600" size={32} />
                        </div>
                        <p className="text-lg font-medium text-white">No designs yet</p>
                        <p className="text-gray-500">Your generated masterpieces will appear here.</p>
                        <Link to="/generate-design" className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 font-bold text-neutral-900 hover:bg-gray-100 transition">Create Your First Design</Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {designs.map((design, index) => (
                            <div key={index} className="group overflow-hidden rounded-2xl bg-neutral-900/50 border border-white/5 shadow-lg hover:shadow-2xl transition hover:-translate-y-1 relative">
                                {design.image ? (
                                    <div className="h-48 w-full overflow-hidden relative">
                                        <img src={design.image} alt={design.concept} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-60"></div>
                                    </div>
                                ) : (
                                    <div className="h-48 w-full bg-neutral-800 flex items-center justify-center">
                                        <span className="text-neutral-600">No Preview</span>
                                    </div>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(index);
                                    }}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-500/80"
                                    title="Delete Design"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="p-5 relative">
                                    <h3 className="mb-2 text-lg font-bold text-white group-hover:text-purple-400 transition">{design.concept}</h3>
                                    <p className="mb-4 text-sm text-gray-400 line-clamp-2">{design.layout}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {design.colorPalette && design.colorPalette.slice(0, 3).map((color, cIdx) => (
                                                <div key={cIdx} className="h-8 w-8 rounded-full border-2 border-neutral-900 shadow-sm" style={{ backgroundColor: color.split(' ')[0] }} title={color}></div>
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                            {new Date(design.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
