import {TZDate} from '@toast-ui/calendar';

export function clone(date: TZDate): TZDate {
    return new TZDate(date);
}

// eslint-disable-next-line require-jsdoc
export function addHours(d: TZDate, step: number) {
    const date = clone(d);
    date.setHours(d.getHours() + step);

    return date;
}

// eslint-disable-next-line require-jsdoc
export function addDate(d: TZDate, step: number) {
    const date = clone(d);
    date.setDate(d.getDate() + step);

    return date;
}

// eslint-disable-next-line require-jsdoc
export function subtractDate(d: TZDate, steps: number) {
    const date = clone(d);
    date.setDate(d.getDate() - steps);

    return date;
}
