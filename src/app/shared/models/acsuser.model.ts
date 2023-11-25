export const TYPE_USER = "acs_user";

export class AcsUser {

  public constructor(init?: Partial<AcsUser>) {
    Object.assign(this, init);
  }

  idUser: number;
  idProf: number;
  idComp: number;
  identUser: string;
  nameUser: string;
  lastnameUser: string;
  emailUser: string;
  passUser?: string;
  genderUser: string;
  dateBirthUser: Date;
  entailmentDateUser: Date;
}
