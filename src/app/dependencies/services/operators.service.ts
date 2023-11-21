import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class OperatorsService {

  // { value: 'short_text', type: 'Respuesta Corta', icon: 'short_text' },
  //   { value: 'notes', type: 'Párrafo', icon: 'notes' },
  //   // { value: 'money', type: 'Número', icon: 'money' },
  //   { value: 'radio_button_checked', type: 'Varias opciones', icon: 'radio_button_checked' },
  //   { value: 'check_box', type: 'Casillas', icon: 'check_box' },
  //   { value: 'arrow_drop_down_circle', type: 'Desplegable', icon: 'arrow_drop_down_circle' },
  //   { value: 'cloud_upload', type: 'Subir Archivo', icon: 'cloud_upload' },
  //   { value: 'event', type: 'Fecha', icon: 'event' },
  //   { value: 'access_time', type: 'Hora', icon: 'access_time' }

  // operators = [
  //   { value: '<', type: 'Menor que' },
  //   { value: '>', type: 'Mayor que' },
  //   { value: '==', type: 'Igual a' },
  //   { value: '!=', type: 'Diferente de' },
  //   { value: '<=', type: 'Menor o igual que' },
  //   { value: '>=', type: 'Mayor o igual que' },
  // ];

  private operators: any[] = [
    // {
    //   ques_type: 'short_text',
    //   op_types: [
    //     { value: '==', type: 'Igual a' },
    //     { value: '!=', type: 'Diferente de ' }
    //   ]
    // },
    // {
    //   ques_type: 'notes',
    //   op_types: [
    //     { value: '==', type: 'Igual a' },
    //     { value: '!=', type: 'Diferente de ' }
    //   ]
    // },
    {
      ques_type: 'money',
      op_types: [
        { value: '<', type: 'Menor que' },
        { value: '>', type: 'Mayor que' },
        { value: '==', type: 'Igual a' },
        { value: '!=', type: 'Diferente de' },
        { value: '<=', type: 'Menor o igual que' },
        { value: '>=', type: 'Mayor o igual que' },
      ]
    },
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
  ques_type: string;
  op_types: Array<any>;
}
