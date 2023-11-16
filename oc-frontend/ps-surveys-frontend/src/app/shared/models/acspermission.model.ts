export const TYPE_PERMISSION = "acs_permission";

export class AcsPermission {

  public constructor(init?: Partial<AcsPermission>) {
    Object.assign(this, init);
  }

  idPermis: number;
  namePermis: string;
  desPermis: string;
}
