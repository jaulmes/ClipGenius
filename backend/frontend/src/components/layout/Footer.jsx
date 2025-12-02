import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 py-12">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">✂️</span>
                            <span className="text-xl font-bold text-white">ClipGenius</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            AI-powered video clipping platform for content creators
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><Link to="/features" className="text-gray-400 hover:text-white text-sm">Features</Link></li>
                            <li><Link to="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
                            <li><Link to="/app" className="text-gray-400 hover:text-white text-sm">Launch App</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">About</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                    © 2025 ClipGenius. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
