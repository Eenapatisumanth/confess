export interface User {
  id: string;
  googleId: string;
  anonymousName: string;
  email: string;
  createdAt: string;
  confessionHistory: string[];
}

export interface Confession {
  id: string;
  userId?: string;
  user: User;
  contentText?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaFile?: File;
  campus: Campus;
  createdAt: string;
  reactions: Reaction[];
  comments: Comment[];
  _count: {
    reactions: number;
    comments: number;
  };
  isGroupFun?: boolean;
}

export interface Comment {
  id: string;
  confessionId: string;
  userId?: string;
  user: User;
  commentText: string;
  createdAt: string;
}

export interface Reaction {
  id: string;
  confessionId: string;
  userId?: string;
  reactionType: ReactionType;
}

export type Campus = 'vellore' | 'chennai' | 'bhopal' | 'ap';
export type ReactionType = 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface GroupFunPost {
  id: string;
  userId?: string;
  user: User;
  title: string;
  description: string;
  campus: Campus;
  participants: string[];
  maxParticipants?: number;
  eventDate?: string;
  location?: string;
  createdAt: string;
  tags: string[];
}