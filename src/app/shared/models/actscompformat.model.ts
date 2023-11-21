export const TYPE_COMPANY_FORMAT = "acts_company_format";

export class ActsCompFormat {

  public constructor(init?: Partial<ActsCompFormat>) {
    Object.assign(this, init);
  }

  idComp: number;
  idFormat: number;
  idCf: number;
  stateCompFor: boolean;
}
