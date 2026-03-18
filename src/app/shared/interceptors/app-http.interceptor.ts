import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const token = localStorage.getItem('token');

  const request = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  loadingService.show();

  return next(request).pipe(finalize(() => loadingService.hide()));
};
