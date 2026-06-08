export interface StorageProvider {
    save<T>(key: string, value: T): void;
    load<T>(key: string): T | null;
    remove(key: string): void;
}