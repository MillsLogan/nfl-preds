import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TeamComponent } from './pages/team/team.component';
import { PredictPageComponent } from './pages/predict-page/predict-page.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'team', component: TeamComponent },
    { path: 'team/:teamName', component: TeamComponent },
    { path: 'team/*', redirectTo: 'team' },
    { path: 'predict', component: PredictPageComponent },
    { path: 'predict/:teamName', component: PredictPageComponent },
    { path: 'predict/*', redirectTo: 'predict' },
    { path: '**', redirectTo: '' }
];
