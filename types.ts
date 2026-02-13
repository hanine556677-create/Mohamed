
export type UserRole = 'daily_worker' | 'regular' | 'freelancer' | 'student' | 'employer' | 'service_provider';

export type JobType = 'Full-time' | 'Part-time' | 'Freelance' | 'Daily' | 'Internship';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  wilaya: string;
  avatar: string;
  skills: string[];
  rating: number;
  bio?: string;
  isPro?: boolean;
}

export interface Job {
  id: string;
  title: string;
  employerId: string;
  employerName: string;
  employerAvatar: string;
  wilaya: string;
  salary?: string;
  type: JobType;
  description: string;
  category: string;
  postedAt: string;
  images?: string[];
  isFeatured?: boolean;
  requiresExperience: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice';
}

export interface Group {
  id: string;
  name: string;
  description: string;
  wilaya?: string;
  profession?: string;
  membersCount: number;
  image: string;
}

export type ViewType = 'home' | 'search' | 'post' | 'messages' | 'groups' | 'profile';

export type Language = 'ar' | 'fr';
