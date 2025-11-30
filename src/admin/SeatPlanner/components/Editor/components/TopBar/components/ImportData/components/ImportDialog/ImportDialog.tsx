import Dialog from '@src/admin/SeatPlanner/components/Editor/components/Dialog/Dialog';
import { __ } from '@src/utils';
import { useRef } from 'react';
import { useImportFromCsv } from './hooks';
import './ImportDialog.scss';

const ImportDialog = (props: {
    isOpen: boolean,
    onClose: () => void
}) => {

    const importInputRef = useRef<HTMLInputElement>(null);

    const { handleClick: handleImportClick } = useImportFromCsv({
        inputRef: importInputRef,
        onClose: props.onClose
    });

    const handleOnClose = () => {
        props.onClose();
    }

    if (!props.isOpen) {
        return null;
    }

    return (
        <Dialog
            title={__('IMPORT_SEAT_PLAN')}
            open={props.isOpen}
            onClose={handleOnClose}>

            <div className='stachesepl-import-content'>
                <p className='stachesepl-import-content-desc'>{__('IMPORT_SEAT_PLAN_DESC')}</p>
                <input ref={importInputRef} type="file" accept=".csv" className="stachesepl-import-input" />
                <button onClick={handleImportClick} className="stachesepl-import-button">{__('IMPORT')}</button>
            </div>

        </Dialog>
    )
}

export default ImportDialog