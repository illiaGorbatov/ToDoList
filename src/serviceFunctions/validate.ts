

export const validate = (value: string | null): boolean => {
    return value !== null && !/^\s*$/.test(value) && value.length < 100
};