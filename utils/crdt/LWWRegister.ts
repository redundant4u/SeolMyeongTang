export class LWWRegister<T> {
    state: [timestamp: number, value: T];

    get value() {
        return this.state[1];
    }

    constructor(state: [number, T]) {
        this.state = state;
    }

    set(value: T) {
        this.state = [this.state[0] + 1, value];
    }

    merge(state: [timestamp: number, value: T]) {
        const [remoteTimestamp] = state;
        const [localTimestamp] = this.state;

        if (localTimestamp > remoteTimestamp) {
            return;
        }

        if (localTimestamp === remoteTimestamp) {
            return;
        }

        this.state = state;
    }
}
