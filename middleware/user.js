const {jwtPassword} = require("../config");
const jwt = require("jsonwebtoken")
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    
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
            msg: "User doesn't exist"
        })
    }


}

module.exports = userMiddleware;