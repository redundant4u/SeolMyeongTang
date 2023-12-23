import { useRef, ComponentProps, RefCallback } from 'react';
import mediumZoom, { Zoom, ZoomOptions } from 'medium-zoom';

type PropTypes = ComponentProps<'img'> & {
    options?: ZoomOptions;
};

const ImageZoom = ({ options, ...props }: PropTypes) => {
    const zoomRef = useRef<Zoom | null>(null);

    const getZoom = () => {
        if (zoomRef.current === null) {
            zoomRef.current = mediumZoom(options || { background: 'rgb(0, 0, 0, 8)' });
        }

        return zoomRef.current;
    };

    const attachZoom: RefCallback<HTMLImageElement> = (node) => {
        const zoom = getZoom();

        if (node) {
            zoom.attach(node);
        } else {
            zoom.detach();
        }
    };

    return <img {...props} ref={attachZoom} />;
};

export default ImageZoom;
