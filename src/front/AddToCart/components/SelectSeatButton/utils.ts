import { SeatPlanDataProps } from "../../types";

export const hasSeatPlanData = (data: SeatPlanDataProps | null): data is SeatPlanDataProps => {
    if (!data) {
        return false;
    }

    if (!data.workflowProps) {
        return false;
    }

    if (!data.objects) {
        return false;
    }

    return true;
}