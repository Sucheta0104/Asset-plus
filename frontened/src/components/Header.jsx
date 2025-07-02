import { Link } from "react-router-dom";
import ButtonAnimatedGradient from "../ui/Signin";
export default function Header() {
  
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-md" />
          <span className="font-bold text-xl text-gray-800">AssetPlus</span>
        </div>
        <nav className="hidden md:flex gap-6 text-lg">
          <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="#pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
        </nav>
        <div className="hidden md:flex gap-2">
           <Link className="text-gray-700 hover:text-blue-600" to="/signup" ><ButtonAnimatedGradient/></Link>
         </div>
      </div>
    </header>
  );
}