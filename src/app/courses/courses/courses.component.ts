import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CoursesService } from './core/service/courses.service';
import { Course } from './core/interfaces/courses';
import { DatePipe } from '@angular/common';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddCourseComponent } from '../add-course/add-course.component';
import { AddSubcourseComponent } from '../add-subcourse/add-subcourse.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DatePipe,
    DynamicDialogModule
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
  providers: [DialogService]
})
export class CoursesComponent implements OnInit {
  constructor(private _courseService:CoursesService , private dialogService: DialogService){

  }
  courses:Course[] = []
  expandedRows: any = {};
  
  activeSubcourseIndex!:number
  ref: DynamicDialogRef | undefined;
  getCourses(){
    this._courseService.getCoursesSubject.subscribe({
      next:(res)=>{
        this.courses = res
      }
    })
  }

  openDialog() {
    this.ref = this.dialogService.open(AddCourseComponent, {
      showHeader:false , 
      width: '50%',
      height:"80%",
      
    });
  }

 

  openUpdateCourseDialog(id:number){
    this.ref = this.dialogService.open(AddCourseComponent, {
      showHeader:false , 
      width: '50%',
      height:"80%",
      data:{
        courseId:id
      }
    });
  }

  openAddSubcourseDialog(courseId:number){
    this.ref = this.dialogService.open(AddSubcourseComponent, {
      showHeader:false , 
      width: '50%',
      height:"80%",
      data:{
        courseId:courseId
      }
    });
  }
  onRowExpand(event: any) {
    this.expandedRows[event.data.id] = true;
  }

  onRowCollapse(event: any) {
    delete this.expandedRows[event.data.id];
  }

 

  expandAll() {
    this.expandedRows = {};  // Clear any previously expanded rows
    this.courses.forEach(product => {
      this.expandedRows[product.id] = true;  // Mark each product as expanded
    });
  }

 

  openUpdateSubcourse(courseId:number , subcourseId:number){
    this.ref = this.dialogService.open(AddSubcourseComponent, {
      showHeader:false , 
      width: '50%',
      height:"80%",
      data:{
        courseId:courseId,
        subcourseId:subcourseId
      }
    });
    console.log( courseId,subcourseId )
  }
 
  
  collapseAll() {
    this.expandedRows = {};  // Clear all expanded rows to collapse them
  }
  ngOnInit(): void {
    this.getCourses()
  }

}
