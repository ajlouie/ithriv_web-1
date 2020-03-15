import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonsComponent } from './commons.component';
import { HomeComponent } from './home/home.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectComponent } from './project/project.component';

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
        component: HomeComponent,
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
