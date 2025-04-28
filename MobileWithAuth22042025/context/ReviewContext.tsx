import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchApi } from '@/utils/api';

// Define the Review interface
export interface Review {
  id: string;
  userId: string;
  productId?: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  upvotes: number;
  likedBy: string[];
}

// Define the context type
interface ReviewContextType {
  reviews: Review[];
  userReviews: Review[];
  isLoading: boolean;
  error: string | null;
  fetchReviews: (productId?: string) => Promise<void>;
  fetchUserReviews: () => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'likedBy'>) => Promise<void>;
  updateReview: (reviewId: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  toggleLike: (reviewId: string, userId: string) => Promise<void>;
}

// Create the context
const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

// Create a hook to use the context
export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

// Create the provider component
export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reviews for a product
  const fetchReviews = async (productId?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchApi(`/reviews/product/${productId}`, {
        method: 'GET',
      });

      setReviews(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reviews by the current user
  const fetchUserReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchApi('/reviews/user', {
        method: 'GET',
      });

      setUserReviews(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user reviews');
      console.error('Error fetching user reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new review
  const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'likedBy'>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add default values for the new properties
      const newReview = {
        ...review,
        upvotes: 0,
        likedBy: []
      };

      const result = await fetchApi('/reviews', {
        method: 'POST',
        body: JSON.stringify(newReview),
      });

      // Update local state
      setReviews(prev => [...prev, result]);

      // Also update user reviews if applicable
      setUserReviews(prev => [...prev, result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add review');
      console.error('Error adding review:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing review
  const updateReview = async (reviewId: string, review: Partial<Review>) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchApi(`/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(review),
      });

      // Update local state
      setReviews(prev =>
        prev.map(r => r.id === reviewId ? { ...r, ...result } : r)
      );

      setUserReviews(prev =>
        prev.map(r => r.id === reviewId ? { ...r, ...result } : r)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
      console.error('Error updating review:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a review
  const deleteReview = async (reviewId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await fetchApi(`/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      // Update local state
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setUserReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
      console.error('Error deleting review:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add the toggleLike function
  const toggleLike = async (reviewId: string, userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Find the review
      const review = reviews.find(r => r.id === reviewId);

      if (!review) {
        throw new Error('Review not found');
      }

      // Toggle the like
      const isLiked = review.likedBy.includes(userId);
      const updatedLikedBy = isLiked
        ? review.likedBy.filter(id => id !== userId)
        : [...review.likedBy, userId];

      const updatedUpvotes = isLiked
        ? review.upvotes - 1
        : review.upvotes + 1;

      // Update the review in the API
      const result = await fetchApi(`/reviews/${reviewId}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });

      // Update local state
      setReviews(prev =>
        prev.map(r => r.id === reviewId
          ? { ...r, likedBy: updatedLikedBy, upvotes: updatedUpvotes }
          : r
        )
      );

      // Also update user reviews if applicable
      setUserReviews(prev =>
        prev.map(r => r.id === reviewId
          ? { ...r, likedBy: updatedLikedBy, upvotes: updatedUpvotes }
          : r
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
      console.error('Error toggling like:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        userReviews,
        isLoading,
        error,
        fetchReviews,
        fetchUserReviews,
        addReview,
        updateReview,
        deleteReview,
        toggleLike,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};