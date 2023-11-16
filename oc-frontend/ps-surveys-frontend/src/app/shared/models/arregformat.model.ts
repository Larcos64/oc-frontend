export const TYPE_REGISTER_FORMAT = "ar_register_format";

export class ArRegFormat {

  public constructor(init?: Partial<ArRegFormat>) {
    Object.assign(this, init);
  }

  idRf: number;
  idWorkplace: number;
  idFormat: number;
  idUser: number;
  idComp: number;
  initDateRf: Date;
  finDateRf: Date;
}
