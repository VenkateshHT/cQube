import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AuthGuard } from 'src/app/auth.guard';
import { DikshaBarChartComponent } from './diksha-bar-chart/diksha-bar-chart.component';
import { DikshaChartComponent } from './diksha-chart/diksha-chart.component';
import { DikshaTableComponent } from './diksha-table/diksha-table.component';
import { DikshaUsageByTextBookComponent } from './diksha-usage-by-text-book/diksha-usage-by-text-book.component';
import { UsageByTextbookContentComponent } from './usage-by-textbook-content/usage-by-textbook-content.component';
import { DikshaTPDContentProgressComponent } from './diksha-tpd-content-progress/diksha-tpd-content-progress.component';
import { DikshaTPDTeachersPercentageComponent } from './diksha-tpd-teachers-percentage/diksha-tpd-teachers-percentage.component';

const dikshaRoutes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      {
        path: 'usage-by-user-profile', component: DikshaChartComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'usage-by-course-content', component: DikshaTableComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'usage-by-course', component: DikshaBarChartComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'usage-by-textbook', component: DikshaUsageByTextBookComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'usage-by-textbook-content', component: UsageByTextbookContentComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'tpd-collection-progress', component: DikshaTPDContentProgressComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'tpd-teacher-percentage', component: DikshaTPDTeachersPercentageComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
]

@NgModule({
  declarations: [
    DikshaChartComponent,
    DikshaTableComponent,
    DikshaBarChartComponent,
    DikshaUsageByTextBookComponent,
    UsageByTextbookContentComponent,
    DikshaTPDContentProgressComponent,
    DikshaTPDTeachersPercentageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    RouterModule.forChild(dikshaRoutes)
  ]
})
export class DikshaModule { }