import { Toaster as HotToaster } from 'react-hot-toast'
import './Toaster.scss'

const Toaster = () => {
    return (
        <HotToaster
            position='bottom-center'
            containerStyle={{
                zIndex: 100000
            }}
            toastOptions={{
                duration: 2500,
                className: 'stachesepl-toast',
            }}
        />
    )
}

export default Toaster