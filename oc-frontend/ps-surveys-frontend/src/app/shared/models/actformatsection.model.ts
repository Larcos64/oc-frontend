export const TYPE_FORMAT_SECTION = "act_format_section";

export class ActFormatSection {

  public constructor(init?: Partial<ActFormatSection>) {
    Object.assign(this, init);
  }

  idSec: number;
  idFormat: number;
  idFs: number;
  stateFs: boolean;
  orderFs: number;
}
