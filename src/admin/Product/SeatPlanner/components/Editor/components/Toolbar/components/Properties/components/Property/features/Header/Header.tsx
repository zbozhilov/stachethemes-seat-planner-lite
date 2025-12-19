import './Header.scss'

const Header = (props: {
    label: string
}) => {

    return (
        <div className='stachesepl-tooltip-properties-header'>{props.label}</div>
    )
}

export default Header