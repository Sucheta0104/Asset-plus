import { ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToNextSection = () => {
    const nextSection = document.querySelector('#next-section') || 
                       document.querySelector('section:nth-of-type(2)') ||
                       document.querySelector('[data-section="next"]');
    
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="home" className="bg-gray-100 text-blue-900 text-center py-20 px-10 h-screen flex flex-col justify-center">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl md:text-7xl font-bold mb-6">
            Track, Manage, and Optimize Your IT Assets with Ease
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Cloud-based Asset Management SaaS for growing IT teams. Streamline operations, reduce costs, and stay compliant.
          </p>
          <p className="mt-4 text-sm text-black mb-8">3 months free trial • No credit card required</p>
          
          {/* Explore Text and Arrow */}
          <div className="flex justify-center items-center gap-4">
            <span className="text-black font-semibold text-lg">
              Explore More
            </span>
            
            {/* Down Arrow Button */}
            <button 
              onClick={scrollToNextSection}
              className="text-blue-600 hover:text-blue-700 p-3 transition-all duration-300 group"
              aria-label="Scroll to next section"
            >
              <ChevronDown 
                size={24} 
                className="animate-bounce group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300" 
              />
            </button>
          </div>
        </div>
      </section>

      {/* Demo Next Section */}
      {/* <section id="next-section" className="bg-white text-gray-800 py-20 px-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">Next Section</h2>
          <p className="text-xl max-w-2xl mx-auto">
            This is the section that the down arrow will scroll to. Replace this with your actual content.
          </p>
        </div>
      </section> */}
    </>
  );
}