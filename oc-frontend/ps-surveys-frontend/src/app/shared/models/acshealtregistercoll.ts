

export class AcsHealtRegisterColl {

    public constructor(init?: Partial<AcsHealtRegisterColl>) {
        Object.assign(this, init);
    }

    idhf: number;
    idCol: number;
    idComp: number;
    identCollaborator: number;
    docType: number;
    nameCol: string;
    lastnameCol: string;
    area: string;
    position: string;
    temperature: number;
    stateHealth: string[];
    initDate: Date;
    finalDate: Date;

}