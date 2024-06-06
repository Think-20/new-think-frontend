import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable()
export class MessageLoadingService {
  counter: Subject<number> = new Subject();
}
