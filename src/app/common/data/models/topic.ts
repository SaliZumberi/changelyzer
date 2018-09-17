import {Contribution} from './contribution';

export interface Topic {
  index: number;
  changeContributions: Contribution[]
  diffContribution?: Contribution[]
}
