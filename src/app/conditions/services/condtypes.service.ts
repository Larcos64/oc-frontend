import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CondtypesService {
  private conditions: any[] = [
    {
      ques_type: 'short_text',
      cond_types: [
        { value: 'type', cond: 'Tipo de texto' },
        { value: 'lenght', cond: 'Longitud de texto' }
        // { value: 'pattern', cond: 'Límites de ingreso' }
      ]
    },
    {
      ques_type: 'notes',
      cond_types: [
        { value: 'lenght', cond: 'Longitud de texto' }
        // { value: 'pattern', cond: 'Límites de ingreso' }
      ]
    },
    {
      ques_type: 'money',
      cond_types: [
        { value: 'min', cond: 'Valor mínimo' },
        { value: 'max', cond: 'Valor máximo' },
        { value: 'warning', cond: 'Advertencia' }
      ]
    },
    {
      ques_type: 'event',
      cond_types: [
        { value: 'mindate', cond: 'Fecha mínima' },
        { value: 'maxdate', cond: 'Fecha máxima' }
        // { value: 'filter', cond: 'Restringir días' }
      ]
    },
    {
      ques_type: 'cloud_upload',
      cond_types: [
        { value: 'file_type', cond: 'Tipo de archivo' },
        { value: 'file_format', cond: 'Formato específico' },
        { value: 'file_limit', cond: 'Límite de archivos' }
      ]
    }
  ];

  constructor() { }

  getConditions(): Condition[] {
    return this.conditions;
  }

  getCondTypes(idx: number) {
    return this.conditions[idx].cond_types;
  }

  // buscarHeroes(termino: string): Heroe[] {
  //   let heroesArr: Heroe[] = [];
  //   termino = termino.toLowerCase();
  //   // for (let heroe of this.heroes) {
  //   for (let i = 0; i < this.heroes.length; i++) {
  //     let heroe = this.heroes[i];
  //     let nombre = heroe.nombre.toLowerCase();
  //     if (nombre.indexOf(termino) >= 0) {
  //       heroe.idx = i;
  //       heroesArr.push(heroe);
  //     }
  //   }
  //   return heroesArr;
  // }
}

export interface Condition {
  ques_type: string;
  cond_types: Array<any>;
}
