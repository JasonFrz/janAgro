import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Models' },
    { id: 'electric', name: 'Electric' },
    { id: 'sedan', name: 'Sedan' },
    { id: 'suv', name: 'SUV' },
    { id: 'coupe', name: 'Coupe' },
    { id: 'performance', name: 'M Series' }
  ];

  const models = [
    { 
      id: 1, 
      name: 'BMW iX3', 
      type: 'Electric SUV', 
      category: 'electric',
      price: 'Starting from $55,400', 
      image: '🔋',
      features: ['Electric', '286 HP', '460 km Range'],
      description: 'The first fully electric BMW X3 combines sustainability with performance.'
    },
    { 
      id: 2, 
      name: 'BMW i4', 
      type: 'Electric Sedan', 
      category: 'electric',
      price: 'Starting from $51,400', 
      image: '⚡',
      features: ['Electric', '340 HP', '590 km Range'],
      description: 'Pure electric driving pleasure in a stunning gran coupe design.'
    },
    { 
      id: 3, 
      name: 'BMW X5', 
      type: 'Luxury SUV', 
      category: 'suv',
      price: 'Starting from $59,400', 
      image: '🚙',
      features: ['3.0L Turbo', '335 HP', 'xDrive AWD'],
      description: 'The ultimate luxury SUV that defines the Sports Activity Vehicle category.'
    },
    { 
      id: 4, 
      name: 'BMW 3 Series', 
      type: 'Sport Sedan', 
      category: 'sedan',
      price: 'Starting from $34,900', 
      image: '🚗',
      features: ['2.0L Turbo', '255 HP', 'RWD'],
      description: 'The benchmark for sport sedans, combining agility with luxury.'
    },
    { 
      id: 5, 
      name: 'BMW M4', 
      type: 'Performance Coupe', 
      category: 'performance',
      price: 'Starting from $71,800', 
      image: '🏎️',
      features: ['3.0L Twin-Turbo', '473 HP', 'M Performance'],
      description: 'Pure M performance in a stunning coupe silhouette.'
    },
    { 
      id: 6, 
      name: 'BMW X7', 
      type: 'Premium SUV', 
      category: 'suv',
      price: 'Starting from $74,900', 
      image: '🚙',
      features: ['4.4L V8', '523 HP', '7-Seater'],
      description: 'The flagship BMW SUV offering unparalleled luxury and space.'
    },
    {
      id: 7,
      name: 'BMW 4 Series',
      type: 'Luxury Coupe',
      category: 'coupe',
      price: 'Starting from $46,600',
      image: '🚘',
      features: ['2.0L Turbo', '255 HP', 'RWD'],
      description: 'Elegant coupe design meets dynamic performance.'
    },
    {
      id: 8,
      name: 'BMW M3',
      type: 'Performance Sedan',
      category: 'performance',
      price: 'Starting from $69,900',
      image: '🏁',
      features: ['3.0L Twin-Turbo', '473 HP', 'M Performance'],
      description: 'The ultimate high-performance sedan for driving enthusiasts.'
    }
  ];

  const filteredModels = models.filter(model => {
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-black mb-4">Jan Agro <span className="font-bold">Shop</span></h1>
          <div className="w-24 h-[1px] bg-black mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-light">Discover our complete range of luxury Fertillizer & Tools</p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-black hover:text-black'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Models Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModels.map((model) => (
            <div key={model.id} className="group bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100">
              <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl overflow-hidden">
                <div className="transform group-hover:scale-110 transition-transform duration-500">
                  {model.image}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-black mb-1 group-hover:text-gray-700 transition-colors">
                    {model.name}
                  </h3>
                  <p className="text-gray-600 text-sm uppercase tracking-wide">{model.type}</p>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {model.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {model.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-black font-semibold text-lg">{model.price}</p>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-black text-white py-3 px-4 rounded-sm transition-all duration-300 hover:bg-gray-800 text-sm font-medium uppercase tracking-wide">
                    View Details
                  </button>
                  <button className="border border-gray-300 hover:border-black text-gray-700 hover:text-black py-3 px-4 rounded-sm transition-all duration-300 text-sm font-medium uppercase tracking-wide">
                    Test Drive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-black text-white p-12 rounded-sm text-center">
          <h2 className="text-3xl font-light mb-4">Need Help Choosing?</h2>
          <p className="text-gray-300 mb-6">Our BMW specialists are here to help you find the perfect vehicle</p>
          <button className="px-8 py-3 bg-white text-black rounded-sm font-medium hover:bg-gray-100 transition-colors uppercase tracking-wide text-sm">
            Contact a Specialist
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;