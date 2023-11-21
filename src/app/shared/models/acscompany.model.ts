export const TYPE_COMPANY = "acs_company";

export class AcsCompany {

  public constructor(init?: Partial<AcsCompany>) {
    Object.assign(this, init);
  }

  idComp: number;
  nameComp: string;
  nitComp: string;
  nameLegalRep: string;
  identLegalRep: string;
  emailComp: string;
  addressComp: string;
  phoneComp: string;
  numEmployee: number;
  logoComp: string;
}
