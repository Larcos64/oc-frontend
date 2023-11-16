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
  ciiuComp: string;
  addressComp: string;
  phoneComp: string;
  numEmployee: number;
  riskLvlComp: number;
  logoComp: string;
  
  mainEconomicActivity: string;
  secEconomicActivity: string;
  numEmployeeDep: number;
  numEmployeeIndep: number;
  numEmployeeCont: number;

}
