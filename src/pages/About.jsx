import React from 'react';

const About = () => {
  const milestones = [
    { year: '1916', event: 'BMW founded as Bayerische Motoren Werke', icon: '🏭' },
    { year: '1928', event: 'First BMW automobile produced', icon: '🚗' },
    { year: '1972', event: 'BMW M division established', icon: '🏁' },
    { year: '2013', event: 'BMW i series launched', icon: '⚡' },
    { year: '2025', event: 'Leading electric mobility', icon: '🌱' }
  ];

  const values = [
    {
      title: 'Excellence',
      icon: '🎯',
      description: 'We strive for perfection in every aspect of our vehicles and services, never compromising on quality or innovation.'
    },
    {
      title: 'Sustainability',
      icon: '🌱',
      description: 'Committed to creating a sustainable future through electric mobility and responsible manufacturing practices.'
    },
    {
      title: 'Innovation',
      icon: '💡',
      description: 'Leading the industry with cutting-edge technology, groundbreaking design, and forward-thinking solutions.'
    },
    {
      title: 'Performance',
      icon: '⚡',
      description: 'Delivering unmatched driving dynamics and engineering excellence that defines the ultimate driving machine.'
    },
    {
      title: 'Luxury',
      icon: '👑',
      description: 'Premium craftsmanship and attention to detail in every vehicle, creating an extraordinary ownership experience.'
    },
    {
      title: 'Heritage',
      icon: '🏛️',
      description: 'Over a century of automotive excellence, building on tradition while pioneering the future of mobility.'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h1 className="text-6xl font-light text-black mb-6">
            About <span className="font-bold">Jan Agro Nusantara</span>
          </h1>
          <div className="w-24 h-[1px] bg-black mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            For over 28 years, Jan Agro Nusantara has been synonymous with innovation, performance, and safety.
            We continue to push the boundaries of farmer excellence, 
            creating fertilizers that provide true planting safety while pioneering a sustainable future for farmers.
          </p>
        </div>
        
        <div className="py-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-light text-center text-black mb-4">Our <span className="font-bold">Journey</span></h2>
            <div className="w-24 h-[1px] bg-black mx-auto mb-12"></div>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-gray-300"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-100">
                        <div className="text-3xl mb-3">{milestone.icon}</div>
                        <div className="text-2xl font-bold text-black mb-2">{milestone.year}</div>
                        <p className="text-gray-700">{milestone.event}</p>
                      </div>
                    </div>
                    
                    <div className="w-4 h-4 bg-black rounded-full relative z-10"></div>
                    
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-20">
          <h2 className="text-4xl font-light text-center text-black mb-4">Our <span className="font-bold">Values</span></h2>
          <div className="w-24 h-[1px] bg-black mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group text-center p-8 rounded-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-800 transition-colors">
                  <span className="text-white text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="py-20 bg-black text-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4">Jan Agro Nusantara by the <span className="font-bold">Numbers</span></h2>
              <div className="w-24 h-[1px] bg-white mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="text-5xl font-light mb-4">28<span className="text-3xl">+</span></div>
                <div className="text-gray-300 uppercase tracking-wider text-sm">Years of Excellence</div>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl font-light mb-4">2.5<span className="text-3xl">M+</span></div>
                <div className="text-gray-300 uppercase tracking-wider text-sm">Vehicles Delivered</div>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl font-light mb-4">3<span className="text-3xl">+</span></div>
                <div className="text-gray-300 uppercase tracking-wider text-sm">City In Indonesian</div>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl font-light mb-4">25<span className="text-3xl">+</span></div>
                <div className="text-gray-300 uppercase tracking-wider text-sm">Award-Winning Models</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light text-black mb-4">Our <span className="font-bold">Mission</span></h2>
            <div className="w-24 h-[1px] bg-black mx-auto mb-8"></div>
            <p className="text-2xl text-gray-700 leading-relaxed font-light mb-8">
              "To create vehicles that deliver sheer driving pleasure while pioneering the future of 
              sustainable mobility. We combine luxury, performance, and responsibility to enhance 
              the lives of our customers and communities worldwide."
            </p>
            <div className="w-16 h-[1px] bg-gray-300 mx-auto"></div>
          </div>
        </div>
        
        {/* Leadership Quote */}
        <div className="py-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl italic text-gray-700 mb-6 font-light">
              "The BMW Group stands for visionary power and innovative strength. 
              We shape the future of individual mobility through our pioneering spirit."
            </blockquote>
            <cite className="text-black font-semibold">Jan Agro Nusantara Executive Team</cite>
          </div>
        </div>
        
        {/* Contact CTA */}
        <div className="py-20 text-center">
          <h2 className="text-3xl font-light text-black mb-6">Experience Jan Agro Nusantara Excellence</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover how BMW continues to define the ultimate driving machine through innovation, 
            luxury, and uncompromising quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-black text-white rounded-sm font-medium transition-all duration-300 hover:bg-gray-800 uppercase tracking-wider text-sm">
              Find a Dealer
            </button>
            <button className="px-8 py-4 border border-black text-black rounded-sm font-medium transition-all duration-300 hover:bg-black hover:text-white uppercase tracking-wider text-sm">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;