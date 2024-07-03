const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require("jsonwebtoken")
const {jwtPassword} = require("../config")
const {Admin, Course} = require("../db");
const mongoose = require("mongoose");
// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const adminExists = await Admin.findOne({username,password});
    if(adminExists){
        console.log(jwtPassword);
        res.json({
            msg: "Admin already exists"
        })
    }
    else{
        const newAdmin = await Admin.create({username,password});

        res.json({
            msg: "Admin created successfully"
        })
    }
    


});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    
    const adminExists = await Admin.findOne({
        username,
        password
    })
    if(adminExists){
        const token = jwt.sign({
            username,
            password
        },jwtPassword);
    
        res.json({
            token
        })
    }
    else{
        res.status(411).json({
            msg: "Admin not found"
        })
    }


});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    const newCourse = await Course.create({
        title,
        description,
        price,
        imageLink
    })

    res.json({
        msg: "Course created successfully",
        courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic

    const courses = await Course.find({});
    res.json({
        courses
    })
});

module.exports = router;