export const TYPE_HEALTH = "acs_health_format";

export class AcsHealthForm {

  public constructor(init?: Partial<AcsHealthForm>) {
    Object.assign(this, init);
  }

  idhf: number;
  identCollaborator: number;
  idComp: number;
  temperature: number;
  stateHealth: string[];
  initDate: Date;
  finalDate: Date;

}
