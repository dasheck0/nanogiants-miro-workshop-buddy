import { ChatMessage, Conversation } from '../dtos/chat.dto';
import { BoardStorage } from './../dtos/miro.dto';

type LocalStorageStoreType =
  | 'conversations'
  | 'currentConversation'
  | 'hasSeenOnboarding'
  | 'frames'
  | 'boardStorage'
  | 'currentRowIndex';

interface StoreData {
  conversations: Conversation[];
  currentConversation?: string;
  hasSeenOnboarding: boolean;
  frames: { id: string; rowIndex: number }[];
  boardStorage: BoardStorage;
  currentRowIndex: number;
}

type Store = {
  [K in LocalStorageStoreType]: StoreData[K];
};

export class LocalStorageStore {
  private store: Store;
  private static instance: LocalStorageStore;

  private readonly storeName: string = 'mmp_workshop_buddy';

  private constructor() {
    this.store = {
      currentConversation: undefined,
      conversations: [],
      hasSeenOnboarding: false,
      frames: [],
      boardStorage: {},
      currentRowIndex: 0,
    };

    this.loadFromLocalStorage();
  }

  public static getInstance(): LocalStorageStore {
    if (!LocalStorageStore.instance) {
      LocalStorageStore.instance = new LocalStorageStore();
    }

    return LocalStorageStore.instance;
  }

  get<T extends LocalStorageStoreType>(key: T): Store[T] {
    return this.store[key];
  }

  public set<T extends LocalStorageStoreType>(key: T, value: Store[T]) {
    console.log('Setting', key, value);
    this.store[key] = value;
    this.saveToLocalStorage();
  }

  remove(key: LocalStorageStoreType) {
    delete this.store[key];
    this.saveToLocalStorage();
  }

  public updateConversation(conversation: Conversation) {
    const index = this.store.conversations.findIndex(c => c.uuid === conversation.uuid);

    if (index === -1) {
      this.store.conversations.push(conversation);
    } else {
      this.store.conversations[index] = conversation;
    }

    this.saveToLocalStorage();
  }

  public addMessageToConversation(conversationUuid: string, message: ChatMessage) {
    const conversation = this.store.conversations.find(c => c.uuid === conversationUuid);

    if (conversation) {
      conversation.messages.push(message);
    }

    this.saveToLocalStorage();
  }

  public setMessagesForConversation(conversationUuid: string, messages: ChatMessage[]) {
    const conversation = this.store.conversations.find(c => c.uuid === conversationUuid);

    if (conversation) {
      conversation.messages = messages;
    }

    this.saveToLocalStorage();
  }

  public addFrame(frameId: string, rowIndex: number) {
    this.store.frames.push({ id: frameId, rowIndex });
    this.saveToLocalStorage();
  }

  private loadFromLocalStorage() {
    const store = localStorage.getItem(this.storeName);

    if (store) {
      this.store = JSON.parse(store);
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.storeName, JSON.stringify(this.store));
  }
}
