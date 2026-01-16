import React, { useState } from 'react';
import { Calculator, DollarSign, Check } from 'lucide-react';

const BudgetCalculator = () => {
    const [roomSize, setRoomSize] = useState('');
    const [roomType, setRoomType] = useState('living');
    const [quality, setQuality] = useState('mid');
    const [includeLabor, setIncludeLabor] = useState(true);

    const [estimation, setEstimation] = useState(null);

    const calculateBudget = (e) => {
        e.preventDefault();
        const size = parseFloat(roomSize);
        if (!size || size <= 0) return;

        // Base costs per sq ft (mock data)
        const baseRates = {
            living: 25,
            bedroom: 20,
            kitchen: 80,
            bathroom: 100,
            office: 30
        };

        const qualityMultipliers = {
            budget: 0.7,
            mid: 1,
            luxury: 2.5
        };

        let baseCost = (baseRates[roomType] || 25) * size * qualityMultipliers[quality];

        // Labor typically 40% of material cost
        const laborCost = includeLabor ? baseCost * 0.4 : 0;
        const total = baseCost + laborCost;

        setEstimation({
            materials: Math.round(baseCost),
            labor: Math.round(laborCost),
            total: Math.round(total),
            range: {
                low: Math.round(total * 0.9),
                high: Math.round(total * 1.15)
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <Calculator className="text-green-400" /> Renovation Budget Estimator
            </h1>
            <p className="text-gray-400 mb-8">Get a quick estimate for your remodeling project based on current market rates.</p>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/10 shadow-xl backdrop-blur-sm">
                    <form onSubmit={calculateBudget} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Room Type</label>
                            <select
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:border-green-500 focus:outline-none"
                            >
                                <option value="living">Living Room</option>
                                <option value="bedroom">Bedroom</option>
                                <option value="kitchen">Kitchen</option>
                                <option value="bathroom">Bathroom</option>
                                <option value="office">Home Office</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Room Size (Sq. Ft)</label>
                            <input
                                type="number"
                                value={roomSize}
                                onChange={(e) => setRoomSize(e.target.value)}
                                placeholder="e.g. 200"
                                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:border-green-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Finish Quality</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['budget', 'mid', 'luxury'].map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => setQuality(q)}
                                        className={`p-2 rounded-lg border text-sm capitalize ${quality === q ? 'bg-green-600 border-green-500 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIncludeLabor(!includeLabor)}
                                className={`w-6 h-6 rounded border flex items-center justify-center transition ${includeLabor ? 'bg-green-500 border-green-500 text-black' : 'border-white/20'}`}
                            >
                                {includeLabor && <Check size={14} />}
                            </button>
                            <span className="text-gray-300 text-sm">Include Labor Costs</span>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-500 hover:to-emerald-500 shadow-lg transition"
                        >
                            Calculate Estimate
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    {estimation ? (
                        <div className="animate-fade-in p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <DollarSign size={24} className="text-green-400" /> Estimated Cost
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-gray-400">Materials & Finishes</span>
                                    <span className="text-white font-semibold">${estimation.materials.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-gray-400">Estimated Labor</span>
                                    <span className="text-white font-semibold">${estimation.labor.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg text-green-300 font-bold">Total Estimate</span>
                                    <span className="text-2xl text-white font-bold">${estimation.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-black/20 text-sm text-gray-400">
                                <p className="mb-2"><strong className="text-green-400">Cost Range:</strong> ${estimation.range.low.toLocaleString()} - ${estimation.range.high.toLocaleString()}</p>
                                <p className="text-xs opacity-70">*This is an estimate based on market averages. Actual contractor quotes may vary.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                            <Calculator size={48} className="mb-4 opacity-20" />
                            <p>Enter your room details to see the cost breakdown here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetCalculator;
