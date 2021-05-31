const express=require("express");
const router=require("./route").router;
const cookieSession = require("cookie-session");
const {token} = require("./middleware/token");
const app=express();

app.use(cookieSession({
    value:"fssession",
    secret:"fs123456",
    httpOnly:true
}));

app.all("*",function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    next();
});
app.use(router);


app.listen(3000,function () {
    console.log("localhost:3000");
})