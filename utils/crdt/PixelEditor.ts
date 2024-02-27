import { PixelData, RGB } from './PixelData';

type ArtBoard = { w: number; h: number };

export class PixelEditor {
    private _el: HTMLCanvasElement;

    private _ctx: CanvasRenderingContext2D;

    private _artboard: ArtBoard;

    private _data: PixelData = new PixelData('seolmyeongtang');

    private _color: RGB = [0, 0, 0];

    private _painted = new Set<string>();

    private _prev: [x: number, y: number] | undefined;

    private _listeners: Array<(state: PixelData['state']) => void> = [];

    constructor(el: HTMLCanvasElement, artboard: ArtBoard) {
        this._el = el;

        const ctx = el.getContext('2d');

        if (!ctx) {
            throw new Error("Couldn't get rendering context");
        }
        this._ctx = ctx;

        this._artboard = artboard;

        this._el.addEventListener('pointerdown', this);
        this._el.addEventListener('pointermove', this);
        this._el.addEventListener('pointerup', this);

        this._el.width = this._el.clientWidth * devicePixelRatio;
        this._el.height = this._el.clientHeight * devicePixelRatio;
        this._ctx.scale(devicePixelRatio, devicePixelRatio);
        this._ctx.imageSmoothingEnabled = false;
    }

    set onchange(listener: (state: PixelData['state']) => void) {
        this._listeners.push(listener);
    }

    set color(color: RGB) {
        this._color = color;
    }

    handleEvent(e: PointerEvent) {
        switch (e.type) {
            case 'pointerdown': {
                this._el.setPointerCapture(e.pointerId);
            }
            case 'pointermove': {
                if (!this._el.hasPointerCapture(e.pointerId)) return;

                const x = Math.floor((this._artboard.w * e.offsetX) / this._el.clientWidth),
                    y = Math.floor((this._artboard.h * e.offsetY) / this._el.clientHeight);

                this.paint(x, y);

                this._prev = [x, y];
                break;
            }
            case 'pointerup': {
                this._el.releasePointerCapture(e.pointerId);
                this._prev = undefined;
                this._painted.clear();
                break;
            }
        }
    }

    private paint(x: number, y: number) {
        if (x < 0 || this._artboard.w <= x) {
            return;
        }
        if (y < 0 || this._artboard.h <= y) {
            return;
        }

        if (!this.checkPainted(x, y)) {
            this._data.set(x, y, this._color);
        }

        let [x0, y0] = this._prev || [x, y];

        const dx = x - x0,
            dy = y - y0;

        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        const xinc = dx / steps,
            yinc = dy / steps;

        for (let i = 0; i < steps; i++) {
            x0 += xinc;
            y0 += yinc;

            const x1 = Math.round(x0);
            const y1 = Math.round(y0);

            if (!this.checkPainted(x1, y1)) {
                this._data.set(x1, y1, this._color);
            }
        }

        this.draw();
        this.notify();
    }

    private async draw() {
        const chans = 4;

        const buffer = new Uint8ClampedArray(this._artboard.w * this._artboard.h * chans);

        const rowsize = this._artboard.w * chans;

        for (let row = 0; row < this._artboard.h; row++) {
            const offsetY = row * rowsize;

            for (let col = 0; col < this._artboard.w; col++) {
                const offsetX = col * chans;

                const offset = offsetY + offsetX;

                const [r, g, b] = this._data.get(col, row);
                buffer[offset] = r;
                buffer[offset + 1] = g;
                buffer[offset + 2] = b;
                buffer[offset + 3] = 255;
            }
        }

        const data = new ImageData(buffer, this._artboard.w, this._artboard.h);
        const bitmap = await createImageBitmap(data);
        this._ctx.drawImage(bitmap, 0, 0, this._el.clientWidth, this._el.clientHeight);
    }

    private notify() {
        const state = this._data.state;
        for (const listener of this._listeners) {
            listener(state);
        }
    }

    private checkPainted(x: number, y: number) {
        const key = PixelData.key(x, y);

        const painted = this._painted.has(key);
        this._painted.add(key);

        return painted;
    }

    receive(state: PixelData['state']) {
        this._data.merge(state);
        this.draw();
    }

    clear() {
        this._ctx.clearRect(0, 0, this._el.width, this._el.height);
        this._data.clear();
    }
}
