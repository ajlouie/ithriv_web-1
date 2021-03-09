import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonsHomeComponent } from '../commons-home/commons-home.component';
import { CommonsComponent } from './commons.component';
import { ProjectCreateComponent } from './project-create/project-create.component';

const routes: Routes = [
  {
    path: '',
    component: CommonsComponent,
    children: [
      {
        path: 'project_create',
        component: ProjectCreateComponent
      },
      {
        path: '',
        component: CommonsHomeComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonsRoutingModule {}
