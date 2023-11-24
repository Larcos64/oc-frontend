import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestypesService {
  private types: any[] = [
    { value: 'short_text', type: 'Respuesta corta', icon: 'short_text' },
    { value: 'notes', type: 'Párrafo', icon: 'notes' },
    { value: 'money', type: 'Número o decimal', icon: 'money' },
    { value: 'radio_button_checked', type: 'Varias opciones', icon: 'radio_button_checked' },
    { value: 'check_box', type: 'Casillas', icon: 'check_box' },
    { value: 'arrow_drop_down_circle', type: 'Desplegable', icon: 'arrow_drop_down_circle' },
    { value: 'cloud_upload', type: 'Subir archivo', icon: 'cloud_upload' },
    { value: 'event', type: 'Fecha', icon: 'event' },
    { value: 'collaborator', type: 'Colaborador', icon: 'group' }
  ];

  constructor() { }

  getTypes(): Type[] {
    return this.types;
  }

  getType(idx: number) {
    return this.types[idx];
  }
}

export interface Type {
  value: string;
  type: string;
  icon: string;
}
