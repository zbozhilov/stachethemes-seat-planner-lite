import { ArrowBack } from "@mui/icons-material";
import Button from "../Button/Button";
import { __ } from "@src/utils";

const WorkflowCloseButton = (props: {
    onClick: () => void;
}) => {

    return (
        <Button
            title={__('BACK_TO_EDIT_PRODUCT_PAGE')}
            onClick={props.onClick}
            icon={ArrowBack} />
    )
}

export default WorkflowCloseButton