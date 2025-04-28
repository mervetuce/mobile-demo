import { Review } from '@/types/review';

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Excellent service! Got my visa approved in record time.',
    upvotes: 12,
    createdAt: '2024-03-10',
    likedBy: ['3', '4'],
  },
  {
    id: '2',
    userId: '3',
    userName: 'Michael Chen',
    rating: 4,
    comment: 'Very professional team and smooth process.',
    upvotes: 8,
    createdAt: '2024-03-08',
    likedBy: ['2', '4'],
  },
  {
    id: '3',
    userId: '4',
    userName: 'Emma Wilson',
    rating: 5,
    comment: 'Helped me get my business visa quickly. Highly recommended!',
    upvotes: 15,
    createdAt: '2024-03-05',
    likedBy: ['2', '3'],
  },
];