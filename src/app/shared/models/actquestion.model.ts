import { ActCondition } from './actcondition.model';
import { ActDependency } from './actdependency.model';
export const TYPE_QUES = "act_ques";

export class ActQues {

  public constructor(init?: Partial<ActQues>) {
    Object.assign(this, init);
  }

  idQues: number;
  idSec: number;
  idOpt?: number;
  nameQues: string;
  descQues: string;
  typeQues: string;
  infoQues: string;
  mandatoryQues: boolean;
  styleQues: string;
  conditions?: ActCondition[];
  itemValue?:number;
  orderQues?:number;
}
