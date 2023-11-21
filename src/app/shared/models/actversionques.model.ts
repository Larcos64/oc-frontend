export const TYPE_VERSION_QUES = "act_version_ques";

export class ActVersionQues {

  public constructor(init?: Partial<ActVersionQues>) {
    Object.assign(this, init);
  }

  idVerQues: number
  idVersion: number
  idQues: number
}
