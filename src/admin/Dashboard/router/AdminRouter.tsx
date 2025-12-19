import { HashRouter, Route, Routes } from 'react-router';
import LazyError from '../pages/Error/LazyError';
import LazyOverview from '../pages/Overview/LazyOverview';
import LazySettings from '../pages/Settings/LazySettings';
import LazyScanner from '../pages/Scanner/LazyScanner';
import LazyTools from '../pages/Tools/LazyTools';
import LazyOrderNotFound from '../pages/OrderNotFound/LazyOrderNotFound';
import { useWordpressMenuListener } from '../hooks/useWordpressMenuListener';
import { __ } from '@src/utils';

const WordPressMenuListener = ({ children }: { children: React.ReactNode }) => {
    useWordpressMenuListener();
    return children;
}

const AdminRouter = () => {

    return (
        <HashRouter>
            <WordPressMenuListener>
                <Routes>
                    <Route path="/" element={<LazyOverview />} />
                    <Route path="/overview" element={<LazyOverview />} />
                    <Route path="/settings" element={<LazySettings />} />
                    <Route path="/scanner" element={<LazyScanner />} />
                    <Route path="/tools" element={<LazyTools />} />
                    <Route path="/orderNotFound" element={<LazyOrderNotFound />} />

                    <Route path="*" element={<LazyError
                        headerLabel={__('PAGE_NOT_FOUND')}
                        titleLabel={__('OPS')}
                        errorMessage={__('THE_PAGE_YOU_ARE_LOOKING_FOR_DOES_NOT_EXIST')}
                    />} />
                </Routes>
            </WordPressMenuListener>
        </HashRouter>
    );
};

export default AdminRouter;