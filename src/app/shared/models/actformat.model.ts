export const TYPE_FORMAT = "act_format";

export class ActFormat {

  public constructor(init?: Partial<ActFormat>) {
    Object.assign(this, init);
  }

  idFormat: number;
  idUser: number;
  nameFormat: string;
  descFormat: string;
  typeFormat: string;
  codFormat: string;
  issueDate: Date;
  expiryDate: Date;
}
