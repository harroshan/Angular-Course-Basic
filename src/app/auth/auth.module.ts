import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{ path: '', component: AuthComponent}]

@NgModule({
    declarations: [AuthComponent],
    imports: [RouterModule.forChild(routes), CommonModule, FormsModule, SharedModule]
})
export class AuthModule{

}