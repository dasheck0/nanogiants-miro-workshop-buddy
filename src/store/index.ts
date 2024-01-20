import { ActionPlan, buildEmptyPlan } from '../dtos/actionPlan.dto';
import { Conversation } from '../dtos/chat.dto';

type LocalStorageStoreType = 'openaiapikey' | 'conversations' | 'actionplan' | 'currentConversation';

interface StoreData {
  openaiapikey: string;
  conversations: Conversation[];
  currentConversation?: string;
  actionplan: ActionPlan;
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
      openaiapikey: '',
      actionplan: buildEmptyPlan(),
      currentConversation: undefined,
      conversations: [],
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
    console.log('hfdjskfhdjk', key, this.store[key]);
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
