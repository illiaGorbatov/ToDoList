import {MutableRefObject, useEffect, useRef, useState} from "react";
import ResizeObserver from 'resize-observer-polyfill';

type BoundsType = {
    left: number,
    top: number,
    width: number,
    height: number
};


export const useMeasure = (): [, BoundsType] => {
    const ref: MutableRefObject<Element | undefined> = useRef();
    const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
    const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)));
    useEffect(() => (ro.observe(ref.current as Element), ro.disconnect), []);
    return [{ ref }, bounds]
};