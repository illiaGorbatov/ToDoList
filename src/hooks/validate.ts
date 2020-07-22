

export const validate = (value: string | null): boolean => {
    return value !== '' && value !== null && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
};