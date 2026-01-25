import { HashRouter, Route, Routes } from 'react-router';
import LazyError from '../pages/Error/LazyError';
import LazyOverview from '../pages/Overview/LazyOverview';
import LazySettings from '../pages/Settings/LazySettings';
import LazyScanner from '../pages/Scanner/LazyScanner';
import LazyTools from '../pages/Tools/LazyTools';
import LazyOrderNotFound from '../pages/OrderNotFound/LazyOrderNotFound';
import { useWordpressMenuListener } from '../hooks/useWordpressMenuListener';
import { __ } from '@src/utils';
import LazyListing from '../pages/Manager/Listing/LazyListing';
import LazyAvailability from '../pages/Manager/Availability/LazyAvailability';
import LazyEditSeat from '../pages/Manager/EditSeat/LazyEditSeat';
import LazyDates from '../pages/Manager/Dates/LazyDates';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const WordPressMenuListener = ({ children }: { children: React.ReactNode }) => {
    useWordpressMenuListener();
    return children;
}

const AdminRouter = () => {

    const queryClient = new QueryClient();

    return (
        <HashRouter>
            <WordPressMenuListener>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route path="/" element={<LazyOverview />} />
                        <Route path="/overview" element={<LazyOverview />} />
                        <Route path="/settings" element={<LazySettings />} />
                        <Route path="/scanner" element={<LazyScanner />} />
                        <Route path="/manager/" element={<LazyListing />} />

                        <Route path="/manager/product/:productId/availability/" element={<LazyAvailability />} />
                        <Route path="/manager/product/:productId/availability/edit/:seatId" element={<LazyEditSeat />} />

                        <Route path="/manager/product/:productId/dates/" element={<LazyDates />} />

                        <Route path="/manager/product/:productId/date/:dateTime/availability/" element={<LazyAvailability />} />
                        <Route path="/manager/product/:productId/date/:dateTime/availability/edit/:seatId" element={<LazyEditSeat />} />

                        <Route path="/manager/listing/:pageId" element={<LazyListing />} />
                        <Route path="/tools" element={<LazyTools />} />
                        <Route path="/orderNotFound" element={<LazyOrderNotFound />} />

                        <Route path="*" element={<LazyError
                            headerLabel={__('PAGE_NOT_FOUND')}
                            titleLabel={__('OPS')}
                            errorMessage={__('THE_PAGE_YOU_ARE_LOOKING_FOR_DOES_NOT_EXIST')}
                        />} />
                    </Routes>
                </QueryClientProvider>
            </WordPressMenuListener>
        </HashRouter>
    );
};

export default AdminRouter;