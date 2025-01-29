
const CreateIntialValue = <T extends object>(props?: T) => {
    return Object.entries(props || {}) as Array<[keyof T, T[keyof T]]>
}

class QuickStore<T extends object> {
    private data: Map<keyof T, T[keyof T]>
    private static instance: QuickStore<any> | null = null

    constructor(props?: T) {
        this.data = new Map<keyof T, T[keyof T]>(CreateIntialValue(props))
    }

    static create<T extends object>(props?: T): QuickStore<T> {
        if (this.instance) return this.instance
        return this.instance = new QuickStore<T>(props ?? {} as T)
    }

    set<K extends keyof T>(key: K, value: T[K]) {
        this.data.set(key, value)
    }

    get<K extends keyof T>(key: K) {
        return this.data.get(key)
    }

    delete<K extends keyof T>(key: K) {
        return this.data.delete(key)
    }

    has<K extends keyof T>(key: K) {
        return this.data.has(key)
    }

    clear() {
        this.data.clear()
    }
}

export default QuickStore