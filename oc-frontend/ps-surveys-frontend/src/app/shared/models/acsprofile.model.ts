export const TYPE_PROFILE = "acs_profile";

export class AcsProfile {

  public constructor(init?: Partial<AcsProfile>) {
    Object.assign(this, init);
  }

  idProf: number;
  nameProf: string;
}
