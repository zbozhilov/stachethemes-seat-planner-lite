import './InputWrap.scss';

const InputWrap = (props: {
    flexDirection?: 'row' | 'column';
    gap?: string;
    children: React.ReactNode;
}) => {

    const { flexDirection = 'row', gap = '12px' } = props;

    return (
        <div className='stachesepl-input-wrap' style={{ flexDirection: flexDirection, gap: gap }}>
            {props.children}
        </div>
    )
}

export default InputWrap;