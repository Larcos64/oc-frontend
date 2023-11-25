import { Component, OnInit, Input } from '@angular/core';
import { FieldConfig } from '../../field.interface';
import { FormGroup } from '@angular/forms';
import { AcsCollaborator } from 'src/app/shared/models/acscollaborator.model';
import { CollaboratorserviceService } from 'src/app/collaborators/services/collaboratorservice.service';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-colaborator',
  templateUrl: './colaborator.component.html'
})
export class ColaboratorComponent implements OnInit {


  @Input() field: FieldConfig;
  @Input() form: FormGroup;

  collaborators: AcsCollaborator[] = [];
  collaboratorSelected: any;
  idComp: number;
  multiple = true;

  constructor(private collService: CollaboratorserviceService) {

    this.idComp = Number(JSON.parse(localStorage.getItem('idComp')));
    this.getCollaborators()
  }

  ngOnInit() {
    if (this.field.itemValue) {
      console.log(this.field.itemValue, "item value")
      this.multiple = false;
    }
  }

  getCollaborators() {
    this.collService.getCollaboratorsByIdComp(this.idComp).subscribe(colls => this.collaborators = colls);
  }

  selectChange($event: MatSelectChange) {

    var response = this.form.value[this.field.name]
    this.field.value = response.idCol
    this.collaboratorSelected = response
    // this.form.value[this.field.name] = response.idCol
  }

}
