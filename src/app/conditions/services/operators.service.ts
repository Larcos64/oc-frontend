import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class OperatorsService {

  // operators = [
  //   { value: '<', type: 'Menor que' },
  //   { value: '>', type: 'Mayor que' },
  //   { value: '==', type: 'Igual a' },
  //   { value: '!=', type: 'Diferente de' },
  //   { value: '<=', type: 'Menor o igual que' },
  //   { value: '>=', type: 'Mayor o igual que' },
  // ];

  private operators: any[] = [
    {
      cond_type: 'type',
      op_types: [
        // { value: 'number', type: 'Número o decimal' },
        { value: 'email', type: 'Correo electrónico' }
      ]
    },
    {
      cond_type: 'lenght',
      op_types: [
        { value: '<', type: 'Menor a' },
        { value: '>', type: 'Mayor a' },
        { value: '[]', type: 'Entre' },
      ]
    },
    {
      cond_type: 'file_type',
      op_types: [
        { value: '.png, .jpg, .jpeg', type: 'Imágenes (.png, .jpg, .jpeg)' },
        // { value: 'files', type: 'Archivos' }
      ]
    },
    {
      cond_type: 'file_format',
      op_types: [
        { value: '.pdf', type: 'Archivo PDF (.pdf)' }, // OK
        { value: '.xls, .xlsx, .csv, .vnd.openxmlformats-officedocument.spreadsheetml.sheet, .vnd.ms-excel', type: 'Hoja de cálculo de Microsoft Excel (.xls, .xlsx, .csv)' }, // OK
        // { value: 'odt', type: 'Texto OpenDocument (.odt)' },
        { value: '.doc, .docx, .odt, .vnd.openxmlformats-officedocument.wordprocessingml.document', type: 'Documento de Microsoft Word (.doc, .docx, .odt)' }, // OK
        { value: '.jpeg', type: 'Archivo JPEG (.jpeg)' }, // OK
        { value: '.png', type: 'Archivo PNG (.png)' } // OK
      ]
    },
    {
      cond_type: 'file_limit',
      op_types: [
        { value: '1', type: '1' },
        { value: '2', type: '2' },
        { value: '3', type: '3' },
        { value: '4', type: '4' },
        { value: '5', type: '5' },
        { value: '6', type: '6' },
        { value: '7', type: '7' },
        { value: '8', type: '8' },
        { value: '9', type: '9' },
        { value: '10', type: '10' },
        { value: '11', type: '11' },
        { value: '12', type: '12' },
        { value: '13', type: '13' },
        { value: '14', type: '14' },
        { value: '15', type: '15' },
        { value: '16', type: '16' },
        { value: '17', type: '17' },
        { value: '18', type: '18' },
        { value: '19', type: '19' },
        { value: '20', type: '20' }
      ]
    },
    {
      cond_type: 'warning',
      op_types: [
        { value: '<', type: 'Menor a' },
        { value: '>', type: 'Mayor a' }
      ]
    }
  ];

  constructor() { }

  getOperators(): Operator[] {
    return this.operators;
  }

  getOpTypes(idx: number) {
    return this.operators[idx].op_types;
  }
}

export interface Operator {
  cond_type: string;
  op_types: Array<any>;
}
