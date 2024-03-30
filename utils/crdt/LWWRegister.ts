export class LWWRegister {
    state: [timestamp: number, colorIndex: number];

    get colorIndex() {
        return this.state[1];
    }

    constructor(timestamp: number, colorIndex: number) {
        this.state = [timestamp, colorIndex];
    }

    set(colorIndex: number) {
        this.state = [this.state[0] + 1, colorIndex];
    }

    merge(state: LWWRegister['state']) {
        const [remoteTimestamp] = state;
        const [localTimestamp] = this.state;

        if (localTimestamp >= remoteTimestamp) {
            return;
        }

        this.state = state;
    }
}
