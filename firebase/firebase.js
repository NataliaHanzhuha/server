const firebase = require('firebase-admin');
const config = require('./serviceAccountKey.json')

  firebase.initializeApp({
    credential: firebase.credential.cert(config),
    databaseURL: 'https://delta-era-195715.firebaseio.com'
  });

const db = firebase.firestore()

    module.exports.data = async () => {
        const ref = await db.collection('teacher').get('teacher');
        const arr = [];
        ref.forEach((doc) => {
            let studArr = [];
            doc.data().student.forEach((student) => studArr.push(student))
            arr.push({
                'id': doc.id,
                'teacher': doc.data().teacher,
                'student': studArr
            })
        })
        return arr
    }

    module.exports.create = async (name, student) => {
      console.log(name, student);
      const ref = await db.collection('teacher').add(
        {
          teacher: name,
          student: [
            {
              fullName: student.fullName,
              type: student.type,
              date: student.date,
              pay: student.pay
            }
          ]
        }
      );
      // return ref;
    }

    // find teacher by name and return student array
    const find = (name) => {
        return db.collection('teacher')
                .where('teacher', '==', name)
                .onSnapshot((el) => {
                    console.log(el)
                   return el.forEach((doc) => {
                        doc.data().student.forEach((student) => {
                            return student
                        })
                })
            })
    }

    // update teacher name
    module.exports.editTeacherName = async (name, nextName) => {
        await db.collection('teacher')
            .where('teacher', '==',  name)
            .get()
            .then((el) => {
                el.forEach((teacher) => {
                    db.collection('teacher')
                        .doc(teacher.id)
                        .update({
                            teacher: nextName,
                            student: teacher.data().student
                        })
                }) 
            })
    }

    // delete teacher by name
    module.exports.deleteTeacher = async (name) => {
        console.log(name);
        await db.collection('teacher')
            .where('teacher', '==',  name)
            .get()
            .then(el => {
                el.forEach(teacher => {
                    db.collection('teacher')
                        .doc(teacher.id)
                        .delete()
                })
            })
    }

    //edit student by teacher name and student name
    module.exports.editStudentToTeacher = async (newStudent, name, oldStudentName) => {
        await db.collection('teacher')
        .where('teacher', '==',  name)
        .get()
        .then((el) => {
            el.forEach((teacher) => {
                const arr = []
                teacher.data().student.map(oldStudent => {
                    if (oldStudent.fullName === oldStudentName) {
                        console.log('finded')
                        oldStudent = newStudent
                    }
                    arr.push(oldStudent)
                })

                console.log(newStudent, arr)

                db.collection('teacher')
                    .doc(teacher.id)
                    .update({
                        teacher: teacher.data().teacher,
                        student: arr
                    })
            }) 
        })
    }

    // delete student by teacherName and studentName
    module.exports.deleteStudentToTeacher = async (name, studentName) => {
        await db.collection('teacher')
        .where('teacher', '==',  name)
        .get()
        .then((el) => {
            el.forEach((teacher) => {
                const arr = []
                const index = teacher.data().student.findIndex(
                    el => el.fullName === studentName
                );
                teacher.data().student.forEach((student, i) => {
                    if (i !== index) arr.push(student)
                })

                db.collection('teacher')
                    .doc(teacher.id)
                    .update({
                        teacher: teacher.data().teacher,
                        student: arr
                    })
            })
        })
    }


    // add new student to teacher
    module.exports.addNewStudentToTeacher = async (student, name) => {
        await db.collection('teacher')
        .where('teacher', '==',  name)
        .get()
        .then((el) => {
            el.forEach((teacher) => {
                let arr = []
                console.log(teacher.data().student.length, student)
                if (teacher.data().student.length !== 0) {
                    arr = teacher.data().student
                    arr.push(student)
                } else {
                    arr.push(student)
                }
                arr.forEach(el => console.log(el))
                db.collection('teacher')
                    .doc(teacher.id)
                    .update({
                        teacher: name,
                        student: arr
                    })
            }) 
        })
    }

    module.exports.getStudentsByTeacherName = async (name) => {
        let data = []
        await db.collection('teacher')
        .where('teacher', '==',  name)
        .get()
        .then((el) => {
            el.forEach((teacher) => {
                teacher.data().student.forEach(student => 
                    data.push(student)
                )
            }) 
        })
        return data
    }

