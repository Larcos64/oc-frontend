export const TYPE_COLLABORATOR = "acs_collaborator";

export class AcsCollaborator {

    public constructor(init?: Partial<AcsCollaborator>) {
        Object.assign(this, init);
    }
    idCol:number;
    idComp: number;
    identCol: number;
    docType: number;
    nameCol: string;
    lastnameCol: string;
    birthdayCol: Date;
    area:string;
    position:string;
    rhCol: string;
    genderCol: string;
    specialCond: string;
    otherCol: string;
    eps: string;
    afp: string;
    arl: string;
    severance_pay: string;
    compensation_box: string;
    // socialSecCol: string;
}