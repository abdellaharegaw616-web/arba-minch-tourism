import React, { useState } from 'react';

const galleryImages = [
  // LAKES (6 images)
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
    title: 'Lake Chamo Sunset',
    category: 'Lakes',
    description: 'Famous for hippos and giant crocodiles'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    title: 'Lake Abaya - The Red Lake',
    category: 'Lakes',
    description: 'Known for its distinctive red color'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    title: 'Twin Lakes Viewpoint',
    category: 'Lakes',
    description: 'Panoramic view of Lake Abaya and Lake Chamo'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
    title: 'Lake Chamo Boat Tour',
    category: 'Lakes',
    description: 'Traditional boat rides for wildlife viewing'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800',
    title: 'Lake Abaya Morning Mist',
    category: 'Lakes',
    description: 'Beautiful morning atmosphere'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    title: 'Bridge of God',
    category: 'Lakes',
    description: 'Natural land bridge between the two lakes'
  },
  // PARKS & WILDLIFE (6 images)
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800',
    title: 'Nech Sar National Park',
    category: 'Parks',
    description: 'Home to zebras, gazelles and antelopes'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800',
    title: 'Crocodile Market',
    category: 'Parks',
    description: 'Hundreds of crocodiles gather here'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800',
    title: 'Hippo Pool',
    category: 'Parks',
    description: 'Watch hippos in their natural habitat'
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    title: 'Swayne\'s Hartebeest',
    category: 'Parks',
    description: 'Endemic antelope species'
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800',
    title: 'Burchell\'s Zebras',
    category: 'Parks',
    description: 'Large herds roam the park'
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800',
    title: 'Nech Sar Savannah',
    category: 'Parks',
    description: 'Vast grasslands and acacia trees'
  },
  // LANDMARKS (5 images)
  {
    id: 13,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    title: 'Forty Springs (Arba Minch)',
    category: 'Landmarks',
    description: 'The town\'s namesake - 40 natural springs'
  },
  {
    id: 14,
    src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    title: 'Abaya-Chamo Viewpoint',
    category: 'Landmarks',
    description: 'Best spot for panoramic photos'
  },
  {
    id: 15,
    src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800',
    title: 'Kulfo River',
    category: 'Landmarks',
    description: 'Flows between the two lakes'
  },
  {
    id: 16,
    src: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800',
    title: 'Arba Minch Town View',
    category: 'Landmarks',
    description: 'The town above the lakes'
  },
  {
    id: 17,
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    title: 'Abaya Mountains',
    category: 'Landmarks',
    description: 'Scenic mountain backdrop'
  },
  // CULTURE (4 images)
  {
    id: 18,
    src: 'https://images.unsplash.com/photo-1518495973542-7f76cff24f15?w=800',
    title: 'Dorze Village',
    category: 'Culture',
    description: 'Famous for elephant-shaped bamboo houses'
  },
  {
    id: 19,
    src: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
    title: 'Traditional Weaving',
    category: 'Culture',
    description: 'Dorze people are expert weavers'
  },
  {
    id: 20,
    src: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800',
    title: 'Ethiopian Coffee Ceremony',
    category: 'Culture',
    description: 'Traditional coffee ritual'
  },
  {
    id: 21,
    src: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
    title: 'Local Market Day',
    category: 'Culture',
    description: 'Colorful markets in Chencha'
  },
  // NATURE (5 images)
  {
    id: 22,
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    title: 'Ground Water Forest',
    category: 'Nature',
    description: 'Unique forest between the lakes'
  },
  {
    id: 23,
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    title: 'Forest Canopy',
    category: 'Nature',
    description: 'Dense indigenous forest'
  },
  {
    id: 24,
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    title: 'Waterfall Trail',
    category: 'Nature',
    description: 'Scenic hiking routes'
  },
  {
    id: 25,
    src: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=800',
    title: 'Wildflowers',
    category: 'Nature',
    description: 'Native flora of the region'
  },
  {
    id: 26,
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    title: 'Sunset over Mountains',
    category: 'Nature',
    description: 'Dramatic evening skies'
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
