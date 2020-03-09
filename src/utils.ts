export const dayToMs = (day: number | null) => {
    return day? day * 24 * 3600 * 1000 : null;
}

export const msToDay = (ms: number | null) => {
    return ms? ms / 24 / 3600 / 1000 : null;
}

export const convertToFloat = (value: string | number) => {
    return Number.parseFloat(value.toString());
}

export const roundNumber = (value: number, roundTo = 2) => parseFloat(value.toFixed(roundTo)) || 0;

export const getDifferenceInDaysFromNow = (date: Date) => {
    return Math.ceil(Math.abs(
            (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24)
        ));
}