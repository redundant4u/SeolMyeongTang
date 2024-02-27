export class LWWRegister<T> {
    readonly id: string;

    state: [peer: string, timestamp: number, value: T];

    get value() {
        return this.state[2];
    }

    constructor(id: string, state: [string, number, T]) {
        this.id = id;
        this.state = state;
    }

    set(value: T) {
        this.state = [this.id, this.state[1] + 1, value];
    }

    merge(state: [peer: string, timestamp: number, value: T]) {
        const [remotePeer, remoteTimestamp] = state;
        const [localPeer, localTimestamp] = this.state;

        if (localTimestamp > remoteTimestamp) {
            return;
        }

        if (localTimestamp === remoteTimestamp && localPeer > remotePeer) {
            return;
        }

        this.state = state;
    }
}
