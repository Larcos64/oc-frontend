export const TYPE_OPT_BIO = "acs_opt_bio";

export class AcsOptBio {

    public constructor(init?: Partial<AcsOptBio>) {
        Object.assign(this, init);
    }

    idOpt?: number;
    name: string;

}