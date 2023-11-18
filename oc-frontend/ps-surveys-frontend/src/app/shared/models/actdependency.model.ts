export const TYPE_DEPENDENCY = "act_dependency";

export class ActDependency {

  public constructor(init?: Partial<ActDependency>) {
    Object.assign(this, init);
  }

  idDep: number;
  idQues: number;
  idSec: number;
  idQues2: number;
  operatorDep: string;
  valueDep: string;
  orDep: boolean;
}
