import './LabelPreview.scss';

const LabelPreview = (props: {
    text: string
}) => {
    return (
        <p className="stachesepl-cart-label-preview">{props.text}</p>
    )
}

export default LabelPreview;