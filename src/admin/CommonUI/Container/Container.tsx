import './Container.scss';

const Container = (props: {
    label: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}) => {

    const classNameArray = ['stachesepl-admin-container'];
    if (props.className) {
        classNameArray.push(props.className);
    }

    return (
        <div className={classNameArray.join(' ')}>
            <h4 className='stachesepl-admin-container-label'>{props.label}</h4>
            {props.description && <p className='stachesepl-admin-container-description'>{props.description}</p>}

            {props.children}
        </div>
    )
}

export default Container;