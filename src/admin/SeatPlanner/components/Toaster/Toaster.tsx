import { Toaster as HotToaster } from 'react-hot-toast'

const Toaster = () => {
    return (
            <HotToaster
                 position='bottom-center'
                 containerStyle={{
                    zIndex: 100000
                }}
                 toastOptions={{
                     duration: 2000,
                     className: 'strsai-toast',
                     style: {
                         background: '#1e1e1e',
                         color: '#fff',
                     }
                 }}

            />
    )
}

export default Toaster