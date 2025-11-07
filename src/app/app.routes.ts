import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  // Brand-specific routes
  {
    path: 'a',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'test-callbacks',
        loadComponent: () => import('./test-callbacks.component').then(m => m.TestCallbacksComponent)
      },
      {
        path: 'documentation',
        loadComponent: () => import('./pages/documentation/documentation').then(m => m.DocumentationComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'b',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'test-callbacks',
        loadComponent: () => import('./test-callbacks.component').then(m => m.TestCallbacksComponent)
      },
      {
        path: 'documentation',
        loadComponent: () => import('./pages/documentation/documentation').then(m => m.DocumentationComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'c',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'test-callbacks',
        loadComponent: () => import('./test-callbacks.component').then(m => m.TestCallbacksComponent)
      },
      {
        path: 'documentation',
        loadComponent: () => import('./pages/documentation/documentation').then(m => m.DocumentationComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'minimal',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'test-callbacks',
        loadComponent: () => import('./test-callbacks.component').then(m => m.TestCallbacksComponent)
      }
    ]
  },
  {
    path: 'mobile',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'test-callbacks',
        loadComponent: () => import('./test-callbacks.component').then(m => m.TestCallbacksComponent)
      }
    ]
  },
  // Default routes (without branding)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'callback',
    loadComponent: () => import('./pages/callback/callback.component').then(m => m.CallbackComponent)
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
    canActivate: [authGuard]
  },
  {
    path: 'logout',
    loadComponent: () => import('./pages/logout/logout.component').then(m => m.LogoutComponent)
  },
  {
    path: 'documentation',
    loadComponent: () => import('./pages/documentation/documentation').then(m => m.DocumentationComponent)
  },
  {
    path: 'test-callbacks',
    loadComponent: () => import('./test-callbacks.component').then(m => m.TestCallbacksComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
