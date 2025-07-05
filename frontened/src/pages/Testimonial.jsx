import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Main testimonials data
  const mainTestimonials = [
    {
      name: "Sarah Mitchell",
      role: "Portfolio Manager at WealthCorp",
      content: "Our asset management strategy has been completely transformed through modern digital solutions. The ability to track, analyze, and optimize our portfolio in real-time has increased our returns by 23% over the past year. The comprehensive reporting and risk assessment tools provide invaluable insights that help us make informed decisions for our clients.",
      rating: 5
    },
    {
      name: "Robert Chen",
      role: "Chief Investment Officer at Global Finance",
      content: "Asset management used to be a complex, time-consuming process. Now, with advanced analytics and automated rebalancing, we can focus on strategic decision-making rather than manual tasks. The platform's ability to integrate multiple asset classes and provide holistic portfolio views has been game-changing for our operations.",
      rating: 5
    }
  ];

  // Carousel testimonials data
  const carouselTestimonials = [
    {
      name: "Michael Johnson",
      role: "Financial Advisor",
      content: "The automated reporting features have saved our team countless hours while providing clients with transparent, detailed insights into their investments.",
      initials: "MJ"
    },
    {
      name: "Emma Rodriguez",
      role: "Wealth Manager",
      content: "Risk management tools are exceptional. We can now identify potential issues before they impact our clients' portfolios significantly.",
      initials: "ER"
    },
    {
      name: "David Park",
      role: "Investment Analyst",
      content: "The data visualization capabilities make complex financial information accessible to both our team and clients. Highly recommended platform.",
      initials: "DP"
    }
  ];

  // Auto-carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselTestimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselTestimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselTestimonials.length) % carouselTestimonials.length);
  };

  const renderStars = (rating) => {
    return [...Array(rating)].map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Asset Management Success Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how professionals are transforming their investment strategies with modern asset management solutions
          </p>
        </div>

        {/* Main Testimonials - Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {mainTestimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            More Client Experiences
          </h2>
          
          <div className="relative max-w-2xl mx-auto">
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselTestimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                      {testimonial.initials}
                    </div>
                    <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                      "{testimonial.content}"
                    </blockquote>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {carouselTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Asset Management?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of professionals who trust our platform for their investment needs
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;