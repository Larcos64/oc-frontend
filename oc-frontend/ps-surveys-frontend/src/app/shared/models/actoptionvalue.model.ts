export const TYPE_OPTION_VALUE = "act_opt_value";

export class ActOptionValue {

  public constructor(init?: Partial<ActOptionValue>) {
    Object.assign(this, init);
  }

  idOptValue: number;
  idOpt: number;
  nameOptValue: string;
  codOptValue: string;
  stateOptValue: boolean;
}
