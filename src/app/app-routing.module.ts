import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ChangesOverviewComponent} from './overview/changes/changes-overview.component';
import {DiffsComponent} from './overview/diffs/diffs.component';
import {ElementsOverviewComponent} from './overview/elements/elements-overview.component';
import {KmeansComponent} from './ml/kmeans/kmeans.component';
import {LdaComponent} from './ml/lda/lda.component';
import {Word2vecComponent} from './ml/word2vec/word2vec.component';
import {EvaluationComponent} from './ml/evaluation/evaluation.component';


const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {
        path: 'changes',
        component: ChangesOverviewComponent,
    },
    {
        path: 'diffs',
        component: DiffsComponent,
    },
    {
        path: 'diffs/:id',
        component: DiffsComponent,
    },
    {
        path: 'elements',
        component: ElementsOverviewComponent,
    },
    {
        path: 'kmeans',
        component: KmeansComponent,
    },
    {
        path: 'lda',
        component: LdaComponent,
    },
    {
        path: 'word2vec',
        component: Word2vecComponent,
    },
    {
        path: 'evaluate',
        component: EvaluationComponent,
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

