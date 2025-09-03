# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# UAE-Client
# UAE-Client
# UAE-Client














{/* Left: Product Info */}
          <div className="lg:w-1/2 space-y-6">  
            {/* Name + Price */}
            <h1 className="text-2xl font-medium">{currentProduct.name}</h1>
            {/* Average Rating Below Product Name */}
            {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
              <div className="mt-2 flex items-center space-x-3">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      size={18}
                      className={`${
                        star <=
                          Math.round(
                            currentProduct.reviews.reduce((sum, r) => sum + r.rating, 0) /
                              currentProduct.reviews.length
                          )
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {(
                    currentProduct.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    currentProduct.reviews.length
                  ).toFixed(1)}{' '}
                  ({currentProduct.reviews.length} reviews)
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No reviews yet</p>
            )}

            <div className="flex items-center space-x-4 mb-4">
              {currentProduct.discountedPrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">
                    {currentProduct.discountedPrice.toFixed(2)} AED
                  </span>
                  <span className="text-lg text-gray-500 line-through">{price} AED</span>
                  {currentProduct.discountPercentage && (
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                      {currentProduct.discountPercentage}% OFF
                    </span>
                  )}
                </>
              ) : (
                <span className="text-2xl font-bold">{price} AED</span>
              )}
            </div>

            <div className="text-gray-700">
              <p className={`${showFullDescription ? '' : 'line-clamp-3'}`}>
                {currentProduct.description}
              </p>

              <button
                onClick={() => setShowFullDescription(prev => !prev)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                {showFullDescription ? 'Show Less' : 'Show More'}
              </button>
            </div>


            

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="flex items-center space-x-3 mt-4">
                <span className="text-sm font-semibold">Size:</span>
                <div className="flex space-x-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 text-sm border rounded ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {/* Size Guide */}
                <button
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Size-Guide
            </button>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold">Color:</span>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-black' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
            )}



            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mt-6">
              {/* Quantity Selector */}
              <div>
                {/* <h3 className="text-sm font-semibold mb-2">Quantity</h3> */}
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    className="p-2 hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                {/* {stock > 0 && (
                  <span className="text-sm text-gray-600 mt-1 block">{stock} available</span>
                )} */}
              </div>

              {/* Add to Cart Button */}
              <div className="flex-1 w-full">
                <button
                  onClick={handleAddToCart}
                  disabled={stock <= 0}
                  className="w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`w-full lg:w-auto border-2 py-3 px-6 rounded flex items-center justify-center transition-colors ${
                  isInWishlist 
                    ? 'border-red-500 text-red-500 hover:bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiBookmark className={`mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

          </div>