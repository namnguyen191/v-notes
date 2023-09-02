import { Route } from '@angular/router';
import { authPaths } from '@v-notes/frontend/shared';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const frontendAuthRoutes: Route[] = [
  {
    path: authPaths.login,
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: authPaths.register,
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: '**',
    redirectTo: authPaths.login,
    pathMatch: 'full',
  },
];
