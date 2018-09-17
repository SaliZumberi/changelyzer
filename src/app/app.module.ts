import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ServiceWorkerModule} from '@angular/service-worker';
import {HttpModule} from '@angular/http';
import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {DiffComponent} from './common/view/diff/diff.component';
import {HeaderComponent} from './scaffold/header/header.component';
import {SidebarFilterComponent} from './scaffold/sidebar-filter/sidebar-filter.component';
import {ChangesOverviewComponent} from './overview/changes/changes-overview.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ElementsOverviewComponent} from './overview/elements/elements-overview.component';
import {KmeansComponent} from './ml/kmeans/kmeans.component';
import {DiffsComponent} from './overview/diffs/diffs.component';
import {CardItemComponent} from './common/view/card-item/card-item.component';
import {ChangeElementComponent} from './common/view/change-element/change-element.component';
import {ChangeElementListComponent} from './common/view/change-element-list/change-element-list.component';
import {ElementComponent} from './common/view/element/element.component';
import {CardGroupComponent} from './common/view/card-group/card-group.component';
import {LdaComponent} from './ml/lda/lda.component';
import {EvaluationComponent} from './ml/evaluation/evaluation.component';
import {Word2vecComponent} from './ml/word2vec/word2vec.component';
import {PagerComponent} from './common/view/pager/pager.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {HighlightModule} from 'ngx-highlightjs';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        DiffComponent,
        HeaderComponent,
        SidebarFilterComponent,
        ChangesOverviewComponent,
        DashboardComponent,
        ElementsOverviewComponent,
        KmeansComponent,
        DiffsComponent,
        CardItemComponent,
        ChangeElementComponent,
        ChangeElementListComponent,
        ElementComponent,
        CardGroupComponent,
        LdaComponent,
        EvaluationComponent,
        Word2vecComponent,
        PagerComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'my-app'}),
        HttpClientModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        HighlightModule.forRoot(),
        NgxSpinnerModule,
        ServiceWorkerModule.register('/../ngsw-worker.js', {enabled: environment.production})
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
