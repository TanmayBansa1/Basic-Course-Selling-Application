// Middleware for handling auth
const {Admin} = require("../db");
const jwt = require("jsonwebtoken");
const {jwtPassword} = require("../config");
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const bearerToken = req.headers.authorization;
    const splitted = bearerToken.split(" ");
    const token = splitted[1];
    try{
        const verified = jwt.verify(token,jwtPassword);
        if(verified){
            next();
        }
    }
    catch(e){
        res.json({
            msg: "Admin doesn't exist"
        })
    }
}

module.exports = adminMiddleware;