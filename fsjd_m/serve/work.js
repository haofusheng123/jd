let connect = require("./connect");
let qString = require("querystring");
const { type } = require("os");

function token(username, password) {
    return new Promise((fulfill, reject) => {
        connect.find("login", { where: { username: username, password: Number(password) } }, function (data) {
            fulfill(data.length > 0);
        });
    })
}

module.exports = {
    base(req, res) {
        res.send("aaa");
    },
    getGoods(req, res) {
        let reqObj = qString.parse(req.url.split("?")[1]);
        connect.find("goods", { page: Number(reqObj.page) }, function (data) {
            if (data.length === 0) {
                res.send({ type: "error", code: 401, detail: { name: "获取数据失败", value: data } });
                return;
            }
            res.send({ type: "succeed", code: 201, detail: { name: "获取数据成功", value: data } });
        });
    },
    getItem(req, res) {
        let reqObj = qString.parse(req.url.split("?")[1]);
        connect.find("goods", { where: { id: Number(reqObj.pid) } }, function (data) {
            if (data.length === 0) {
                res.send({ type: "error", code: 402, detail: { name: "商品详情获取失败", value: data[0] } });
                return;
            }
            res.send({ type: "succeed", code: 202, detail: { name: "商品详情获取成功", value: data[0] } });
        });
    },
    login(req, res) {
        let reqObj = qString.parse(req.url.split("?")[1]);
        connect.find("login", { where: { username: reqObj.user, password: Number(reqObj.pass) } }, function (data) {
            if (!data.length > 0) {
                res.send({ type: "error", code: 400, detail: { name: "密码或者账号不正确", value: data[0] } });
                return;
            }
            res.send({ type: "succeed", code: 200, detail: { name: "登陆成功", value: data[0] } });
        });
    },
    register(req,res) {
        let reqObj = qString.parse(req.url.split("?")[1]);
        if (reqObj.user.length<6 || reqObj.user.length>18 || reqObj.pass.length<6 || reqObj.pass.length>18) {
            res.send({ type: "error", code: 411, detail: { name: "密码或账号长度不符", value: ""} });
            return;
        }
        connect.find("login", { where: { username: reqObj.user } }, function (data) {
            if (data.length > 0) {
                res.send({ type: "error", code: 409, detail: { name: "账号已存在", value: ""} });
                return;
            }else {
                connect.insertOne("login",{data:{username: reqObj.user, password: Number(reqObj.pass)}},function (err) {
                    console.log(err);
                    if (err) {
                        res.send({ type: "error", code: 410, detail: { name: "账号注册失败", value: err}});
                    }else {
                        res.send({ type: "succeed", code: 208, detail: { name: "注册成功", value: "" } });
                    }
                });
            }
        });
    },
    saveCar(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", function () {
            new Promise(function (fulfill, reject) {
                connect.find("shopcar", { where: { pid: reqObj.pid, info: reqObj.info } }, function (data) {
                    fulfill(data[0]);
                });
            }).then((_data) => {
                if (_data) {
                    let goodsNum = Number(_data.num) + Number(reqObj.num);
                    goodsNum > 99 && (goodsNum = 99);
                    connect.updateOne("shopcar", { where: { pid: reqObj.pid, info: reqObj.info }, value: { num: goodsNum, sumPrice: _data.price * goodsNum } }, function (err, data) {
                        if (err) {
                            res.send({ type: "error", code: 404, detail: { name: "增加数量失败", value: err } });
                            return;
                        }
                        res.send({ type: "succeed", code: 204, detail: { name: "增加数量成功", value: data } });
                    });
                } else {
                    connect.insertOne("shopcar", { data: reqObj }, function (err) {
                        if (err) {
                            res.send({ type: "error", code: 403, detail: { name: "插入数据失败", value: err } });
                            return;
                        }
                        res.send({ type: "succeed", code: 203, detail: { name: "添加商品成功", value: "" } });
                    });
                }
            })
        })
    },

    getCar(req, res) {
        let reqObj = qString.parse(req.url.split("?")[1]);
        token(reqObj.username, reqObj.password).then(bool => {
            if (!bool) {
                res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                return;
            }
            connect.find("shopcar", { username: reqObj.username, limit: "max" }, function (data) {
                res.send({ type: "succeed", code: 201, detail: { name: "获取数据成功", value: data } });
            });
        })
    },
    changeGoods(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", function () {
            token(reqObj.username, reqObj.password).then(bool => {
                if (!bool) {
                    res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                    return;
                }
                connect.updateOne("shopcar", { where: { pid: Number(reqObj.pid) }, value: { num: reqObj.num, sumPrice: reqObj.sumPrice } }, function (err, data) {
                    if (err) {
                        res.send({ type: "error", code: 404, detail: { name: "增加数量失败", value: err } });
                        return;
                    }
                    res.send({ type: "succeed", code: 204, detail: { name: "增加数量成功", value: data } });
                });
            })
        })
    },
    deleteGoods(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", function () {
            token(reqObj.username, reqObj.password).then(bool => {
                if (!bool) {
                    res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                    return;
                }
                connect.deleteOne("shopcar", { where: { pid: Number(reqObj.pid) } }, function (err, data) {
                    if (err) {
                        res.send({ type: "error", code: 406, detail: { name: "删除商品失败", value: err } });
                        return;
                    }
                    res.send({ type: "succeed", code: 205, detail: { name: "删除商品成功", value: data } });
                });
            })
        })
    },
    likeGoods(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", function () {
            token(reqObj.username, reqObj.password).then(bool => {
                if (!bool) {
                    res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                    return;
                }
                connect.updateOne("shopcar", { where: { pid: Number(reqObj.pid) }, value: { like: reqObj.like } }, function (err, data) {
                    if (err) {
                        res.send({ type: "error", code: 407, detail: { name: "收藏操作失败", value: err } });
                        return;
                    }
                    res.send({ type: "succeed", code: 206, detail: { name: "收藏操作成功", value: data } });
                });
            })
        })
    },
    checkMany(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", function () {
            token(reqObj.username, reqObj.password).then(bool => {
                if (!bool) {
                    res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                    return;
                }
                connect.updateMany("shopcar", { where: { pid: { $in: reqObj.pidList } }, value: { checked: reqObj.checked } }, function (err, data) {
                    if (err) {
                        res.send({ type: "error", code: 408, detail: { name: "选中状态改变失败", value: err } });
                        return;
                    }
                    res.send({ type: "succeed", code: 207, detail: { name: "选中状态改变成功", value: data } });
                });
            })
        })
    },
    deleteMany(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", function () {
            token(reqObj.username, reqObj.password).then(bool => {
                if (!bool) {
                    res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                    return;
                }
                connect.deleteMany("shopcar", { where: { pid: { $in: reqObj.pidList } } }, function (err, data) {
                    if (err) {
                        res.send({ type: "error", code: 406, detail: { name: "批量删除失败", value: err } });
                        return;
                    }
                    res.send({ type: "succeed", code: 205, detail: { name: "批量删除成功", value: data } });
                });
            })
        })
    },
    likeMany(req, res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", function () {
            token(reqObj.username, reqObj.password).then(bool => {
                if (!bool) {
                    res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                    return;
                }
                connect.updateMany("shopcar", { where: { pid: { $in: reqObj.pidList } }, value: { like: true } }, function (err, data) {
                    if (err) {
                        res.send({ type: "error", code: 407, detail: { name: "收藏操作失败", value: err } });
                        return;
                    }
                    res.send({ type: "succeed", code: 206, detail: { name: "收藏操作成功", value: data } });
                });
            })
        })
    },
    getCity(req,res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", function () {
            token(reqObj.username, reqObj.password).then(bool => {
                if (!bool) {
                    res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                    return;
                }
                console.log(reqObj);
                connect.find("city",{where:{name:reqObj.cityName}},function (data) {
                    if (data.length === 0) {
                        res.send({ type: "error", code: 401, detail: { name: "获取数据失败", value: data } });
                        return;
                    }
                    res.send({ type: "succeed", code: 201, detail: { name: "获取数据成功", value: data } });
                });
            })
        });
    },
    getInitCity(req,res) {
        let reqObj;
        req.on("data", function (_data) {
            reqObj = JSON.parse(decodeURIComponent(_data));
        });
        req.on("end", function () {
            token(reqObj.username, reqObj.password).then(bool => {
                if (!bool) {
                    res.send({ type: "error", code: 405, detail: { name: "令牌失效", value: "" } });
                    return;
                }
                connect.find("cityname",{where:{},limit:"max"},function (data) {
                    if (data.length === 0) {
                        res.send({ type: "error", code: 401, detail: { name: "获取数据失败", value: data } });
                        return;
                    }
                    res.send({ type: "succeed", code: 201, detail: { name: "获取数据成功", value: data } });
                });
            })
        });
    }
}