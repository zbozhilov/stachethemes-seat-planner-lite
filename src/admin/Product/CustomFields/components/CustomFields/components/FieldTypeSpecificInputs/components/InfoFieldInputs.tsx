import { InfoFieldData } from '../../../types';

interface InfoFieldInputsProps {
    field: InfoFieldData;
    index: number;
}

const InfoFieldInputs = ({
    field,
    index,
}: InfoFieldInputsProps) => {
    // Info fields have no value or placeholder inputs
    return null;
};

export default InfoFieldInputs;
