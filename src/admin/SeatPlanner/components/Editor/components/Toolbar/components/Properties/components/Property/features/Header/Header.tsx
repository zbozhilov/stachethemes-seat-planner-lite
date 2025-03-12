import './Header.scss'

const Header = (props: {
    label: string
}) => {

    return (
        <div className='stsp-tooltip-properties-header'>{props.label}</div>
    )
}

export default Header