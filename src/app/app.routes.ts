import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TeamComponent } from './pages/team/team.component';
import { PredictPageComponent } from './pages/predict-page/predict-page.component';
import { WeekPageComponent } from './pages/week-page/week-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'mills/home', pathMatch: 'full' },
    { path: ':household', component: HomeComponent },
    { path: ':household/home', component: HomeComponent },
    { path: ':household/team', component: TeamComponent },
    { path: ':household/team/:teamName', component: TeamComponent },
    { path: ':household/team/*', redirectTo: 'team' },
    { path: ':household/predict', component: PredictPageComponent },
    { path: ':household/predict/:teamName', component: PredictPageComponent },
    { path: ':household/predict/*', redirectTo: 'predict' },
    { path: ':household/week', component: WeekPageComponent },
    { path: ':household/week/:week', component: WeekPageComponent },
    { path: ':household/week/:week', redirectTo: 'week' },
];
