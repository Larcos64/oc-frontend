import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatToolbarModule,
  MatSidenavModule, MatProgressSpinnerModule, MatTabsModule, MatSnackBarModule, MatTableModule,
  MatListModule, MatDialogModule, MatIconModule, MatMenuModule, MatRadioModule,
  MatDatepickerModule, MatCheckboxModule, MatGridListModule, MatProgressBarModule, MatPaginatorModule,
  MatSortModule, MatSlideToggleModule, MatTooltipModule, MatNativeDateModule,
  MatOptionModule, MatChipsModule, MatExpansionModule
} from '@angular/material';

import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  imports: [
    CommonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatToolbarModule,
    MatSidenavModule, MatProgressSpinnerModule, MatTabsModule, MatSnackBarModule, MatTableModule,
    MatDialogModule, MatListModule, MatIconModule, MatMenuModule, MatRadioModule, MatSelectModule,
    MatDatepickerModule, MatCheckboxModule, MatGridListModule, MatProgressBarModule, MatPaginatorModule,
    MatSortModule, MatSlideToggleModule, MatTooltipModule, MatNativeDateModule, MatStepperModule,
    MatOptionModule, MatChipsModule

  ],
  declarations: [],
  exports: [MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatToolbarModule,
    MatSidenavModule, MatProgressSpinnerModule, MatTabsModule, MatSnackBarModule, MatTableModule,
    MatDialogModule, MatListModule, MatIconModule, MatMenuModule, MatRadioModule, MatSelectModule,
    MatDatepickerModule, MatCheckboxModule, MatGridListModule, MatProgressBarModule, MatPaginatorModule,
    MatSortModule, MatSlideToggleModule, MatTooltipModule, MatNativeDateModule, MatStepperModule,
    MatOptionModule, MatChipsModule, MatExpansionModule
  ]
})
export class MatModule { }
