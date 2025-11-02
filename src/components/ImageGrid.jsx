function ImageGrid({ images, selectedImages, onToggleSelection }) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No images found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group cursor-pointer rounded-xl overflow-hidden bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          onClick={() => onToggleSelection(image.id)}
        >
          <img
            src={image.thumb}
            alt={image.alt}
            className="w-full h-64 object-cover"
          />
          
          {/* Overlay */}
          <div className={`absolute inset-0 transition-opacity pointer-events-none ${
            selectedImages.includes(image.id) ? 'bg-opacity-50' : 'bg-opacity-0 group-hover:bg-opacity-30'
          }`}>
            {/* Checkbox */}
            <div className="absolute top-3 right-3">
              <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                selectedImages.includes(image.id)
                  ? 'bg-green-500 border-green-800'
                  : 'bg-white bg-opacity-20 border-white backdrop-blur-sm'
              }`}>
                {selectedImages.includes(image.id) && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>

          
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <p className="text-white text-sm font-medium truncate">
                Photo by {image.author}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ImageGrid;