import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class LoggerService {

  constructor() { }

  error(text: string) {
    if( !isDevMode() ) return;
    console.error(text)
  }
}
