export const TYPE_OPTION = "act_option";

export class ActOption {

  public constructor(init?: Partial<ActOption>) {
    Object.assign(this, init);
  }

  idOption: number;
  nameOption: string;
  descOption: string;
  codOption: string;
}
