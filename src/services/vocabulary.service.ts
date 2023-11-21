import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { VOCABULARY } from './vocabulary';

@Injectable()
export class VocabularyService {
  private currentAmbit: string;
  constructor() { }
  getCurrentAmbit(): string {
    if (!this.currentAmbit) {
      this.currentAmbit = 'front';
    }
    return this.currentAmbit;
  }
  setCurrentAmbit(lang: string) {
    this.currentAmbit = lang;
  }
  getTranslation(text: string): Observable<string> {
    this.setCurrentAmbit('front');
    this.getCurrentAmbit();
    return VOCABULARY[this.currentAmbit][text];
  }
}
