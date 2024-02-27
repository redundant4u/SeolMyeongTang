import { LWWRegister } from './LWWRegister';

type Value<T> = {
    [key: string]: T;
};

type State<T> = {
    [key: string]: LWWRegister<T | null>['state'];
};

export class LWWMap<T> {
    readonly id: string;
    private _data = new Map<string, LWWRegister<T | null>>();

    constructor(id: string, state: State<T>) {
        this.id = id;

        for (const [key, register] of Object.entries(state)) {
            this._data.set(key, new LWWRegister(this.id, register));
        }
    }

    get value() {
        const value: Value<T> = {};

        for (const [key, register] of this._data.entries()) {
            if (register.value !== null) {
                value[key] = register.value;
            }
        }

        return value;
    }

    get state() {
        const state: State<T> = {};

        for (const [key, register] of this._data.entries()) {
            if (register) {
                state[key] = register.state;
            }
        }

        return state;
    }

    has(key: string) {
        return this._data.get(key)?.value !== null;
    }

    get(key: string) {
        return this._data.get(key)?.value;
    }

    set(key: string, value: T) {
        const register = this._data.get(key);

        if (register) {
            register.set(value);
        } else {
            this._data.set(key, new LWWRegister(this.id, [this.id, 1, value]));
        }
    }

    delete(key: string) {
        this._data.get(key)?.set(null);
    }

    merge(state: State<T>) {
        for (const [key, remote] of Object.entries(state)) {
            const local = this._data.get(key);

            if (local) {
                local.merge(remote);
            } else {
                this._data.set(key, new LWWRegister(this.id, remote));
            }
        }
    }
}
