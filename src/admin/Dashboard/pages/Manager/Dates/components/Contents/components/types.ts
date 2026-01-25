export type DateGroup = {
    date: string;
    dateDisplay: string;
    dayName: string;
    month: string;
    day: string;
    times: Array<{ time: string; dateTime: string }>;
};

export type MonthGroup = {
    monthYearKey: string;
    monthName: string;
    year: number;
    monthNum: number;
    dateGroups: DateGroup[];
    totalDates: number;
    totalTimeSlots: number;
};

export type FormattedDateTime = {
    date: string;
    time: string;
    dayName: string;
    month: string;
    day: string;
    year: number;
    monthNum: number;
    monthYearKey: string;
};
