const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
//data tipe , create= tipe and schema 
const{
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const grades = require('./grades.json');
const students = require('./students.json');
const courses = require('./courses.json');

const studentType = new GraphQLObjectType({
    name:'students',
    description:'Represent students',
    fields:()=>({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        lastname: { type: GraphQLNonNull(GraphQLString) },
        courseId: { type: GraphQLNonNull(GraphQLInt) },
        course:{
            type:CourseType,
            resolve:(student)=>{
                return courses.find(course => course.id == student.courseId)
            }
        }
    })
});


const CourseType = new GraphQLObjectType({
    name:'Course',
    description:'Represent course',
    fields: () =>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLNonNull(GraphQLString)},
    })
})

const GradesType = new GraphQLObjectType({
    name:'Grades',
    description:'Represent grade',
    fields: () =>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        grade: {type: GraphQLNonNull(GraphQLString)},
        couserId: {type: GraphQLNonNull(GraphQLInt)},
        studentId: {type: GraphQLNonNull(GraphQLInt)},
        student:{
            type:studentType,
            resolve:(grade)=>{
                return students.find(student => student.id == grade.studentId)
            }
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addStudent: {
            type: studentType,
            description: 'Add a student',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) },
                courseId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const student = {
                    id: students.length + 1,
                    name: args.name,
                    lastname: args.lastname,
                    courseId: args.courseId
                }
                students.push(student)
                return student
            }
        },
        addCourse: {
            type: CourseType,
            description: 'Add a course',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const course = {
                    id: courses.length + 1,
                    name: args.name,
                    description: args.description,
                }
                courses.push(course)
                return course
            }
        },
        addGradre: {
            type: GradesType,
            description: 'Add a grade',
            args: {
                grade: { type: GraphQLNonNull(GraphQLString) },
                couserId: { type: GraphQLNonNull(GraphQLInt) },
                studentId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const grade = {
                    id: grades.length + 1,
                    grade: args.grade,
                    couserId: args.couserId,
                    studentId: args.studentId,
                }
                grades.push(grade)
                return grade
            }
        },
        deletStudent: {
            type: studentType,
            description: 'Delet a student',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                let student=[];
                students.map((stud)=>{
                        if(stud.id==args.id){
                            student=stud
                        }
                })
                // console.log(student)
                // console.log(args.id);
                // console.log(student);
                students.splice((args.id-1),1)
                // console.log("-----------------");
                console.log(students);
                return student 
            }
        },  
        deletCourse: { 
            type: CourseType,
            description: 'Delet a Course',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                let course=[];
                courses.map((cour)=>{
                        if(cour.id==args.id){
                            course=cour
                        }
                })
                console.log(course)
                // console.log(args.id);
                // console.log(courses);
                courses.splice((args.id-1),1)
                // console.log("-----------------");
                console.log(courses);
                return course
            }
        },
        deletGrade: { 
            type: GradesType,
            description: 'delet a grade',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                let grade=[];
                grades.map((gra)=>{
                        if(gra.id==args.id){
                            grade=gra
                        }
                })
                // console.log(grade)
                // console.log(args.id);
                // console.log(courses);
                grades.splice((args.id-1),1)
                // console.log("-----------------");
                console.log(grades);
                return grade
            }
        }, 
    })
})


const RootQueryType = new GraphQLObjectType({
    name:'Query',
    description:'Root Query',
    fields:()=>({
        students:{
            type: new GraphQLList(studentType),
            description:'List of All students',
            resolve: ()=> students
        },
        student:{
            type: studentType,
            description:'particular student',
            args:{
                id:{ type: GraphQLInt }
            },
            resolve: (parent, args)=> students.find(student => student.id === args.id),
        }, 
        courses:{
            type: new GraphQLList(CourseType),
            description:'List of All courses',
            resolve: ()=> courses
        },
        course:{
            type: CourseType,
            description:'particular course',
            args:{
                id:{ type: GraphQLInt }
            },
            resolve: (parent, args)=> courses.find(course => course.id === args.id),
        }, 
        grades:{
            type: new GraphQLList(GradesType),
            description:'List of All grades',
            resolve: ()=> grades
        },
        grade:{
            type: GradesType,
            description:'particular grade',
            args:{
                id:{ type: GraphQLInt }
            },
            resolve: (parent, args)=> grades.find(grade => grade.id === args.id),
        },


    })
});


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use('/graphql',expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(3000,()=>{
    console.log('Server running');
}); 