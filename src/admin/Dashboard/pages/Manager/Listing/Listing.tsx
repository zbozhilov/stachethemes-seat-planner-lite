import { Inventory2 } from '@mui/icons-material';
import Input from '@src/admin/Dashboard/layout/Input/Input';
import { __ } from '@src/utils';
import { useState } from 'react';
import { ManagerLayout, type BreadcrumbItem } from '../layout';
import Contents from './components/Contents/Contents';

const Listing = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: __('MANAGER_PRODUCTS'), icon: <Inventory2 /> },
    ];

    return (
        <ManagerLayout
            breadcrumbs={breadcrumbs}
            title={__('MANAGER_LISTING_TITLE')}
            subtitle={__('MANAGER_LISTING_DESCRIPTION')}
            actions={
                <Input
                    type="search"
                    placeholder={__('SEARCH_PRODUCTS')}
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    showClear
                    onClear={() => handleSearchChange('')}
                    className="stachesepl-manager-search-input"
                />
            }
        >
            <Contents
                search={search}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />
        </ManagerLayout>
    );
};

export default Listing;
