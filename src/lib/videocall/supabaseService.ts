// Supabase Database Service
import { supabase } from './supabaseClient';

export interface Room {
  id: string;
  mentor_id: string;
  duration_minutes: number;
  status: 'active' | 'ended';
  created_at: string;
  updated_at: string;
  ended_at?: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  user_name?: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface Signal {
  id: string;
  room_id: string;
  sender_id: string;
  receiver_id?: string;
  signal_type: 'offer' | 'answer' | 'ice';
  signal_data: any;
  created_at: string;
}

export interface TypingStatus {
  id: string;
  room_id: string;
  user_id: string;
  user_name?: string;
  is_typing: boolean;
  updated_at: string;
}

export class SupabaseService {
  /**
   * Create a new room
   */
  static async createRoom(mentorId: string, durationMinutes: number): Promise<Room> {
    // [MOCK INTERCEPTOR]: Bypass missing 'public.rooms' table
    console.log("[MOCK] createRoom Intercepted");
    return {
      id: `mock-room-${Date.now()}`,
      mentor_id: mentorId,
      duration_minutes: durationMinutes,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Get room by ID
   */
  static async getRoom(roomId: string): Promise<Room> {
    // [MOCK INTERCEPTOR]
    console.log("[MOCK] getRoom Intercepted");
    return {
      id: roomId,
      mentor_id: "mock-mentor-id",
      duration_minutes: 60,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Update room status
   */
  static async updateRoomStatus(roomId: string, status: 'active' | 'ended'): Promise<void> {
    console.log(`[MOCK] updateRoomStatus: ${status}`);
    return Promise.resolve();
  }

  /**
   * Store WebRTC signal
   */
  static async storeSignal(signal: Omit<Signal, 'id' | 'created_at'>): Promise<Signal> {
    console.log("[MOCK] storeSignal Intercepted");
    return {
      ...signal,
      id: `mock-signal-${Date.now()}`,
      created_at: new Date().toISOString()
    };
  }

  /**
   * Get signals for a room
   */
  static async getSignals(roomId: string): Promise<Signal[]> {
    console.log("[MOCK] getSignals Intercepted");
    return [];
  }

  /**
   * Send chat message
   */
  static async sendMessage(message: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>): Promise<ChatMessage> {
    console.log("[MOCK] sendMessage Intercepted");
    return {
      ...message,
      id: `mock-msg-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Get chat history for a room
   */
  static async getChatHistory(roomId: string): Promise<ChatMessage[]> {
    console.log("[MOCK] getChatHistory Intercepted");
    return [];
  }

  /**
   * Subscribe to signals in real-time
   */
  static subscribeToSignals(roomId: string, callback: (signal: Signal) => void) {
    return supabase
      .channel(`signals-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signals',
          filter: `room_id=eq.${roomId}`,
        },
        (payload: any) => {
          callback(payload.new as Signal);
        }
      )
      .subscribe();
  }

  /**
   * Subscribe to chat messages in real-time
   */
  static subscribeToChat(roomId: string, callback: (message: ChatMessage) => void) {
    return supabase
      .channel(`chat-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload: any) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  /**
   * Update typing status
   */
  static async updateTypingStatus(roomId: string, userId: string, isTyping: boolean, userName?: string): Promise<void> {
    console.log(`[MOCK] updateTypingStatus: ${userId} typing=${isTyping}`);
    return Promise.resolve();
  }

  /**
   * Subscribe to typing status changes
   */
  static subscribeToTypingStatus(roomId: string, callback: (status: TypingStatus) => void) {
    return supabase
      .channel(`typing-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `room_id=eq.${roomId}`,
        },
        (payload: any) => {
          callback(payload.new as TypingStatus);
        }
      )
      .subscribe();
  }

  /**
   * Clean up a room (remove all related data)
   */
  static async cleanupRoom(roomId: string): Promise<void> {
    console.log(`[MOCK] cleanupRoom: ${roomId}`);
    return Promise.resolve();
  }
}
