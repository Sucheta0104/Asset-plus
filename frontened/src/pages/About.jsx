import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div>
      <Header/>
    
    <section id="about" className="py-24 px-6 bg-white text-center">
      <h2 className="text-5xl font-bold mb-5">About AssetPlus</h2>
      <p className="max-w-2xl mx-auto text-gray-700 mb-6 text-xl">
        AssetPlus is an intelligent and scalable solution designed to streamline IT asset management across organizations of all sizes. Whether you're dealing with hundreds or thousands of assets, our platform provides the tools you need to stay in control.
      </p>
      <p className="max-w-2xl mx-auto text-gray-700 mb-6 text-xl">
        From real-time asset tracking and software license monitoring to lifecycle management and audit-ready reporting, AssetPlus simplifies complex asset workflows into a unified, easy-to-use system. Our solution reduces downtime, prevents costly license violations, and ensures every asset is accounted for—wherever it is.
      </p>
      <p className="max-w-2xl mx-auto text-gray-700 text-xl">
        Trusted by IT departments, system administrators, and procurement teams, AssetPlus empowers better decision-making through actionable insights and complete visibility of your IT infrastructure.
      </p>
    </section>
   </div>
  );
}
