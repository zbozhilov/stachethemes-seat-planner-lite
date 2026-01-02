import { Toaster as HotToaster } from 'react-hot-toast';

const Toaster = () => {

    return (
        <HotToaster
            position="top-center"
            containerStyle={{
                zIndex: 100000
            }}

            toastOptions={{
                success: {
                    iconTheme: {
                        primary: '#4CAF50',
                        secondary: '#fff',
                    }
                },
                className: 'stachesepl-toast',
                style: {
                    fontSize: '1rem'
                }
            }}
        />
    )

}

export default Toaster;