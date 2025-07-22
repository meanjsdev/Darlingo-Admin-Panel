import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'edit/:id', component: EditUserComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    UsersComponent,
    EditUserComponent
  ],
})
export class UsersModule {}
