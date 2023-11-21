import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { VocabularyService } from '../services/vocabulary.service';

// types = [../services/vocabulary
//   { value: 'short_text', type: 'Respuesta Corta', icon: 'short_text' },
//   { value: 'notes', type: 'Párrafo', icon: 'notes' },
//   { value: 'radio_button_checked', type: 'Varias opciones', icon: 'radio_button_checked' },
//   { value: 'check_box', type: 'Casillas', icon: 'check_box' },
//   { value: 'arrow_drop_down_circle', type: 'Desplegable', icon: 'arrow_drop_down_circle' },
//   { value: 'cloud_upload', type: 'Subir Archivo', icon: 'cloud_upload' },
//   { value: 'event', type: 'Fecha', icon: 'event' },
//   { value: 'access_time', type: 'Hora', icon: 'access_time' }
// ];

@Pipe({
  name: "transtring",
  pure: false
})
export class TranstringPipe implements PipeTransform {
  constructor(private vocabularyService: VocabularyService) { }
  transform(text: string): Observable<string> {
    return this.vocabularyService.getTranslation(text);
  }
}
