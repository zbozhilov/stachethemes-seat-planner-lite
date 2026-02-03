import { __ } from '@src/utils';
import './FieldToggle.scss';

interface FieldToggleProps {
    checked: boolean;
    onChange: () => void;
    label: string;
}

const FieldToggle = ({ checked, onChange, label }: FieldToggleProps) => {
    return (
        <div className='stachesepl-seat-planner-custom-fields-fw'>
            <div className='stachesepl-seat-planner-custom-fields-flex'>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <span>{label}</span>
            </div>
        </div>
    );
};

export default FieldToggle;

