const router = require('express').Router();

roomIds = new Set();
studentIds = new Set();

router.get('/', (req, res) => res.render('index'));

router.get('/teacher', (req,res)=> res.render('teacher'));

router.get('/student', (req,res)=> res.render('student'));

router.get('/create', (req,res)=>{
    id = Math.floor(Math.random() * 999999);
    while(roomIds.has(id)){
        id +=1;
    }
    roomIds.add(id)
    res.redirect(`/host/${id}`);
});

router.get('/host/:roomid', (req,res,next)=>{
    id = parseInt(req.params.roomid);
    console.log("trying to host")
    console.log(roomIds)
    if(roomIds.has(id)){
        return res.render('teacher')
    }
    next()
});

router.get('/:roomid', (req,res,next)=>{
    id = parseInt(req.params.roomid);
    if(roomIds.has(id)){
        return res.render('student')
    }
    next();
});

router.get('/identifiers', (req,res,next)=>{
    id = Math.floor(Math.random() * 9999999);
    while(studentIds.has(id)){
        id +=1;
    }
    studentIds.add(id);
    console.log(studentIds)
    res.send({id});
})

module.exports = router;




