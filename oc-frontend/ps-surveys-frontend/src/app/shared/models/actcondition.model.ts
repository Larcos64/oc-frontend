export const TYPE_CONDITION = "act_condition";

export class ActCondition {

  public constructor(init?: Partial<ActCondition>) {
    Object.assign(this, init);
  }

  idCond: number;
  idQues: number;
  typeCond: string;
  operatorCond: string;
  valueCond: string;
  messageCond: string;
}
