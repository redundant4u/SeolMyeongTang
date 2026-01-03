import { useEffect, useState } from 'react';

type PropTypes = {
    ttl: number;
    onExpired?: () => void;
};

const CountDownTTL = ({ ttl, onExpired }: PropTypes) => {
    const [currentTTL, setCurrentTtl] = useState<number>(ttl);

    const formatTTL = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (currentTTL <= 0) {
            onExpired?.();
            return;
        }

        const timer = setInterval(() => {
            setCurrentTtl((prevTtl) => (prevTtl > 0 ? prevTtl - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [currentTTL, onExpired]);

    return (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono">{formatTTL(Math.max(currentTTL, 0))}</span>
    );
};

export default CountDownTTL;
