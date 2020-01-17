export const dayToMs = (day: number | null) => {
    return day? day * 24 * 3600 * 1000 : null;
}

export const msToDay = (ms: number | null) => {
    return ms? ms / 24 / 3600 / 1000 : null;
}
