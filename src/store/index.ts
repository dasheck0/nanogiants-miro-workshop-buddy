type LocalStorageStoreType = 'openaiapikey';

export class LocalStorageStore {
  private store: Record<LocalStorageStoreType, any>;
  private static instance: LocalStorageStore;

  private readonly storeName: string = 'mmp_workshop_buddy';

  private constructor() {
    this.store = {
      openaiapikey: '',
    };

    this.loadFromLocalStorage();
  }

  public static getInstance(): LocalStorageStore {
    if (!LocalStorageStore.instance) {
      LocalStorageStore.instance = new LocalStorageStore();
    }

    return LocalStorageStore.instance;
  }

  get(key: LocalStorageStoreType) {
    return this.store[key];
  }

  set<T>(key: LocalStorageStoreType, value: T) {
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
