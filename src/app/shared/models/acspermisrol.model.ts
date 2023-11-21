export const TYPE_PERMIS_ROL = "acs_permis_rol";

export class AcsPermisRol {

  public constructor(init?: Partial<AcsPermisRol>) {
    Object.assign(this, init);
  }

  idProf: number;
  idPermis: number;
  idPermisRol: number;
}
