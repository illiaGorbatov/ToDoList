export const swap = (arr: Array<any>, index1: number, index2: number) => arr.map((val, idx) => {
    if (idx === index1) return arr[index2];
    if (idx === index2) return arr[index1];
    return val;
});
