import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-supabase-url')
);

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Could not initialize Supabase client:', err);
  }
}

export const supabase = clientInstance;

// Helper to create a unified room channel that works across both
// Supabase Realtime (when online/configured) and local BroadcastChannel (for offline/demo fallback)
export class MultiChannelSync {
  private localChannel: BroadcastChannel | null = null;
  private channelName: string;
  private onMessageCallback: ((event: string, payload: unknown) => void) | null = null;

  constructor(roomCode: string) {
    this.channelName = `lab_room_${roomCode}`;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.localChannel = new BroadcastChannel(this.channelName);
      this.localChannel.onmessage = (event) => {
        if (this.onMessageCallback && event.data?.type && event.data?.payload) {
          this.onMessageCallback(event.data.type, event.data.payload);
        }
      };
    }

    if (supabase) {
      const channel = supabase.channel(this.channelName);
      channel
        .on('broadcast', { event: '*' }, (payload) => {
          if (this.onMessageCallback) {
            this.onMessageCallback(payload.event, payload.payload);
          }
        })
        .subscribe();
    }
  }

  public onMessage(callback: (event: string, payload: unknown) => void) {
    this.onMessageCallback = callback;
  }

  public broadcast(event: string, payload: unknown) {
    // 1. Broadcast locally for multi-tab / same device instant response
    if (this.localChannel) {
      try {
        this.localChannel.postMessage({ type: event, payload });
      } catch {
        // ignore local broadcast errors
      }
    }

    // 2. Broadcast via Supabase Realtime if configured
    if (supabase) {
      try {
        supabase.channel(this.channelName).send({
          type: 'broadcast',
          event,
          payload,
        });
      } catch {
        // ignore realtime errors
      }
    }
  }

  public destroy() {
    if (this.localChannel) {
      this.localChannel.close();
      this.localChannel = null;
    }
    if (supabase) {
      supabase.removeChannel(supabase.channel(this.channelName));
    }
  }
}
