export type InvitationStatus = 'accepted' | 'pending' | 'declined' | 'not_invited';

export interface Contact {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  role: string;
  invitationStatus: InvitationStatus;
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount: number;
  onlineStatus: 'active' | 'away' | 'offline';
  bio?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: 'user' | string;
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  wasReframed?: boolean;
  originalDraft?: string;
  reframeReason?: string;
}

export interface AiReviewData {
  originalDraft: string;
  suggestedMessage: string;
  explanation: string;
  toneAnalysis: string;
  keyChanges: string[];
  editedMessage: string;
}

export interface UserSettings {
  aiAssistActive: boolean;
  assistIntensity: 'gentle' | 'balanced' | 'direct';
  autoReviewDrafts: boolean;
  hapticFeedback: boolean;
}
