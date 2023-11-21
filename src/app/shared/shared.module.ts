import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatModule } from './mat.module';
import { LoaderComponent } from './components/loader/loader.component';
import { ConfirmDialogComponent } from './components/dialogconfirm/confirm-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        MatModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule
    ],
    declarations: [LoaderComponent, ConfirmDialogComponent],

    entryComponents: [ConfirmDialogComponent],

    exports: [RouterModule, MatModule, FlexLayoutModule, FormsModule, LoaderComponent]
})
export class SharedModule { }
