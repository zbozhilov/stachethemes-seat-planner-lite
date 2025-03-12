import { WorkflowObject } from "src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { WorkflowProps } from "src/admin/SeatPlanner/components/Editor/components/Workflow/types";

export type FrontWorkflowProps = WorkflowProps;
export type FrontWorkflowObject = WorkflowObject & {
    taken?: boolean
};

export interface SeatPlanDataProps {
    workflowProps: FrontWorkflowProps;
    objects: FrontWorkflowObject[];
}