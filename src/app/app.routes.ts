import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';


export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard},
        ]
    },
    { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
