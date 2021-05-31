let city=require("./citydata");
const MongoClient = require("mongodb").MongoClient;
const fs=require("fs");

const url = "mongodb://127.0.0.1:27017";
const dbName = "jddb";
const client = new MongoClient(url, { useUnifiedTopology: true });


// new Promise (function (fulfill,reject) {
//     fs.readFile("./serve/data1.json",function (err,data) {
//         if (err) return;
//         fulfill(JSON.parse(data))
//     })
// }).then(function (result) {
//     client.connect(function (err) {
//         let db=client.db(dbName);
//         for (var i=0;i < result.length;i++) {
//             db.collection("goods").insertOne(result[i]);
//         };
//         console.log("添加完成");
//     });
// });



module.exports = {
    find(name,option,cb){
        client.connect(function (err) {
            let db=client.db(dbName);
            if (option.limit==="max") {
                db.collection(name).find(option.where).skip((option.page || 0)).toArray(function (err,data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    cb(data);
                });
            }else{
                db.collection(name).find(option.where).skip((option.page || 0)*(option.limit || 30)).limit(option.limit || 30).toArray(function (err,data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    cb(data);
                });
            }

        });
    },
    insertOne(name,option,cb){
        client.connect(function (err) {
            let db=client.db(dbName);
            db.collection(name).insertOne(option.data,function (err) {
                cb(err);
            })
        });
    },
    updateOne(name,option,cb) {
        client.connect(function (err) {
            let db=client.db(dbName);
            db.collection(name).updateOne(option.where,{$set:option.value},function (err,data) {
                cb(err,data);
            })
        });
    },
    deleteOne(name,option,cb) {
        client.connect(function (err) {
            let db=client.db(dbName);
            db.collection(name).deleteOne(option.where,function (err,data) {
                cb(err,data);
            });
        })
    },
    deleteOne(name,option,cb) {
        client.connect(function (err) {
            let db=client.db(dbName);
            db.collection(name).deleteOne(option.where,function (err,data) {
                cb(err,data);
            });
        })
    },
    findAll(name,option,cb) {
        client.connect(function (err) {
            let db=client.db(dbName);
            db.collection(name).find(option.where).toArray(function (err,data) {
                if (err) {
                    console.log(err);
                    return;
                }
                cb(data);
            });;
        })
    },
    updateMany(name,option,cb) {
        client.connect(function (err) {
            let db=client.db(dbName);
            db.collection(name).updateMany(option.where,{$set:option.value},function (err,data) {
                cb(err,data);
            })
        })
    },
    deleteMany(name,option,cb) {
        client.connect(function (err) {
            let db=client.db(dbName);
            db.collection(name).deleteMany(option.where,function (err,data) {
                cb(err,data);
            });
        })
    }
}