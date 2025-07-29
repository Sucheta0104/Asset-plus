import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-10">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-md" />
            <h1 className="text-xl font-semibold">AssetPlus</h1>
          </div>
          <p className="text-sm text-gray-400">
            Cloud-based IT Asset Management SaaS for growing tech teams. Track,
            manage, and optimize your assets with ease.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/features" className="hover:text-white transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/security" className="hover:text-white transition-colors">
                Security
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row justify-center items-center text-sm text-gray-400">
        <p>© 2025 AssetPlus. All rights reserved.</p>
      </div>
    </footer>
  );
}