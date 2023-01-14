import { RichText } from 'types/notion';
import styles from '../styles/post.module.css';

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
                    bold ? styles.bold : '',
                    code ? styles.code : '',
                    italic ? styles.italic : '',
                    strikethrough ? styles.strikethrough : '',
                    underline ? styles.underline : '',
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
