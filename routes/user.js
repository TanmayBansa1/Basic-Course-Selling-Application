const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const {jwtPassword} = require("../config")

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await User.findOne({
        username,
        password
    });

    if(userExists){
        res.json({
            msg: "User already exists"
        })
    }else{
        await User.create({
            username,
            password
        });
        res.json({
            msg: "User created succuessfully"
        })
    }
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await User.findOne({
        username,
        password
    });

    if(userExists){
        const token = jwt.sign({username,password},jwtPassword);
        res.json({
            token
        })
    }else{
        res.json({
            msg: "User doesnt exist"
        })
    }
    
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic

    const courses = await Course.find({});

    res.json({
        courses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    
    const username = jwt.decode(jwtToken).username;
    
    await User.updateOne({
        username
    },{
        "$push": {
            purchasedCourses: courseId
        }
    })
    res.json({
        msg: "Course purchased successfully"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    const username = jwt.decode(jwtToken).username;

    const userExists = await User.findOne({
        username,
    });

    if(userExists){
        const purchasedCourses = await Course.find({
            _id: {
              "$in": userExists.purchasedCourses
            }
          });

        res.json({
            purchasedCourses
        })
    }else{
        res.send({
            msg: "Something went wrong"
        })
  
    }
});

module.exports = router