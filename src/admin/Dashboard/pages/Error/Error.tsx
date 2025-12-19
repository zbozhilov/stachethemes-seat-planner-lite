import { useNavigate } from "react-router"
import Button from '../../layout/Button'
import './Error.scss'
import { __ } from "@src/utils"

const Error = (props: {
    headerLabel: string
    titleLabel: string
    errorMessage: string,
    customButton?: React.ReactNode
}) => {

    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    }

    return (
        <div className='stachesepl-page-error'>
            <div className='stachesepl-page-error__container'>
                <div className='stachesepl-page-error__header'>
                    <h1 className='stachesepl-page-error__header-label'>{props.headerLabel}</h1>
                </div>

                <div className='stachesepl-page-error__content'>
                    <h2 className='stachesepl-page-error__title'>{props.titleLabel}</h2>
                    <p className='stachesepl-page-error__message'>{props.errorMessage}</p>

                    <div className='stachesepl-page-error__actions'>
                        {props.customButton ? (
                            props.customButton
                        ) : (
                            <Button onClick={handleGoHome}>
                                {__('GO_HOME')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error