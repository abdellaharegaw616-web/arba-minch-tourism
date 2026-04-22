import React, { useState } from 'react';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
    title: 'Lake Chamo',
    category: 'Lakes',
    description: 'Beautiful lake with hippos and crocodiles'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800',
    title: 'Nech Sar National Park',
    category: 'Parks',
    description: 'Wildlife sanctuary with diverse animals'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    title: 'Bridge of God',
    category: 'Landmarks',
    description: '40 Springs connecting two lakes'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1518495973542-7f76cff24f15?w=800',
    title: 'Dorze Village',
    category: 'Culture',
    description: 'Traditional bamboo houses'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    title: 'Lake Abaya',
    category: 'Lakes',
    description: 'Red lake with stunning views'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    title: 'Arba Minch Forest',
    category: 'Nature',
    description: 'Lush green forest reserve'
  }
];

const categories = ['All', 'Lakes', 'Parks', 'Landmarks', 'Culture', 'Nature'];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📸 Photo Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore the beauty of Arba Minch through our stunning photo collection
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(image => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                  {image.category}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                  {image.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No images found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition"
            >
              ×
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
              <p className="text-gray-300 mt-2">{selectedImage.description}</p>
              <span className="inline-block mt-3 px-4 py-1 bg-green-600 rounded-full text-sm">
                {selectedImage.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
