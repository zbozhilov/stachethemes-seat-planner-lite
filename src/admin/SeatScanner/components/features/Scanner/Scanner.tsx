import './Scanner.scss'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'

const Scanner = (props: {
    onScanComplete: (data: string|null) => void;
}) => {

    return (
        <div className='stachesepl-scanner'>

            <Header />
            <Body onScanComplete={props.onScanComplete} />
            <Footer onClose={() => {
                props.onScanComplete(null);
            }} />

        </div>
    )
}

export default Scanner