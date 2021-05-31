const express=require("express");
const router=require("./route").router;

const app=express();
app.all("*",function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    next();
});
app.use(router);


app.listen(3000,function () {
    console.log("localhost:3000");
})