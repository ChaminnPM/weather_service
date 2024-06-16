class CacheHelper {
    private static instance: CacheHelper;
    private store: Map<string, any>;

    private constructor() {
        this.store = new Map();
    }

    static getInstance(): CacheHelper {
    if (!CacheHelper.instance) {
        CacheHelper.instance = new CacheHelper();
    }
    return CacheHelper.instance;
    }

    set(key: string, value: any): void {
    this.store.set(key, value);
    }

    get(key: string): any | undefined {
    return this.store.get(key);
    }

    existKey(key: string): boolean {
        return this.store.has(key);
    }

    remove(key: string): void {
    this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }
}

export default CacheHelper;