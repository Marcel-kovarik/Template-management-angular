import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { catchError, filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.userService.userValues;
    if (user && user.token && user.currentOrganisation) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
          'X-TALKI-ORGANISATION': `${user.currentOrganisation}`,
          'X-TALKI-LANG': 'en'
        }
      });
    }

    return next.handle(req).pipe(
      catchError((err => {
        if (err.status === 401) {
          this.userService.logout();
          this.router.navigate(['login']);
        }
        return err;
      })),
      filter(event => event instanceof HttpResponse),
      tap((response: HttpResponse<any>) => {
        const newToken = response.headers.get('Authorization');
        if (newToken) {
          this.userService.updateUserToken(newToken);
        }
      })
    );
  }
}
