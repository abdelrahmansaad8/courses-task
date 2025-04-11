import { Injectable } from '@angular/core';
import { Course, Subcourse } from '../interfaces/courses';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor() { }
  addCourse(course:Course){
    this.getCoursesSubject.next([...this.COURSES , course] )
    this.COURSES.push(course)
  }

  addSubCourse(subcourse:Subcourse , courseId:number ){
    this.COURSES = this.COURSES.map((course)=>{
        if(course.id == courseId){
          course.subcourses.push(subcourse)
          return course
        }else{
          return course
        }

        

    })

    this.getCoursesSubject.next(this.COURSES)
  }

  updateSubcourse(subcourse:Subcourse){
    this.COURSES = this.COURSES.map((course) => {
      if (course.id == subcourse.CourseId) {
        return {
          ...course,
          subcourses: course.subcourses.map((item) => {
            if (item.id == subcourse.id) {
              return subcourse; // Replace with updated subcourse
            } else {
              return item; // Keep old subcourse
            }
          })
        };
      } else {
        return course; // Keep course as it is
      }
    });

    this.getCoursesSubject.next(this.COURSES)
  }
  updateCourse(course:Course){
    this.COURSES = this.COURSES.map((item)=>{
      if(item.id == course.id){
        return course
      }else{
        return item
      }
    })
    this.getCoursesSubject.next(this.COURSES)
  }
  COURSES: Course[] = [
    {
      id: 1,
      name: 'Web Development Bootcamp',
      startDate: new Date('2025-04-15'),
      endDate: new Date('2025-06-15'),
      subcourses: [
        {
          id: 1,
          name: 'HTML & CSS Basics',
          startDate: new Date('2025-04-16'),
          endDate: new Date('2025-04-30'),
          CourseId: 1
        },
        {
          id: 2,
          name: 'JavaScript Fundamentals',
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-05-20'),
          CourseId: 1
        },
        {
          id: 3,
          name: 'Frontend Frameworks (Angular)',
          startDate: new Date('2025-05-21'),
          endDate: new Date('2025-06-10'),
          CourseId: 1
        }
      ]
    },
    {
      id: 2,
      name: 'Data Science Masterclass',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-08-01'),
      subcourses: [
        {
          id: 4,
          name: 'Python for Data Science',
          startDate: new Date('2025-05-02'),
          endDate: new Date('2025-05-30'),
          CourseId: 2
        },
        {
          id: 5,
          name: 'Statistics and Probability',
          startDate: new Date('2025-06-01'),
          endDate: new Date('2025-06-25'),
          CourseId: 2
        },
        {
          id: 6,
          name: 'Machine Learning Basics',
          startDate: new Date('2025-07-01'),
          endDate: new Date('2025-07-30'),
          CourseId: 2
        }
      ]
    },
    {
      id: 3,
      name: 'Mobile App Development',
      startDate: new Date('2025-07-10'),
      endDate: new Date('2025-09-30'),
      subcourses: [
        {
          id: 7,
          name: 'Flutter Fundamentals',
          startDate: new Date('2025-07-11'),
          endDate: new Date('2025-08-05'),
          CourseId: 3
        },
        {
          id: 8,
          name: 'React Native Advanced',
          startDate: new Date('2025-08-06'),
          endDate: new Date('2025-09-15'),
          CourseId: 3
        }
      ]
    }
  ];

  getCoursesSubject = new BehaviorSubject<Course[]> (this.COURSES)
  getCourseIdSubject = new BehaviorSubject<number | null> (null)
  
}
