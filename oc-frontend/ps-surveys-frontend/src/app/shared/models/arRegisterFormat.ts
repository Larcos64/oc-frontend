export const TYPE_VERSION_SECTION = "ar_register_format";

export class ArRegisterFormat {

  public constructor(init?: Partial<ArRegisterFormat>) {
    Object.assign(this, init);
  }

  idRf: number
  idWorkplace?: number
  idFormat: number
  idUser: number
  idComp: number
  idVersion: number
  initDateRf: Date
  finDateRf: Date
}
