import { Timestamp } from 'firebase/firestore';

export type Category = 'Academic' | 'Placement' | 'Events' | 'Scholarships' | 'Sports' | 'Hostel' | 'General';
export type Urgency = 'Normal' | 'Important' | 'Urgent';
export type Role = 'admin' | 'student';

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: Category;
  urgency: Urgency;
  expiryDate: Timestamp;
  createdAt: Timestamp;
  attachmentUrl?: string;
  pinned: boolean;
  authorUid: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  category: Category;
  fcmToken: string;
}
