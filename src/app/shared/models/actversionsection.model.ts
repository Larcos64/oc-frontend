export const TYPE_VERSION_SECTION = "act_version_section";

export class ActVersionSection {

  public constructor(init?: Partial<ActVersionSection>) {
    Object.assign(this, init);
  }

  idVerSec: number
  idVersion: number
  idSec: number
}
