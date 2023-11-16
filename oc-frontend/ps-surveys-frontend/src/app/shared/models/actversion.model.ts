export const TYPE_VERSION = "act_version";

export class ActVersion {

  public constructor(init?: Partial<ActVersion>) {
    Object.assign(this, init);
  }

  idVersion: number
  idFormat: number
  dateCreated: Date
  codVersion: string
  stateVersion: boolean
  version: string
}
