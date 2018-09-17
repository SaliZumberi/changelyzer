import {Change} from './change';

export interface Contribution {
  obj: Change | any;
  percentage: string;
}
