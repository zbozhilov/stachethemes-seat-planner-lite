import { fieldsData, MetaFieldData } from "@src/admin/Product/CustomFields/components/CustomFields/types";
import { discountData } from "@src/admin/Product/Discounts/components/Discounts/types";
import { WorkflowObject } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { WorkflowProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/types";

export type FrontWorkflowProps = WorkflowProps;
export type FrontWorkflowObject = WorkflowObject & {
    taken?: boolean
    discount?: string
    group?: string
    customFields?: Record<string, string | number | boolean>; // pair of custom field name and value
};
export type FrontDiscountData = discountData;

export type CustomFieldsEntryData = Record<string, string | number | boolean>;
export type MetaFieldsEntryData = Record<string, string>;

export type FrontCustomFieldData = Exclude<fieldsData, MetaFieldData>;

export interface SeatPlanDataProps {
    workflowProps: FrontWorkflowProps;
    objects: FrontWorkflowObject[];
    discounts?: FrontDiscountData[];
    minSeatsPerPurchase?: number;    
    maxSeatsPerPurchase?: number;
    customFields?: FrontCustomFieldData[];
}