import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "app/user/user.model";

export class AddHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let user = JSON.parse(localStorage.getItem('currentUser')) || new User
    let token = localStorage.getItem('token') || ''
    let clonedRequest;

    if(req.url.indexOf('upload-file') === -1) {
      clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `${token}`)
        .set('User', `${user.id}`)
        .set('Content-Type', 'application/json')
      });
    } else {
      clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `${token}`)
        .set('User', `${user.id}`)
      });
    }

    return next.handle(clonedRequest)
  }
}
