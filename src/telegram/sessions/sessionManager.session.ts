export class SessionManager<T> {
  private store = new Map<number, T>();

  start<K extends keyof T>(userId: number, key: K, value: T[K]) {
    const current = this.get(userId) || ({} as T);

    this.store.set(userId, {
      ...current,
      [key]: value,
    });
  }

  get(userId: number): T | undefined {
    return this.store.get(userId);
  }

  update<K extends keyof T>(userId: number, key: K, patch: Partial<T[K]>) {
    const current = this.get(userId);
    if (!current) return;

    const updatedPart = {
      ...((current[key] || {}) as object),
      ...patch,
    };

    this.store.set(userId, {
      ...current,
      [key]: updatedPart,
    });
  }

  end<K extends keyof T>(userId: number, key: K): void {
    const session = this.get(userId);
    if (!session) return;

    const updatedSession = { ...session };
    delete updatedSession[key];

    if (Object.keys(updatedSession).length > 0) {
      this.store.set(userId, updatedSession);
    } else {
      this.store.delete(userId);
    }
  }
  endAll(userId: number) {
    this.store.delete(userId);
  }

  has(userId: number): boolean {
    return this.store.has(userId);
  }
}
