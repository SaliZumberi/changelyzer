import {Change} from './change';

export interface Diff {
    index: number;
    unvectorized?: string;
    base: string;
    vectorized?: number[] | any;
    vectorizedWhat?: number[];
    vectorizedWhere?: number[];
    changes: Change[];
    changesWhat?: Change[];
    changesWhere?: Change[];
    cluster: number;
}
