const express=require("express");
const work=require("./workawait");

const router=express.Router();
router.get("/",work.base)
.get("/getgoods",work.getGoods)
.get("/getitem",work.getItem)
.get("/login",work.login)
.get("/register",work.register)
.get("/getcar",work.getCar)
.post("/changegoods",work.changeGoods)
.post("/deletegoods",work.deleteGoods)
.post("/likegoods",work.likeGoods)
.post("/checkmany",work.checkMany)
.post("/deletemany",work.deleteMany)
.post("/likemany",work.likeMany)
.post("/getcity",work.getCity)
.post("/getinitcity",work.getInitCity)
.post("/savecar",work.saveCar);

module.exports = {
    router
}