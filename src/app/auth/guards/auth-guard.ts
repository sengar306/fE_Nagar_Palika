import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router); // ✅ Router inject
  const token = localStorage.getItem('token');

  if (token) {
    return true; // ✅ allow
  } else {
    router.navigate(['/login']); // ✅ redirect
    return false;
  }
};

