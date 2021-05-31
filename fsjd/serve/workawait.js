let connect = require("./connectawait");
let qString = require("querystring");
const { type } = require("os");
const { log } = require("console");

function token(username, password) {
    return new Promise(async function (fulfill, reject) {
        let data =await connect.find("login", { where: { username: username, password: String(password) } });
        fulfill(data.length > 0);
    })
}

module.exports = {
    base(req, res) {
        res.send("aaa");
    },
    async getGoods(req, res) {
        let reqObj = qString.parse(req.url.split("?")[1]);
        let data = await connect.find("goods", { page: Number(reqObj.page) });
        if (data.length === 0) {
            res.send({ type: "error", code: 401, detail: { name: "获取数据失败", value: data } });
            return;
        }
        res.send({ type: "succeed", code: 201, detail: { name: "获取数据成功", value: data } });
    },
    async getItem(req, res) {
        let reqObj = qString.parse(req.url.split("?")[1]);

        let data=await connect.find("goods", { where: { id: Number(reqObj.pid) } });

        if (data.length === 0) {
            res.send({ type: "error", code: 402, detail: { name: "商品详情获取失败", value: data[0] } });
            return;
        }

        res.send({ type: "succeed", code: 202, detail: { name: "商品详情获取成功", value: data[0] } });
    },
    async login(req, res) {
        let reqObj = qString.parse(req.url.split("?")[1]);
        let data = await connect.find("login", { where: { username: reqObj.user, password: String(reqObj.pass) } });

        if (!data.length > 0) {
            res.send({ type: "error", code: 400, detail: { name: "密码或者账号不正确", value: data[0] } });
            return;
        }
        res.send({ type: "succeed", code: 200, detail: { name: "登陆成功", value: data[0] } });
    },
    async register(req,res) {

        let reqObj = qString.parse(req.url.split("?")[1]);
        if (reqObj.user.length<6 || reqObj.user.length>18 || reqObj.pass.length<6 || reqObj.pass.length>18) {
            res.send({ type: "error", code: 411, detail: { name: "密码或账号长度不符", value: ""} });
            return;
        }

        let data =await connect.find("login", { where: { username: reqObj.user } });

        if (data.length > 0) {
            res.send({ type: "error", code: 409, detail: { name: "账号已存在", value: ""} });
            return;
        }else {
            let err =await connect.insertOne("login",{data:{username: reqObj.user, password: String(reqObj.pass)}});
            if (err) {
                res.send({ type: "error", code: 410, detail: { name: "账号注册失败", value: err}});
            }else {
                res.send({ type: "succeed", code: 208, detail: { name: "注册成功", value: "" } });
            }
        }
    },
    async saveCar(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", async function () {

            let data = await connect.find("shopcar", { where: { pid: reqObj.pid, info: reqObj.info } });
            let _data=data[0];

            if (_data) {
                let goodsNum = Number(_data.num) + Number(reqObj.num);
                goodsNum > 99 && (goodsNum = 99);
                let {err, data} =await connect.updateOne("shopcar", { where: { pid: reqObj.pid, info: reqObj.info }, value: { num: goodsNum, sumPrice: _data.price * goodsNum } });

                if (err) {
                    res.send({ type: "error", code: 404, detail: { name: "增加数量失败", value: err } });
                    return;
                }
                res.send({ type: "succeed", code: 204, detail: { name: "增加数量成功", value: data } });
            } else {
                let err =await connect.insertOne("shopcar", { data: reqObj });
                if (err) {
                    res.send({ type: "error", code: 403, detail: { name: "插入数据失败", value: err } });
                    return;
                }
                res.send({ type: "succeed", code: 203, detail: { name: "添加商品成功", value: "" } });
            }
        })
    },

    async getCar(req, res) {
        let reqObj = qString.parse(req.url.split("?")[1]);
        let bool =await token(reqObj.username, reqObj.password);
        if (!bool) {
            res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
            return;
        }
        let data =await connect.find("shopcar", { where:{username: reqObj.username},limit: "max"});
        res.send({ type: "succeed", code: 201, detail: { name: "获取数据成功", value: data } });
    },
    async changeGoods(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end",async function () {
            let bool =await token(reqObj.username, reqObj.password);
            if (!bool) {
                res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                return;
            }
            let {err, data} =await connect.updateOne("shopcar", { where: { pid: Number(reqObj.pid) }, value: { num: reqObj.num, sumPrice: reqObj.sumPrice } });
            if (err) {
                res.send({ type: "error", code: 404, detail: { name: "增加数量失败", value: err } });
                return;
            }
            res.send({ type: "succeed", code: 204, detail: { name: "增加数量成功", value: data } });
        })
    },
    async deleteGoods(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end",async function () {
            let bool =await token(reqObj.username, reqObj.password);
            if (!bool) {
                res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                return;
            }
            let {err, data} =await connect.deleteOne("shopcar", { where: { pid: Number(reqObj.pid) } });

            if (err) {
                res.send({ type: "error", code: 406, detail: { name: "删除商品失败", value: err } });
                return;
            }
            res.send({ type: "succeed", code: 205, detail: { name: "删除商品成功", value: data } });
        })
    },
    async likeGoods(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end",async function () {
            let bool =await token(reqObj.username, reqObj.password);
            if (!bool) {
                res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                return;
            }
            let {err, data} =await connect.updateOne("shopcar", { where: { pid: Number(reqObj.pid) }, value: { like: reqObj.like } });
            if (err) {
                res.send({ type: "error", code: 407, detail: { name: "收藏操作失败", value: err } });
                return;
            }
            res.send({ type: "succeed", code: 206, detail: { name: "收藏操作成功", value: data } });
        })
    },
    async checkMany(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end",async function () {
            let bool =await token(reqObj.username, reqObj.password);
            if (!bool) {
                res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                return;
            }
            let {err, data} =await connect.updateMany("shopcar", { where: { pid: { $in: reqObj.pidList } }, value: { checked: reqObj.checked } });
            if (err) {
                res.send({ type: "error", code: 408, detail: { name: "选中状态改变失败", value: err } });
                return;
            }
            res.send({ type: "succeed", code: 207, detail: { name: "选中状态改变成功", value: data } });
        })
    },
    async deleteMany(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end",async function () {
            let bool = await token(reqObj.username, reqObj.password);
            if (!bool) {
                res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                return;
            }
            let {err, data} = await connect.deleteMany("shopcar", { where: { pid: { $in: reqObj.pidList } } });

            if (err) {
                res.send({ type: "error", code: 406, detail: { name: "批量删除失败", value: err } });
                return;
            }
            res.send({ type: "succeed", code: 205, detail: { name: "批量删除成功", value: data } });
        })
    },


    // =============================


    async likeMany(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end",async function () {
            let bool =await token(reqObj.username, reqObj.password);
            if (!bool) {
                res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                return;
            }
            let {err, data} =await connect.updateMany("shopcar", { where: { pid: { $in: reqObj.pidList } }, value: { like: true } });
            if (err) {
                res.send({ type: "error", code: 407, detail: { name: "收藏操作失败", value: err } });
                return;
            }
            res.send({ type: "succeed", code: 206, detail: { name: "收藏操作成功", value: data } });
        })
    },
    async getCity(req,res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end",async function () {
            let data =await connect.find("city",{where:{name:reqObj.cityName}});
            if (data.length === 0) {
                res.send({ type: "error", code: 401, detail: { name: "获取数据失败", value: data } });
                return;
            }
            res.send({ type: "succeed", code: 201, detail: { name: "获取数据成功", value: data } });
        });
    },
    async getInitCity(req,res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end",async function () {
            let data =await connect.find("cityname",{where:{},limit:"max"});
            if (data.length === 0) {
                res.send({ type: "error", code: 401, detail: { name: "获取数据失败", value: data } });
                return;
            }
            res.send({ type: "succeed", code: 201, detail: { name: "获取数据成功", value: data } });
        });
    }
}