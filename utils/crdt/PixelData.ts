import { LWWMap } from './LWWMap';

export type RGB = string;

export class PixelData {
    private data: LWWMap;

    constructor() {
        this.data = new LWWMap();
    }

    static key(x: number, y: number) {
        return `${x},${y}`;
    }

    get state() {
        return this.data.state;
    }

    set(x: number, y: number, color: RGB) {
        const coord = PixelData.key(x, y);
        this.data.set(coord, color);
    }

    get(x: number, y: number): RGB {
        const coord = PixelData.key(x, y);

        const colorIndex = this.data.get(coord);
        const color = colorIndex !== undefined ? this.data.findColor(colorIndex) : 'ffffff';

        return color;
    }

    merge(state: PixelData['state']) {
        this.data.merge(state);
    }

    clear() {
        this.data = new LWWMap();
    }
}
