import { useEffect, useState } from "react";
import { useProductId, useSeatPlanData } from "../components/context/hooks";
import fetchSeatPlanData from "../ajax/fetchSeatPlanData";
import { useSelectedDate } from "../components/context/hooks";
import { SeatPlanDataProps } from "../types";

const useProductSeatPlan = (props: {
    disabled: boolean;
}) => {

    const { productId } = useProductId();
    const { selectedDate } = useSelectedDate();
    const { seatPlanData, setSeatPlanData } = useSeatPlanData();
    const [dataState, setDataState] = useState<'loading' | 'ready' | 'error'>('loading');

    useEffect(() => {

        const controller = new AbortController();

        /**
         * This is added to convert the legacy custom fields where they were missing uid
         * In < 1.4.0 custom fields were using fieldIndex instead of fieldUid
         * This is temporary solution to convert the custom fields to the new format
         * @param seatPlanData 
         * @returns 
         */
        const normalizeCustomFields = (seatPlanData: SeatPlanDataProps): SeatPlanDataProps => {

            if (!seatPlanData.customFields || !Array.isArray(seatPlanData.customFields) || seatPlanData.customFields.length === 0) {
                return seatPlanData;
            }

            const convertedCustomFields = seatPlanData.customFields.map((customField, fieldIndex) => {

                // Create a copy to avoid mutating the original
                const field = structuredClone(customField);

                // Assign uid if missing
                if (!field.uid) {
                    field.uid = 'custom_field_' + fieldIndex;
                }

                // Convert displayConditions from fieldIndex to fieldUid
                if (field.displayConditions && Array.isArray(field.displayConditions)) {
                    field.displayConditions = field.displayConditions.map((condition: any) => {
                        // If already has fieldUid or doesn't have fieldIndex, skip conversion
                        if (condition.fieldUid !== undefined || condition.fieldIndex === undefined) {
                            return condition;
                        }

                        // Convert fieldIndex to fieldUid
                        return {
                            ...condition,
                            fieldUid: 'custom_field_' + condition.fieldIndex
                        };
                    });
                }

                // Convert mutuallyExclusiveWith from indices to uids
                if (field.mutuallyExclusiveWith && Array.isArray(field.mutuallyExclusiveWith)) {
                    field.mutuallyExclusiveWith = field.mutuallyExclusiveWith.map((mutuallyExclusive: any) => {
                        // Only convert if it's numeric (index), skip if already a string (uid)
                        if (typeof mutuallyExclusive === 'number' || (typeof mutuallyExclusive === 'string' && !isNaN(Number(mutuallyExclusive)))) {
                            return 'custom_field_' + mutuallyExclusive;
                        }
                        // If it's already a string and not numeric, assume it's already a uid and leave it as-is
                        return mutuallyExclusive;
                    });
                }

                return field;
            });

            return {
                ...seatPlanData,
                customFields: convertedCustomFields
            };
        }

        const fetchData = async () => {

            try {

                setDataState('loading');

                const seatPlanData = await fetchSeatPlanData({
                    productId: productId,
                    selectedDate: selectedDate,
                    signal: controller.signal,
                });

                setSeatPlanData(normalizeCustomFields(seatPlanData));
                setDataState('ready');

            } catch (e) {

                if (controller.signal.aborted) {
                    return;
                }

                setDataState('error');
            }

        }

        if (true === props.disabled) {
            return;
        }

        fetchData();

        return () => {
            controller.abort();
        }

    }, [props.disabled, productId, selectedDate, setSeatPlanData]);

    return {
        data: seatPlanData,
        dataState,
    }
}

export default useProductSeatPlan;