import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialCarousel = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      content: "This product completely transformed how we handle our daily operations. The intuitive design and powerful features saved us countless hours.",
      rating: 5,
      position: "CEO, TechCorp"
    },
    {
      name: "Michael Chen",
      content: "Outstanding customer service and exceptional quality. I've recommended this to all my colleagues and they love it too.",
      rating: 5,
      position: "Product Manager, InnovateLab"
    },
    {
      name: "Emily Rodriguez",
      content: "The best investment we've made this year. The ROI was visible within the first month of implementation.",
      rating: 5,
      position: "Marketing Director, GrowthCo"
    },
    {
      name: "David Thompson",
      content: "Seamless integration and fantastic support team. They went above and beyond to ensure everything worked perfectly.",
      rating: 5,
      position: "CTO, StartupXYZ"
    },
    {
      name: "Lisa Wang",
      content: "Game-changer for our workflow! The automation features alone have increased our productivity by 300%.",
      rating: 5,
      position: "Operations Lead, EfficiencyPro"
    },
    {
      name: "James Wilson",
      content: "Incredible attention to detail and user experience. This is exactly what we were looking for and more.",
      rating: 5,
      position: "Founder, VisionTech"
    },
    {
      name: "Anna Martinez",
      content: "The platform is incredibly robust yet easy to use. Our team was up and running in no time.",
      rating: 5,
      position: "Project Manager, BuildRight"
    },
    {
      name: "Robert Brown",
      content: "Exceptional value for money. The features are enterprise-grade but accessible for smaller teams too.",
      rating: 5,
      position: "Business Analyst, DataDriven"
    },
    {
      name: "Karen Miller",
      content: "The support team is phenomenal! They respond within minutes and always provide comprehensive solutions.",
      rating: 5,
      position: "Head of IT, DigitalFirst"
    },
    {
      name: "Thomas Anderson",
      content: "We've tried many similar solutions, but this one stands out for its reliability and ease of implementation.",
      rating: 5,
      position: "Software Engineer, CodeCraft"
    },
    {
      name: "Jennifer Adams",
      content: "The analytics dashboard gives us insights we never had before. It's like having a crystal ball for our business.",
      rating: 5,
      position: "Data Scientist, MetricsLab"
    },
    {
      name: "Alex Rivera",
      content: "From onboarding to daily use, everything is smooth and intuitive. Our team adopted it instantly.",
      rating: 5,
      position: "Team Lead, AgileWorks"
    },
    {
      name: "Sophia Lee",
      content: "The customization options are endless! We were able to tailor it perfectly to our unique workflow.",
      rating: 5,
      position: "Operations Manager, FlexiFlow"
    },
    {
      name: "Daniel Clark",
      content: "Security and compliance features are top-notch. We feel confident using it for our most sensitive data.",
      rating: 5,
      position: "Security Officer, SecureVault"
    },
    {
      name: "Rachel Green",
      content: "The mobile app is just as powerful as the desktop version. I can manage everything on the go.",
      rating: 5,
      position: "Regional Manager, MobilePro"
    },
    {
      name: "Kevin Wright",
      content: "Integration with our existing tools was seamless. No disruption to our current processes at all.",
      rating: 5,
      position: "Systems Administrator, TechBridge"
    },
    {
      name: "Maria Santos",
      content: "The reporting features have revolutionized how we present data to stakeholders. Clear and professional.",
      rating: 5,
      position: "Business Intelligence, ReportPro"
    },
    {
      name: "John Phillips",
      content: "Training materials are excellent and the learning curve is minimal. New team members get up to speed fast.",
      rating: 5,
      position: "Training Coordinator, LearnFast"
    },
    {
      name: "Amanda Taylor",
      content: "The collaborative features have brought our remote team closer together. Communication has never been better.",
      rating: 5,
      position: "Remote Team Lead, ConnectAll"
    },
    {
      name: "Steve Martin",
      content: "Performance is lightning fast even with large datasets. No more waiting around for reports to load.",
      rating: 5,
      position: "Performance Analyst, SpeedTech"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate total slides (4 cards per slide)
  const cardsPerSlide = 4;
  const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);

  // Auto-carousel functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 6500);
      return () => clearInterval(interval);
    }
  }, [totalSlides, isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  // const getCurrentTestimonials = () => {
  //   const startIndex = currentSlide * cardsPerSlide;
  //   return testimonials.slice(startIndex, startIndex + cardsPerSlide);
  // };

  return (
    <div className="min-h-screen bg-white/10 backdrop-blur-sm py-16 px-4">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          .animate-pulse-gentle {
            animation: pulse 2s infinite;
          }
        `
      }} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our amazing clients have to say about their experience.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/40 text-gray-800 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/40 text-gray-800 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <ChevronRight size={24} />
          </button>

          {/* Testimonials Grid */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-2">
                    {testimonials
                      .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                      .map((testimonial, index) => (
                        <div
                          key={`${slideIndex}-${index}`}
                          className="group bg-white border border-gray-200 rounded-2xl p-8 hover:bg-white transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/30 hover:-translate-y-2 transform-gpu animate-fadeInUp"
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            animationFillMode: 'both'
                          }}
                        >
                          {/* Rating Stars */}
                          <div className="flex gap-1 mb-6">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={18} 
                                className="fill-yellow-400 text-yellow-400" 
                              />
                            ))}
                          </div>

                          {/* Testimonial Content */}
                          <blockquote className="text-gray-700 text-sm leading-relaxed mb-8 group-hover:text-gray-900 transition-colors duration-300">
                            "{testimonial.content}"
                          </blockquote>

                          {/* Author Info */}
                          <div className="flex items-center gap-4">
                            {/* Avatar with Initials */}
                            <div className="w-12 h-12 bg-blue-950 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                              {getInitials(testimonial.name)}
                            </div>
                            
                            {/* Name and Position */}
                            <div>
                              <h4 className="text-gray-800 font-semibold text-lg group-hover:text-gray-900 transition-colors duration-300">
                                {testimonial.name}
                              </h4>
                              <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300">
                                {testimonial.position}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gray-800 shadow-lg' 
                    : 'bg-gray-400 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25">
            Join Our Happy Clients
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default TestimonialCarousel;