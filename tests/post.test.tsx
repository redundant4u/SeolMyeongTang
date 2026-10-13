import { beforeEach, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Post from 'components/Post';
import ImageZoom from 'components/ImageZoom';

const zoom = vi.hoisted(() => ({ attach: vi.fn(), detach: vi.fn(), create: vi.fn() }));
vi.mock('medium-zoom', () => ({
    default: (options) => {
        zoom.create(options);
        return zoom;
    },
}));
beforeEach(() => {
    vi.clearAllMocks();
});

it('renders Markdown links, raw HTML, tables, images, inline and fenced code with copy feedback', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const listeners: ((e: { matches: boolean }) => void)[] = [];
    vi.mocked(window.matchMedia).mockImplementation(() => ({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((_name, listener) => {
            listeners.push(listener);
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
    }));
    const post = {
        Title: 'Article title',
        SK: 'post1',
        CreatedAt: '2026-01-01',
        Tags: null,
        Content:
            '# Heading\n\nA `word` and [link](https://example.com).\n\n```js\nconst x = 1;\n```\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n![photo](/photo.png)\n\n<strong>raw</strong>',
    };
    const view = render(<Post post={post} />);
    expect(screen.getByText('Article title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument();
    expect(screen.getByText('word')).toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveTextContent('AB12');
    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByAltText('photo')).toHaveAttribute('src', '/photo.png');
    expect(screen.getByText('raw').tagName).toBe('STRONG');
    fireEvent.click(view.container.querySelector('svg')!);
    expect(writeText).toHaveBeenCalledWith('const x = 1;\n');
    expect(screen.getByText('복사 완료')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.queryByText('복사 완료')).not.toBeInTheDocument();
    act(() => listeners.forEach((listener) => listener({ matches: false })));
    view.unmount();
    expect(zoom.attach).toHaveBeenCalled();
    expect(zoom.detach).toHaveBeenCalled();
});

it('attaches zoom to image changes and accepts caller options', () => {
    const view = render(<ImageZoom src="/a.png" alt="a" options={{ background: 'white' }} />);
    expect(zoom.create).toHaveBeenCalledWith({ background: 'white' });
    expect(zoom.attach).toHaveBeenCalledWith(screen.getByAltText('a'));
    view.rerender(<ImageZoom src="/b.png" alt="b" />);
    expect(screen.getByAltText('b')).toHaveAttribute('src', '/b.png');
    view.unmount();
    expect(zoom.detach).toHaveBeenCalled();
});
