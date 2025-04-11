import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubcourseComponent } from './add-subcourse.component';

describe('AddSubcourseComponent', () => {
  let component: AddSubcourseComponent;
  let fixture: ComponentFixture<AddSubcourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubcourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
