import Dialog from '@src/admin/Product/SeatPlanner/components/Editor/components/Dialog/Dialog';
import { __ } from '@src/utils';
import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { useImportFromCsv } from './hooks';
import './ImportDialog.scss';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const ImportDialog = (props: {
    isOpen: boolean,
    onClose: () => void
}) => {

    const importInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const { handleClick: handleImportClick } = useImportFromCsv({
        inputRef: importInputRef,
        onClose: props.onClose
    });

    const handleOnClose = () => {
        setSelectedFile(null);
        props.onClose();
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.name.endsWith('.csv')) {
            setSelectedFile(file);
            // Update the input ref for the import hook
            if (importInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                importInputRef.current.files = dataTransfer.files;
            }
        }
    };

    const handleDropzoneClick = () => {
        importInputRef.current?.click();
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (importInputRef.current) {
            importInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

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

                <input
                    ref={importInputRef}
                    type="file"
                    accept=".csv"
                    className="stachesepl-import-input"
                    onChange={handleFileChange}
                />

                {!selectedFile ? (
                    <div
                        className={`stachesepl-import-dropzone ${isDragging ? 'has-file' : ''}`}
                        onClick={handleDropzoneClick}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="stachesepl-import-dropzone-icon">
                            <UploadFileIcon />
                        </div>
                        <div className="stachesepl-import-dropzone-text">
                            <p className="stachesepl-import-dropzone-primary">
                                {__('DROP_CSV_FILE_HERE_OR')} <span>{__('BROWSE')}</span>
                            </p>
                            <p className="stachesepl-import-dropzone-secondary">
                                {__('SUPPORTS_CSV_FILES')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="stachesepl-import-file-info">
                        <div className="stachesepl-import-file-icon">
                            <InsertDriveFileIcon />
                        </div>
                        <div className="stachesepl-import-file-details">
                            <p className="stachesepl-import-file-name">{selectedFile.name}</p>
                            <p className="stachesepl-import-file-size">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button
                            type="button"
                            className="stachesepl-import-file-remove"
                            onClick={handleRemoveFile}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                )}

                <button
                    onClick={handleImportClick}
                    className="stachesepl-import-button"
                    disabled={!selectedFile}
                >
                    <FileUploadIcon />
                    {__('IMPORT')}
                </button>
            </div>

        </Dialog>
    )
}

export default ImportDialog
