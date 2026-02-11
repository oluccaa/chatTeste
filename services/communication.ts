
import { Message } from '../types.ts';

export class ChatService {
  private channel: BroadcastChannel | null = null;
  private room: string = '';

  constructor(room: string) {
    this.room = room;
    this.channel = new BroadcastChannel(`nexus_chat_${room}`);
  }

  onMessage(callback: (msg: Message) => void) {
    if (!this.channel) return;
    this.channel.onmessage = (event) => {
      callback(event.data as Message);
    };
  }

  sendMessage(msg: Message) {
    if (!this.channel) return;
    this.channel.postMessage(msg);
  }

  close() {
    this.channel?.close();
  }
}
