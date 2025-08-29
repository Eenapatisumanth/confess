export interface User {
  id: string;
  email: string;
  anonymous_name: string;
  created_at: string;
  anonymousName: string;
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

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  userId: string;
  message: string;
  createdAt: string;
}

export type Campus = 'vellore' | 'chennai' | 'bhopal' | 'ap';
export type ReactionType = 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}