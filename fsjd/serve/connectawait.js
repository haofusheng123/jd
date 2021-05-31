let city=require("./citydata");
const MongoClient = require("mongodb").MongoClient;
const fs=require("fs");

const url = "mongodb://127.0.0.1:27017";
const dbName = "jddb";
const client = new MongoClient(url, { useUnifiedTopology: true });



module.exports = {
    find(name,option){
        return new Promise(function (fulfill,reject) {
            client.connect(function (err) {
                let db=client.db(dbName);
                if (option.limit==="max") {
                    db.collection(name).find(option.where).skip((option.page || 0)).toArray(function (err,data) {
                        if (err) {
                            return;
                        }
                        fulfill(data);
                    });
                }else{
                    db.collection(name).find(option.where).skip((option.page || 0)*(option.limit || 30)).limit(option.limit || 30).toArray(function (err,data) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        fulfill(data);
                    });
                }
            });
        })
    },
    insertOne(name,option){
        return new Promise(function (fulfill,reject) {
            client.connect(function (err) {
                let db=client.db(dbName);
                db.collection(name).insertOne(option.data,function (err) {
                    fulfill(err);
                })
            });
        })
    },
    updateOne(name,option) {
        return new Promise(function (fulfill,reject) {
            client.connect(function (err) {
                let db=client.db(dbName);
                db.collection(name).updateOne(option.where,{$set:option.value},function (err,data) {
                    fulfill({err,data});
                })
            });
        })
    },
    deleteOne(name,option) {
        return new Promise(function (fulfill,reject) {
            client.connect(function (err) {
                let db=client.db(dbName);
                db.collection(name).deleteOne(option.where,function (err,data) {
                    fulfill({err,data});
                });
            });
        })
    },
    deleteOne(name,option,cb) {
        return new Promise(function (fulfill,reject) {
            client.connect(function (err) {
                let db=client.db(dbName);
                db.collection(name).deleteOne(option.where,function (err,data) {
                    fulfill({err,data});
                });
            })
        })
    },
    findAll(name,option) {
        return new Promise(function (fulfill,reject) {
            client.connect(function (err) {
                let db=client.db(dbName);
                db.collection(name).find(option.where).toArray(function (err,data) {
                    if (err) {
                        return;
                    }
                    fulfill(data);
                });;
            })
        })
    },
    updateMany(name,option) {
        return new Promise(function (fulfill,reject) {
            client.connect(function (err) {
                let db=client.db(dbName);
                db.collection(name).updateMany(option.where,{$set:option.value},function (err,data) {
                    fulfill({err,data});
                })
            })
        })
    },
    deleteMany(name,option) {
        return new Promise(function (fulfill,reject) {
            client.connect(function (err) {
                let db=client.db(dbName);
                db.collection(name).deleteMany(option.where,function (err,data) {
                    fulfill({err,data});
                });
            })
        })
    }
}