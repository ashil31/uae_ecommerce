import React from 'react'

const RatingStars = ({ rating = 0, size = 14, showEmpty = true }) => {
    const roundedRating = Math.round(rating);
    
    return (
        <div className="flex items-center gap-0.5 text-yellow-400" style={{ fontSize: `${size}px` }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span 
                    key={star} 
                    className={star <= roundedRating ? "text-yellow-400" : "text-gray-300"}
                >
                    ★
                </span>
            ))}
        </div>
    )
}

export default RatingStars
