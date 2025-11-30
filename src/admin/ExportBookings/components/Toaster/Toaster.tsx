import { Toaster as HotToaster } from 'react-hot-toast'
import { Portal } from 'react-portal'

const Toaster = () => {
    return (
        <Portal>
            <HotToaster
                 position='top-center'
                 containerStyle={{
                    zIndex: 100000
                }}
                 toastOptions={{
                     duration: 2000,
                     className: 'stachesepl-toast',
                     style: {
                         background: '#242424',
                         color: '#fff',
                     }
                 }}

            />
        </Portal>
    )
}

export default Toaster