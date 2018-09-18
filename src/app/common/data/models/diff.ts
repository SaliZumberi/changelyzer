import {Change} from './change';

export interface Diff {
    index: number;
    unvectorized?: string;
    vectorized?: number[] | any;
    base: string;
    vectorizedWhat?: number[];
    vectorizedWhere?: number[];
    changes: Change[];
    changesWhat?: Change[];
    changesWhere?: Change[];
    cluster: number;
}
