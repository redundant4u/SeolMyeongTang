import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const Code = ({ code, language }) => {
    const [isClick, setIsClick] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const onClick = () => {
        setIsClick(true);
        navigator.clipboard.writeText(code);

        setTimeout(() => setIsClick(false), 2000);
    };

    useEffect(() => {
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
            setIsDarkMode(event.matches);
        });
    }, []);

    return (
        <div className="relative">
            <div className="absolute mt-6 right-6 flex space-x-4">
                {isClick && <span className="text-sm text-slate-500">복사 완료</span>}
                <img className="mt-0" width={24} src="/icons/copy.png" alt="copy" onClick={onClick} />
            </div>
            <SyntaxHighlighter
                style={isDarkMode ? atomOneDarkReasonable : undefined}
                children={code || ''}
                language={language || 'text'}
                customStyle={{
                    padding: 24,
                    marginTop: 24,
                    marginBottom: 24,
                    borderRadius: 12,
                    lineHeight: 1.7,
                    overflow: 'auto',
                }}
            />
        </div>
    );
};

export default Code;
