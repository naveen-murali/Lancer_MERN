const fromDate = (date: Date) => {
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    return date;
};
const toDate = (date: Date) => {
    date.setUTCHours(23);
    date.setUTCMinutes(59);
    date.setUTCSeconds(59);
    date.setUTCMilliseconds(999);

    return date;
};

export const getWeek = () => {
    const date = new Date();
    const sunday = new Date(date.setDate(date.getDate() - date.getDay()));
    const result = [
        {
            from: fromDate(new Date(sunday)),
            to: toDate(new Date(sunday)),
        },
    ];

    const week = [...new Array(6)].map(() => {
        const newDate = sunday.setDate(sunday.getDate() + 1);
        return {
            from: fromDate(new Date(newDate)),
            to: toDate(new Date(newDate)),
        };
    });

    return [...result, ...week];
};

export const getYear = () => {
    const year = [...new Array(12)].map((_, index) => {
        const newDate = new Date();

        newDate.setMonth(index);
        newDate.setDate(1);

        return {
            from: fromDate(new Date(newDate)),
            to: toDate(new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0)),
        };
    });

    return year;
};
