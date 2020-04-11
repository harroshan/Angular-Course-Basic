import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { PlaceHolderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loadinng-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceHolderDirective,
        DropdownDirective
    ],
    imports: [CommonModule],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceHolderDirective,
        DropdownDirective,
        CommonModule
    ],
    entryComponents: [
    AlertComponent
    ]
})
export class SharedModule{}