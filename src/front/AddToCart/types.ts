import { discountData } from "@src/admin/Discounts/components/Discounts/types";
import { WorkflowObject } from "src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { WorkflowProps } from "src/admin/SeatPlanner/components/Editor/components/Workflow/types";

export type FrontWorkflowProps = WorkflowProps;
export type FrontWorkflowObject = WorkflowObject & {
    taken?: boolean
    discount?: string
    group?: string
};
export type FrontDiscountData = discountData;

export interface SeatPlanDataProps {
    workflowProps: FrontWorkflowProps;
    objects: FrontWorkflowObject[];
    discounts?: FrontDiscountData[];
    minSeatsPerPurchase?: number;    
    maxSeatsPerPurchase?: number;
}