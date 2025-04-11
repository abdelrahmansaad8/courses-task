import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CoursesService } from '../courses/core/service/courses.service';
import { Course, Subcourse } from '../courses/core/interfaces/courses';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
export function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return { dateRangeInvalid: true };
  }
  return null;
}

export function subcourseDateValidator(parentStartDate: Date, parentEndDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const subStartDate = control.get('startDate')?.value;
    const subEndDate = control.get('endDate')?.value;

    if (!subStartDate || !subEndDate) {
      return null;
    }

    const subStart = new Date(subStartDate);
    const subEnd = new Date(subEndDate);

    if (
      subStart < parentStartDate ||
      subEnd > parentEndDate ||
      subStart > subEnd
    ) {
      return { subcourseDateInvalid: true };
    }

    return null;
  };
}


function checkSubcourseOverlap(newStartDate: Date, newEndDate: Date, existingSubcourses: { id: number, startDate: Date | string, endDate: Date | string }[], currentSubcourseId: number | null): boolean {
  for (let i = 0; i < existingSubcourses.length; i++) {
    const existing = existingSubcourses[i];
    
    // Skip the subcourse being updated (if currentSubcourseId is provided)
    if (existing.id === currentSubcourseId) {
      continue;
    }

    const existingStartDate = new Date(existing.startDate);
    const existingEndDate = new Date(existing.endDate);

    // Check for overlap
    if ((newStartDate <= existingEndDate && newStartDate >= existingStartDate) ||
        (newEndDate <= existingEndDate && newEndDate >= existingStartDate) ||
        (newStartDate <= existingStartDate && newEndDate >= existingEndDate)) {
      return true; // Overlap found
    }
  }
  return false; // No overlap
}

// Custom validator for checking subcourse overlap
export function subcourseOverlapValidator(existingSubcourses: { id: number, startDate: Date | string, endDate: Date | string }[], currentSubcourseId: number | null = null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    // Ensure valid dates
    if (!startDate || !endDate) {
      return null; // No validation needed if dates are not provided
    }

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    // Check if the new subcourse overlaps with any of the existing subcourses, skipping the current one if editing
    if (checkSubcourseOverlap(newStartDate, newEndDate, existingSubcourses, currentSubcourseId)) {
      return { subcourseOverlap: true }; // Overlap found
    }

    return null; // No overlap
  };
}



@Component({
  selector: 'app-add-subcourse',
  imports: [
    DatePickerModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-subcourse.component.html',
  styleUrl: './add-subcourse.component.scss'
})
export class AddSubcourseComponent {
  constructor(private fb: FormBuilder, private _courseService: CoursesService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {

  }
  courseId!: number
  SubCourseId!: number
  close() {
    this.ref.close()
  }
  courseForm!: FormGroup
  subCourseToUpdate!: Subcourse
  parentCourse!: Course
  ngOnInit(): void {
    this.courseId = this.config.data.courseId

    let course = this._courseService.COURSES.filter((course) => {
      return course.id == this.courseId
    })  
    this.SubCourseId = this.config.data.subcourseId

   
    this.parentCourse = course[0]
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

    },
      {
        validators: [dateRangeValidator,
          subcourseDateValidator(new Date(this.parentCourse.startDate),
            new Date(this.parentCourse.endDate)),
            subcourseOverlapValidator(this.parentCourse.subcourses , this.SubCourseId )
         ]
      }
    )
    if (this.SubCourseId) {
      this.getSubcourse()
    }


  }

  getSubcourse() {

    const Subcourse = this.parentCourse.subcourses.filter((subcourse) => {
      return subcourse.id == this.SubCourseId
    })

    this.subCourseToUpdate = Subcourse[0]
    console.log(this.subCourseToUpdate)
    this.setCourseToForm()
  }

  setCourseToForm() {
    this.courseForm.patchValue({
      name: this.subCourseToUpdate.name,
      startDate: this.subCourseToUpdate.startDate,
      endDate: this.subCourseToUpdate.endDate
    })
  }
  onStartDateSelected(event: any) {

    this.courseForm.get("startDate")?.setValue(event)
  }
  onEndDateSelected(event: any) {
    this.courseForm.get("endDate")?.setValue(event)

  }
  updateSubcourse() {
    const subcourse: Subcourse = {
      name: this.courseForm.get("name")?.value,
      startDate: this.courseForm.get("startDate")?.value,
      endDate: this.courseForm.get("endDate")?.value,
      id: this.subCourseToUpdate.id,
      CourseId: this.courseId
    }
    this._courseService.updateSubcourse(subcourse)
    this.ref.close()
  }
  addSubCourse() {
    this.courseForm.markAllAsTouched()
    if (this.courseForm.valid) {
      const courseOfSubcourse = this._courseService.COURSES.filter((item) => {
        return item.id == this.courseId
      })
      const course: any = {
        name: this.courseForm.get("name")?.value,
        startDate: this.courseForm.get("startDate")?.value,
        endDate: this.courseForm.get("endDate")?.value,
        id: courseOfSubcourse[0].subcourses[courseOfSubcourse[0].subcourses.length - 1].id + 1,

      }
      console.log(course)
      this._courseService.addSubCourse(course, this.courseId)
      this.ref.close()
    }
  }

}
