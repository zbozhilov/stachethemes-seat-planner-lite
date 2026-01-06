import './CircLoader.scss';
import { useEffect, useRef } from 'react';

const CircLoader = (props: {
    text: string;
    colorMode?: 'dark' | 'light';
    type?: 'small' | 'medium' | 'large';
    style?: React.CSSProperties;
    accentColor?: string;
}) => {

    const { text, colorMode, style, accentColor } = props;
    const containerRef = useRef<HTMLDivElement>(null);

    const classNameArray = ['stachesepl-circ-loader'];

    if (colorMode === 'light') {
        classNameArray.push('stachesepl-circ-loader--light');
    }

    if (props.type === 'small') {
        classNameArray.push('stachesepl-circ-loader--small');
    }

    if (props.type === 'medium') {
        classNameArray.push('stachesepl-circ-loader--medium'); // defaults
    }

    if (props.type === 'large') {
        classNameArray.push('stachesepl-circ-loader--large');
    }

    useEffect(() => {
        if (!accentColor || !containerRef.current) {
            return;
        }

        const el = containerRef.current;

        el.style.setProperty('--stachesepl-circ-loader-color', accentColor);
    }, [accentColor]);

    return (
        <div className={classNameArray.join(' ')} style={style} ref={containerRef}>
            <div>
                <div className="stachesepl-circ-loader-spinner-wrap">
                    <div className="stachesepl-circ-loader-spinner"></div>
                </div>
                {props.type !== 'small' && <div className="stachesepl-circ-loader-text-wrap">
                    <span className="stachesepl-circ-loader-text" style={style ? { color: style.color } : undefined}>{text}</span>
                </div>}
            </div>
        </div>
    )
}

export default CircLoader;