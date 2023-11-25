export const TYPE_WORKPLACE = "work_area";

export class AcsWorkplace {

  public constructor(init?: Partial<AcsWorkplace>) {
    Object.assign(this, init);
  }

  idWorkplace: number;
  idComp: number;
  nameWorkplace: string;
  addressWorkplace: string;
  phoneWorkplace: string;
  fixed: boolean;
  riskLvlWorkplace: number;
}
