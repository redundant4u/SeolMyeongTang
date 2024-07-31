import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs';
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import CopySVG from 'public/icons/copy.svg';

type PropTypes = {
    code: string;
    language: string;
};

const Code = ({ code, language }: PropTypes) => {
    const [isClick, setIsClick] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const onClick = () => {
        setIsClick(true);
        navigator.clipboard.writeText(code);

        setTimeout(() => setIsClick(false), 1500);
    };

    useEffect(() => {
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
            setIsDarkMode(event.matches);
        });
    }, []);

    return (
        <div className="mt-8 mb-8">
            <div className="flex justify-between pt-3 pr-6 pb-3 pl-6  rounded-tl-lg rounded-tr-lg bg-gray-200 dark:bg-gray-600">
                <div className="opacity-70 ">{language.toUpperCase()}</div>
                <div className="flex items-center space-x-2">
                    {isClick && (
                        <div>
                            <span className="text-sm opacity-70">복사 완료</span>
                        </div>
                    )}
                    <div>
                        <CopySVG width={20} height={20} onClick={onClick} className="dark:fill-gray-200" />
                    </div>
                </div>
            </div>
            <SyntaxHighlighter
                style={isDarkMode ? atomOneDarkReasonable : undefined}
                children={code}
                language={language}
                customStyle={{
                    padding: 24,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 12,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 12,
                    lineHeight: 1.5,
                    overflow: 'auto',
                    fontSize: 14,
                }}
            />
        </div>
    );
};

export default Code;
