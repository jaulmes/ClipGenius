import { useState } from 'react';

export default function ScriptInput({ onSubmit, isLoading }) {
    const [script, setScript] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (script.trim()) {
            onSubmit(script);
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
                Create Your Video
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="script" className="block text-sm font-medium text-gray-400 mb-2">
                        Paste Your Script
                    </label>
                    <textarea
                        id="script"
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        placeholder="Enter your video script here..."
                        className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !script.trim()}
                    className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                >
                    {isLoading ? 'Processing...' : 'Analyze Script'}
                </button>
            </form>
        </div>
    );
}
