const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token) return res.status(401).json({ message : "NO Token"});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded.id;
        next();
    }  catch{
        res.status(401).json({ message : "Token is Invalid" });
    }
};