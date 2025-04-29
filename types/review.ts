export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  upvotes: number;
  createdAt: string;
  likedBy: string[];
}