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
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Integrations</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row justify-center items-center text-sm text-gray-400">
        <p>© 2024 AssetPlus. All rights reserved.</p>
      </div>
    </footer>
  );
}