import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { __ } from '@src/utils';
import './ExpandCollapseAllButton.scss';

interface ExpandCollapseAllButtonProps {
    allExpanded: boolean;
    onClick: () => void;
}

const ExpandCollapseAllButton = ({ allExpanded, onClick }: ExpandCollapseAllButtonProps) => (
    <button
        type="button"
        className="stachesepl-expand-collapse-all-button"
        onClick={onClick}
    >
        {allExpanded ? (
            <>
                <ExpandLess />
                {__('COLLAPSE_ALL')}
            </>
        ) : (
            <>
                <ExpandMore />
                {__('EXPAND_ALL')}
            </>
        )}
    </button>
);

export default ExpandCollapseAllButton;
