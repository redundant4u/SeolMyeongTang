import { LWWRegister } from './LWWRegister';
import { RGB } from './PixelData';

const INITIAL_TIMESTAMP = 1;

type PixelState = {
    colors: RGB[];
    data: {
        [coord: string]: LWWRegister['state'];
    };
};

export class LWWMap {
    private _colors: string[] = ['000000'];
    private _data = new Map<string, LWWRegister>();

    get state() {
        const pState: PixelState = {
            colors: [],
            data: {},
        };

        for (const [coord, register] of this._data.entries()) {
            if (register) {
                pState.colors = this._colors;
                pState.data[coord] = register.state;
            }
        }

        return pState;
    }

    has(coord: string) {
        return this._data.get(coord)?.colorIndex !== null;
    }

    get(coord: string) {
        return this._data.get(coord)?.colorIndex;
    }

    set(coord: string, color: RGB) {
        let colorIndex = this._colors.indexOf(color);

        if (colorIndex === -1) {
            this._colors.push(color);
            this._colors = [...new Set(this._colors)];
            colorIndex = this._colors.length - 1;
        }

        const register = this._data.get(coord);

        if (register) {
            register.set(colorIndex);
        } else {
            this._data.set(coord, new LWWRegister(INITIAL_TIMESTAMP, colorIndex));
        }
    }

    findColor(colorIndex: number) {
        return this._colors[colorIndex];
    }

    merge(pState: PixelState) {
        for (const [coord, remote] of Object.entries(pState.data)) {
            const local = this._data.get(coord);

            if (local) {
                local.merge(remote);
            } else {
                this._colors = pState.colors;
                this._data.set(coord, new LWWRegister(remote[0], remote[1]));
            }
        }
    }
}
