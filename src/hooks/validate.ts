

export const validate = (value: string, field: string): string | boolean => {
    return value === '' || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? `${field} shouldn't be blank or contain blank space` : true
};