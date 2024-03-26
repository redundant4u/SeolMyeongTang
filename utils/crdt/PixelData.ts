import { LWWMap } from './LWWMap';

export type RGB = string;

export class PixelData {
    private data: LWWMap<RGB>;

    constructor() {
        this.data = new LWWMap({});
    }

    static key(x: number, y: number) {
        return `${x},${y}`;
    }

    get state() {
        return this.data.state;
    }

    set(x: number, y: number, value: RGB) {
        const key = PixelData.key(x, y);
        this.data.set(key, value);
    }

    get(x: number, y: number): RGB {
        const key = PixelData.key(x, y);
        const register = this.data.get(key);

        return register ?? 'ffffff';
    }

    delete(x: number, y: number) {
        const key = PixelData.key(x, y);
        this.data.delete(key);
    }

    merge(state: PixelData['state']) {
        this.data.merge(state);
    }

    clear() {
        this.data = new LWWMap({});
    }
}
