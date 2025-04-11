import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CoursesService } from '../courses/core/service/courses.service';
import { Course } from '../courses/core/interfaces/courses';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';


export function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return { dateRangeInvalid: true };
  }
  return null;
}

@Component({
  selector: 'app-add-course',
  imports: [
    DatePickerModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss'
})
export class AddCourseComponent implements OnInit {

  constructor(private fb:FormBuilder , private _courseService:CoursesService , public ref: DynamicDialogRef , public config: DynamicDialogConfig){

  }
  courseId!:number
  close(){
    this.ref.close()
  }
  courseForm!:FormGroup
  courseToUpdate!:Course
    ngOnInit(): void {
      this.courseForm = this.fb.group({
        name:['' , Validators.required],
        startDate:['' , Validators.required],
        endDate:['' , Validators.required]
      },
      { validators: dateRangeValidator }
    )
      this.courseId = this.config.data.courseId
      if(this.courseId){
        this.getCourse()
      }
    }   

    getCourse(){
      const courseToUpdate =  this._courseService.COURSES.filter((course)=>{
        return course.id == this.courseId
      })
      this.courseToUpdate = courseToUpdate[0]
      this.setCourseToForm()
    }

    setCourseToForm(){
      this.courseForm.patchValue({
        name:this.courseToUpdate.name,
        startDate:this.courseToUpdate.startDate,
        endDate:this.courseToUpdate.endDate
      })
    }
    onStartDateSelected(event:any){
     
      this.courseForm.get("startDate")?.setValue(event)
    }
    onEndDateSelected(event:any){
      this.courseForm.get("endDate")?.setValue(event)

    }
    updateCourse(){
      const course:Course = {
        name:this.courseForm.get("name")?.value,
        startDate:this.courseForm.get("startDate")?.value,
        endDate:this.courseForm.get("endDate")?.value,
        id:this.courseToUpdate.id,
        subcourses:this.courseToUpdate.subcourses
      }
      this._courseService.updateCourse(course)
      this.ref.close()
    }
    addCourse(){
      this.courseForm.markAllAsTouched()
      if(this.courseForm.valid){
        const course:Course = {
          name:this.courseForm.get("name")?.value,
          startDate:this.courseForm.get("startDate")?.value,
          endDate:this.courseForm.get("endDate")?.value,
          id:this._courseService.COURSES.length + 1,
          subcourses:[]
        }
        
        this._courseService.addCourse(course)
        this.ref.close()
      }
    }
}
