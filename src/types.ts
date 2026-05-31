/**
 * ONEMSU Unified Student Community Hub - Shared Types
 */

export type PrivacyLevel = 'public' | 'friends' | 'private';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  username: string; // e.g. @juan_delacruz
  bio?: string;
  photoURL?: string;
  coverURL?: string;
  campus: string; // e.g. "MSU Main"
  courseAndYear?: string; // e.g. "BS Computer Science - 4th Year"
  role: 'student' | 'faculty' | 'alumni' | 'admin' | 'moderator';
  isVerified: boolean;
  achievements: string[]; // e.g. ["Honor Student", "Founder Member", "Campus Leader"]
  privacySettings: {
    profileVisibility: PrivacyLevel;
    messagePermission: 'everyone' | 'friends';
    activityLogPublic: boolean;
  };
  banned?: boolean;
}

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface PostReaction {
  userId: string;
  userName: string;
  type: ReactionType;
}

export interface PostComment {
  id: string;
  postId: string;
  parentId?: string; // For nested replies
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  userCampus: string;
  userRole: string;
  isVerifiedUser: boolean;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  hashtags: string[];
  groupId?: string; // If posted in a Group
  isPinned?: boolean;
  shares: number;
  reactions: PostReaction[];
  comments: PostComment[];
  timestamp: number;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  senderCampus: string;
  receiverId: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'declined';
}

export interface UserConnections {
  friends: string[]; // List of user IDs
  following: string[]; // List of followed user IDs
  followers: string[]; // List of follower user IDs
  blocked: string[]; // List of blocked user IDs
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  imageUrl: string;
  timestamp: number;
  viewers: string[]; // list of user uids who saw it
  reactions: { userId: string; reaction: string }[];
}

export interface DirectMessage {
  id: string;
  chatId: string; // senderId_receiverId combined sorted
  senderId: string;
  senderName: string;
  text: string;
  mediaUrl?: string;
  timestamp: number;
  seen: boolean;
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  image?: string;
  members: string[]; // User UIDs
  moderators: string[];
  messages: DirectMessage[];
}

export interface Notification {
  id: string;
  receiverId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  type: 'friend_request' | 'accept_request' | 'post_reaction' | 'comment' | 'mention' | 'group_invite' | 'message';
  title: string;
  body: string;
  targetId: string; // Post id, group id, or chat id
  seen: boolean;
  timestamp: number;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  contentType: 'post' | 'comment' | 'user';
  contentId: string;
  reportedId: string; // User ID being reported
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  actionType: 'login' | 'post' | 'comment' | 'friend_add' | 'profile_update' | 'security_log';
  description: string;
  timestamp: number;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  emailAlerts: boolean;
  appearanceMode: 'light' | 'dark' | 'glass';
  primaryColor: string;
}
