var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const data = require('../firebase/firebase');
const valid = require('../utils/teacher')
// get teachers database
router.get('/', async (req, res) => {
    await data.data()
            .then(data => {
                let arr = [];
                data.forEach(el => arr.push(el))
                console.log(arr)
                res.send(arr)
                res.end()
            })
});

// create new teacher
router.post('/', async (req, res) => {
    let name = req.body.name
    let student = req.body.student
    // valid.teacherExist(name).then(res => {
        await console.log( valid.teacherExist(name))
    // })
        // data.create(name, student)
    res.end()
})

// edit teacher
router.put('/', (req, res) => {
    const name = req.body.name
    const prevName = req.body.prevName
    data.editTeacherName(name, prevName)
    res.end()
})

// delete teacher
router.delete('/', (req, res) => {
    const name = req.body.name
    data.deleteTeacher(name)
    res.end()
})

// edit student 
router.put('/student', (req, res) => {
    const teacher = req.body.name
    const student = req.body.student
    data.editStudentToTeacher(student, teacher, 'frida')
    res.end() 
})

// create student
router.post('/student', (req, res) => {
    const teacher = req.body.name
    const student = req.body.student
    data.addNewStudentToTeacher(student, teacher)
    res.end() 
})

// delete student
router.delete('/student', (req, res) => {
    const teacher = req.body.name
    const studentName = req.body.student
    data.deleteStudentToTeacher(teacher, studentName)
    res.end()
})

// get students by teacher
router.get('/students', async (req, res) => {
    const teacher = req.body.name
    await data.getStudentsByTeacherName(teacher)
        .then(data => {
            let arr = [];
            data.forEach(el => arr.push(el))
            res.send(arr)
            res.end()
        })
})



module.exports = router;