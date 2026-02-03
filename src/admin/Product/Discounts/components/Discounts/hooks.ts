import { isSeatObject } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { WorkflowObject } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEffect, useState } from "react";

export const useDiscountGroups = () => {

    const [groups, setGroups] = useState<string[]>([]);

    const getDiscountGroups = (): string[] => {
        const inputData = document.getElementById('stachesepl-seat-planner-editor-data') as HTMLInputElement;
        const jsonData = JSON.parse(inputData.value);

        if (!jsonData || !jsonData.objects) {
            return [];
        }

        const discountGroups = jsonData.objects.map((object: WorkflowObject) => {
            if (!isSeatObject(object)) {
                return null;
            }

            if (object.group !== undefined && typeof object.group === 'string' && object.group !== '') {
                return object.group;
            }
            
            return null;
        });

        const uniqueDiscountGroups = [...new Set(discountGroups.filter((group: string | null) => group !== null) as string[])];

        return uniqueDiscountGroups;
    }

    useEffect(() => {

        const discountsTab = document.querySelector('.st_seat_planner_discounts_tab') as HTMLDivElement;

        const getGroups = () => {
            const newGroups = getDiscountGroups();
            setGroups(newGroups);
        }

        discountsTab.addEventListener('click', getGroups);
        
        getGroups();

        return () => {
            discountsTab.removeEventListener('click', getGroups);
        }

    }, []);

    return groups;
}