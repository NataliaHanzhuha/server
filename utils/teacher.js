const firebase = require('../firebase/firebase');
const data = async () => {
    let arr = [];

    await firebase.data()
    .then(data => {
        data.forEach(el => arr.push(el))
    })
    console.log(arr)
    return arr
}

module.exports.teacherExist = (name) => {
    let exist = false;
    data().then(
        res => res.forEach((teacher) => 
            (teacher.teacher === name) ? true : false
        ),
    )
    setTimeout(()=> {return exist}, 50)
    
}