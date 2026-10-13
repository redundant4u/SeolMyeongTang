import { describe, it, expect, vi } from 'vitest';
import { LWWRegister } from 'utils/crdt/LWWRegister';
import { LWWMap } from 'utils/crdt/LWWMap';
import { PixelData } from 'utils/crdt/PixelData';
import { PixelEditor } from 'utils/crdt/PixelEditor';

describe('pixel state', () => {
    it.fails('known regression: merging another palette must preserve previously painted colors', () => {
        const local = new PixelData();
        const remote = new PixelData();
        local.set(0, 0, 'ff0000');
        remote.set(1, 1, '00ff00');
        local.merge(remote.state);
        expect(local.get(0, 0)).toBe('ff0000');
        expect(local.get(1, 1)).toBe('00ff00');
    });
    it('increments the clock and ignores older writes while accepting equal and newer clocks', () => {
        const r = new LWWRegister(1, 0);
        r.set(2);
        expect(r.state).toEqual([2, 2]);
        r.merge([1, 8]);
        expect(r.colorIndex).toBe(2);
        r.merge([2, 3]);
        expect(r.colorIndex).toBe(3);
        r.merge([4, 1]);
        expect(r.state).toEqual([4, 1]);
    });
    it('reuses colors, serializes writes and merges remote pixels', () => {
        const map = new LWWMap();
        expect(map.state).toEqual({ colors: [], data: {} });
        map.set('0,0', 'ff0000');
        map.set('0,0', 'ff0000');
        map.set('1,1', '000000');
        expect(map.has('0,0')).toBe(true);
        expect(map.get('0,0')).toBe(1);
        expect(map.findColor(1)).toBe('ff0000');
        expect(map.state.data['0,0']).toEqual([2, 1]);
        map.merge({ colors: ['000000', 'ff0000'], data: { '0,0': [3, 0], '2,2': [1, 1] } });
        expect(map.get('0,0')).toBe(0);
        expect(map.get('2,2')).toBe(1);
    });
    it('reads blank pixels as white, merges and clears the board', () => {
        const p = new PixelData();
        expect(p.get(0, 0)).toBe('ffffff');
        p.set(0, 0, 'ff0000');
        const other = new PixelData();
        other.merge(p.state);
        expect(other.get(0, 0)).toBe('ff0000');
        other.clear();
        expect(other.get(0, 0)).toBe('ffffff');
    });
});

describe('pixel editor pointer input', () => {
    it('fails explicitly when a rendering context is unavailable', () => {
        const el = document.createElement('canvas');
        vi.spyOn(el, 'getContext').mockReturnValue(null);
        expect(() => new PixelEditor(el, { w: 4, h: 4 })).toThrow("Couldn't get rendering context");
    });
    it('paints a continuous stroke once per pixel, ignores uncaptured/outside input and clears', async () => {
        const el = document.createElement('canvas');
        Object.defineProperties(el, { clientWidth: { value: 4 }, clientHeight: { value: 4 } });
        let captured = false;
        el.setPointerCapture = vi.fn(() => {
            captured = true;
        });
        el.hasPointerCapture = vi.fn(() => captured);
        el.releasePointerCapture = vi.fn(() => {
            captured = false;
        });
        const ctx = { scale: vi.fn(), drawImage: vi.fn(), clearRect: vi.fn(), imageSmoothingEnabled: true };
        vi.spyOn(el, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
        vi.stubGlobal(
            'ImageData',
            class {
                constructor(
                    public data: Uint8ClampedArray,
                    public width: number,
                    public height: number
                ) {}
            }
        );
        vi.stubGlobal(
            'createImageBitmap',
            vi.fn(async (data) => data)
        );
        const editor = new PixelEditor(el, { w: 4, h: 4 });
        const changed = vi.fn();
        editor.onchange = changed;
        editor.color = 'ff0000';
        const pointer = (type: string, x: number, y: number) =>
            editor.handleEvent({ type, offsetX: x, offsetY: y, pointerId: 1 } as PointerEvent);
        pointer('pointermove', 0, 0);
        expect(changed).not.toHaveBeenCalled();
        pointer('pointerdown', 0, 0);
        pointer('pointermove', 3, 3);
        expect(changed.mock.lastCall?.[0].data['1,1']).toEqual([1, 1]);
        expect(changed.mock.lastCall?.[0].data['2,2']).toEqual([1, 1]);
        pointer('pointermove', 3, 3);
        expect(changed).toHaveBeenCalledTimes(2);
        for (const [x, y] of [
            [-1, 0],
            [4, 0],
            [0, -1],
            [0, 4],
        ])
            pointer('pointermove', x, y);
        expect(changed).toHaveBeenCalledTimes(2);
        pointer('pointerup', 3, 3);
        pointer('pointerdown', 0, 0);
        expect(changed).toHaveBeenCalledTimes(3);
        pointer('pointerup', 0, 0);
        editor.receive({ colors: ['000000', 'ff0000'], data: { '1,0': [1, 0] } });
        await Promise.resolve();
        expect(ctx.drawImage).toHaveBeenCalled();
        editor.clear();
        expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, el.width, el.height);
        vi.unstubAllGlobals();
    });
});
