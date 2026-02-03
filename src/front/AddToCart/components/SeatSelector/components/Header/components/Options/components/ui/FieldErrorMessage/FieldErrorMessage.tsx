import './FieldErrorMessage.scss';

const FieldErrorMessage = ({ message }: { message: string }) => {
    return (
        <div className="stachesepl-field-error-message">
            {message}
        </div>
    )
}

export default FieldErrorMessage;