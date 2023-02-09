import { RichText } from 'types/notion';

type PropTypes = {
    text: [RichText];
};

const Text = ({ text }: PropTypes) => {
    const result = text.map((value: RichText, index) => {
        const {
            annotations: { bold, code, color, italic, strikethrough, underline },
            text,
        } = value;

        return (
            <span
                key={index}
                className={[
                    bold ? 'font-bold' : '',
                    code ? 'p-1 rounded bg-[#f2f2f2] font-mono dark:bg-[#0f081c]' : '',
                    italic ? 'italic' : '',
                    strikethrough ? 'line-through' : '',
                    underline ? 'underline' : '',
                ].join(' ')}
                style={color !== 'default' ? { color } : {}}
            >
                {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
            </span>
        );
    });

    return <>{result}</>;
};

export default Text;
