import router from 'next/router.js';
import RFB from './core/rfb.js';
import { useEffect, useRef, useState } from 'react';

const Vnc = () => {
    const screenRef = useRef<HTMLDivElement>(null);
    const disconnectedRef = useRef(false);
    const isUserLeavingRef = useRef(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let rfb: RFB;

        const start = async () => {
            const { default: RFB } = await import('./core/rfb.js');

            const getParam = (name: string, def?: string) => {
                const url = new URL(window.location.href);
                return url.searchParams.get(name) ?? def;
            };

            const host = getParam('host', window.location.hostname);
            const port = getParam('port', window.location.port);
            const path = getParam('path', 'websockify');

            const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const wsUrl = `${proto}://${host}${port ? `:${port}` : ''}/${path}`;

            if (!screenRef.current) {
                return;
            }

            rfb = new RFB(screenRef.current, wsUrl, {});

            rfb.scaleViewport = true;
            rfb.viewOnly = false;

            rfb.qualityLevel = 6;
            rfb.compressionLevel = 2;

            rfb.addEventListener('connect', () => {
                setLoading(false);
            });

            rfb.addEventListener('disconnect', () => {
                if (disconnectedRef.current) {
                    return;
                }
                disconnectedRef.current = true;

                if (isUserLeavingRef.current) {
                    return;
                }

                setLoading(true);
                alert('Connection is closed.');
                router.replace('/session');
            });
        };

        start();

        return () => {
            if (rfb) {
                rfb.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const userLeaving = () => {
            isUserLeavingRef.current = true;
        };

        router.events.on('routeChangeStart', userLeaving);
        window.addEventListener('beforeunload', userLeaving);

        return () => {
            router.events.off('routeChangeStart', userLeaving);
            window.removeEventListener('beforeunload', userLeaving);
        };
    }, []);

    return (
        <div className="relative flex flex-col h-screen">
            <div ref={screenRef} className="flex-1 overflow-hidden" />
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center text-white text-xl">
                    Connecting…
                </div>
            )}
        </div>
    );
};

export default Vnc;
