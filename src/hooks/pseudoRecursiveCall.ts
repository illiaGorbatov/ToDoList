import { api } from "../redux/api";

type PropertiesType<T> = T extends { [key: string]: infer U } ? U : never;
type InferActionTypes<T extends { [key: string]: (...args: any) => any }> = ReturnType<PropertiesType<T>>;


export const pseudoRecursiveCall = async (axiosCall: PropertiesType<typeof api>) => {
    /*const response = axiosCall()*/
}