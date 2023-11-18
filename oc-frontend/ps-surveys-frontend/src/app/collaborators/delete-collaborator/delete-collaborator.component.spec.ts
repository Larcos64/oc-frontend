import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCollaboratorComponent } from './delete-collaborator.component';

describe('DeleteCollaboratorComponent', () => {
  let component: DeleteCollaboratorComponent;
  let fixture: ComponentFixture<DeleteCollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCollaboratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
