import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, totalStars = 5, size = 16, interactive = false, onRatingChange }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[...Array(totalStars)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              display: 'inline-flex',
              padding: '1px',
              color: isFilled ? '#f59e0b' : 'var(--text-muted)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Star
              size={size}
              fill={isFilled ? '#f59e0b' : 'none'}
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
};
