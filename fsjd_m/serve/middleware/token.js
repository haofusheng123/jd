const {find} = require("../connect");


module.exports = async function (req,res,next) {
    if (!req.session["username"] || !req.session["password"]) {
        res.send({type:"error",code:405,detail:{name:"令牌失效",value:null}});
        return;
    }
    
    let data =await connect.find("login", { where: { username: req.session["username"], password: String(req.session["password"]) } });
    res.send(data);

}