export const TYPE_SECTION = "act_section";

export class ActSection {

  public constructor(init?: Partial<ActSection>) {
    Object.assign(this, init);
  }

  idSection: number;
  nameSection: string;
  descSection: string;
  typeSection: string;
  tableName: string;
  cycle:string;
}
