const express = require('express');
const mongoose = require('mongoose');
const dbCfg = require('../db/config');
const session = require('express-session');
const router = express.Router();
const url = dbCfg.db;
const Schema = mongoose.Schema;

//session options
let opts = {
    name: 'yChart',
    secret: 'personal webApp of sVij',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,    //过期时间一周
        httpOnly: true
    }
}
router.use(session(opts));
//注册表
let login_m = dbCfg.login;
let db_login = new Schema(login_m);
let dbTable = mongoose.model('login', db_login);

//心情表
let think = dbCfg.think;
let db_th = new Schema(think);
let thTable = mongoose.model('think', db_th);
//点赞表
let praise = dbCfg.praise;
let db_pra = new Schema(praise);
let praTable = mongoose.model('praise', db_pra);

let thkpra = dbCfg.tpcPra;
let db_thk = new Schema(thkpra);
let thkTable = mongoose.model('tpcPra', db_thk);
//评论表
let comments = dbCfg.comment;
let db_com = new Schema(comments);
let comTable = mongoose.model('comment', db_com);

let tpccom = dbCfg.tpcCom;
let db_tpccom = new Schema(tpccom);
let tpccTable = mongoose.model('tpccom', db_tpccom);
//话题表
let topic = dbCfg.topic;
let db_tpc = new Schema(topic);
let tpcTable = mongoose.model('topic', db_tpc);
//话题讨论表
let tpcThk = dbCfg.tpcThk;
let db_tpk = new Schema(tpcThk);
let tpkTable = mongoose.model('tpcThk', db_tpk);

/* GET home page. */
router.get('/', function (req, res, next){            //首页
    res.render('index', {title: '你喜欢什么呢ಠᴗಠ'});
});
router.get('/list', function (req, res, next){      //首页心情列表
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        thTable.find({}).sort({'_id': -1}).exec((err, think) => {
            if(err){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'err unknown'
                }))
                return console.log(err);
            }
            res.json({
                success: true,
                data: think
            })
        })
    }).then(() => {
        db.close();
    })
})

router.get('/u_com', function (req, res, next){        //根据用户ID获取心情列表
    let uid = req.query.uid;
    if(!uid){
        res.end(JSON.stringify({
            success: false,
            msg: 'userId is required'
        }))
    }
    let pic, userName = '';
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        dbTable.find({userId: uid}, (err, user) => {
            if(err) return console.log(err);
            if(user.length == 0){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'The user is not found'
                }));
                return false;
            } else{
                pic = user[0].pic;
                userName = user[0].userName;
            }
        })
        thTable.find({userId: uid}).sort({'_id': -1}).lean().exec((err, cont) => {
            if(err) return console.log(err);
            if(cont.length == 0){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'There are not any think'
                }));
                return false;
            } else{
                for(let i in cont){
                    cont[i].pic = pic;
                    cont[i].userName = userName;
                }
                res.json({
                    success: true,
                    data: cont
                })
            }
        })
    }).then(() => {
        db.close();
    })

});
router.get('/get_user', function (req, res, next){   //获取用户资料
    let uid = req.query.uid;
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        dbTable.find({userId: uid}, (err, cont) => {
            if(err) return console.log(err);
            if(cont.length == 0){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'No such as user'
                }));
                return false;
            } else{
                res.json({
                    success: true,
                    data: {
                        uid: cont[0].userId,
                        userName: cont[0].userName,
                        pic: cont[0].pic,
                        sex: cont[0].sex,
                        address: cont[0].address,
                        perShow: cont[0].perShow
                    }
                })
            }
        });
    }).then(() => {
        db.close();
    })
});
router.get('/praList', function (req, res, next){   //获取个人点赞数
    var uid = req.query.uid;
    if(!uid){
        res.end(JSON.stringify({
            success: false,
            msg: 'userId is necessary!'
        }))
        return false;
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        let query = praTable.find({userId: uid});
        if(query.length == 0){
            res.end(JSON.stringify({
                success: false,
                msg: "it's not anything"
            }));
            return false
        } else{
            query = query.sort({'_id': -1}).lean().exec((err, cont) => {
                if(err){
                    res.end(JSON.stringify({
                        success: false,
                        msg: 'err unknown'
                    }));
                    return false;
                }
                res.json({
                    success: true,
                    data: cont
                })
            });
        }
    }).then(() => {
        db.close();
    })

});
router.get('/comList', function (req, res, next){             //根据thId获取评论
    let tid = req.query.id;
    if(!tid){
        res.end({
            success: false,
            msg: 'comId is necessary'
        })
        return false;
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        comTable.find({thId: tid}, function (err, comt){
            if(err){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'err unknown'
                }));
                return console.log(err);
            }
            res.json({
                success: true,
                data: comt
            })
        })
    }).then(() => {
        db.close();
    })
});
router.get('/login', function (req, res, next){       //登录
    res.render('login', {title: 'ლ(❛◡❛✿)ლ登录'});
});
router.post('/login_test', function (req, res, next){       //登录验证
    let user = req.body.userName;
    let pwd = req.body.pwd;
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        dbTable.find({userName: user}, (err, cont) => {
            if(err) return console.log(err);
            if(cont.length == 0){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'No found'
                }));
                return false;
            } else{
                if(pwd != cont[0].password){
                    res.end(JSON.stringify({
                        success: false,
                        msg: 'err password'
                    }));
                    return false;
                } else{
                    console.log(`用户${cont[0].userName}登录成功.`);
                    req.session.loginId = {
                        uid: cont[0].userId,
                        userName: cont[0].userName,
                        pic: cont[0].pic
                    };
                    res.json({
                        success: true,
                        uid: cont[0].userId,
                        userName: cont[0].userName,
                        msg: '登录成功!'
                    });
                }
            }
        })

    }).then(() => {
        db.close();
    })
});
router.get('/log_session', function (req, res, next){    //判断登录状态
    let saveS = req.session.loginId;
    if(saveS){
        res.end(JSON.stringify({
            userId: saveS.uid,
            userName: saveS.userName,
            pic: saveS.pic,
            msg: 'login successfully'
        }));
    } else{
        res.end(JSON.stringify({
            userId: null,
            msg: 'login please'
        }))
    }
})
router.get('/logout',function (req,res,next){
    req.session.destroy((err)=>{
        if(err){
            res.end(JSON.stringify({
                success:false,
                msg:'logout failed'
            }));
        }
        res.clearCookie('yChart');
        res.json({
            success:true,
            msg:'logout successfully'
        });
    });
})
router.get('/add', function (req, res, next){         //注册
    res.render('add', {title: '(づ￣3￣)づ注册'});
});
router.get('/test', function (req, res, next){           //验证昵称是否可用
    let user = req.query.user;
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        dbTable.find({userName: user}, (err, cont) => {
            if(err) return console.log(err);
            if(cont.length != 0){
                console.log('---该用户名不可使用---');
                res.end(JSON.stringify({
                    success: 'false',
                    msg: '该用户名已存在！'
                }));
                return false;
            } else{
                res.json({
                    success: 'success',
                    msg: '可用昵称!'
                })
            }
        })
    }).then(() => {
        db.close();
    })
})
router.post('/login_user', function (req, res, next){ //用户注册资料提交
    let userId = req.body.userName;
    let user = req.body.userName;
    let pic = req.body.pic;
    let pwd = req.body.password;
    let sex = req.body.sex;
    let address = req.body.address;
    let show = req.body.perShow;
    for(let i = 0; i < 5; i++){
        let num = Math.floor(Math.random() * 10);
        userId += num;
    }
    let it = {
        userId: userId,
        userName: user,
        password: pwd,
        pic: pic,
        sex: sex,
        address: address,
        perShow: show
    };
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        let saveStr = new dbTable(it);
        saveStr.save((err, item) => {
            if(err){
                res.end(JSON.stringify({
                    success: false,
                    msg: '注册失败，可能是提交资料有问题.'
                }));
                return console.log(err);
            }
            console.log('---注册成功！---');
            res.json({
                success: true,
                msg: '注册成功!'
            })
        })
    }).then(() => {
        db.close();
    })

});
router.get('/user', function (req, res, next){
    res.render('user', {title: '(✪ω✪)个人'});
});

router.post('/postCom', function (req, res, next){            //发表心情
    try {
        let userId = req.body.uid;
        let userName = req.body.name;
        let pic = req.body.pic;
        let thId = req.body.thId;
        let thTime = req.body.thTime;
        let thPhone = req.body.thPhone;
        let thCom = req.body.thCom;
        let type = req.body.type;
        let it = {
            userId: userId,
            userName: userName,
            pic: pic,
            thId: thId,
            thTime: thTime,
            thPhone: thPhone,
            type: type,
            thCom: thCom
        }
        mongoose.connect(url, {useNewUrlParser: true});
        let db = mongoose.connection;
        db.once('open', () => {
            let saveStr = new thTable(it);
            saveStr.save((err, item) => {
                if(err){
                    res.end(JSON.stringify({
                        success: false,
                        msg: '发表失败，可能是提交资料有问题.'
                    }));
                    return console.log(err);
                }
                console.log('---发表成功！---');
                res.json({
                    success: true,
                    msg: '发表成功!'
                })
            })
        }).then(() => {
            db.close();
        })

    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            msg: '要提交的内容为空!'
        })
    }
});
router.get('/remove', function (req, res, next){    //删除心情
    var id = req.query.id;
    if(!id){
        res.end(JSON.stringify({
            success: false,
            msg: 'thinkID is necessary'
        }));
        return false;
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        thTable.findByIdAndDelete({_id: id}, (err, thk) => {
            if(err){
                return console.log(err);
            }
        })
        comTable.findOneAndDelete({thId: id}, (err, com) => {         //删除对应的点赞和评论
            if(err){
                return console.log(err);
            }
        })
        praTable.findOneAndDelete({thID: id}, (err, pra) => {
            if(err){
                return console.log(err);
            }
        })
    }).then(() => {
        db.close();
    })

    res.json({
        success: true,
        msg: 'This comment is deleted successfully'
    })
})
router.get('/praise', function (req, res, next){    //点赞
    var uid = req.query.uid;
    var tid = req.query.tid;
    var type = req.query.type;         //0=取消 1=点赞 2=看low
    let it = {
        thID: tid,
        userId: uid,
        type: type
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        praTable.find({userId: uid, thID: tid}, (err, pra) => {
            if(err){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'err unknown'
                }));
                return console.log(err);
            }
            if(pra.length == 0){
                let savePra = new praTable(it);
                savePra.save((err, pra) => {
                    if(err){
                        res.end(JSON.stringify({
                            success: false,
                            msg: 'praise failed,maybe wrong with post data'
                        }))
                        return console.log(err);
                    }
                    res.end(JSON.stringify({
                        success: true,
                        msg: 'I get your attitude'
                    }));
                    return false;
                })
            }else{
                praTable.updateOne({userId: uid, thID: tid}, {type: type}, (err, news) => {
                    if(err){
                        res.end({
                            success: false,
                            msg: 'err unknown'
                        });
                        return console.log(err);
                    }
                    res.json({
                        success: true,
                        msg: 'update successfully'
                    });
                    if(news) db.close();
                })
            }
        })
    })
})
router.post('/postComt', function (req, res, next){         //发表评论
    let uId = req.body.uid;
    let userName = req.body.name;
    let pic = req.body.pic;
    let tId = req.body.tid;
    let cTime = req.body.time;
    let comt = req.body.com;
    if(uId == "" || comt == ""){
        res.end(JSON.stringify({
            success: false,
            msg: 'userId or comment is necessary'
        }));
        return false
    }
    let it = {
        userId: uId,
        userName: userName,
        pic: pic,
        thId: tId,
        comTime: cTime,
        comment: comt
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        let saveCom = new comTable(it);
        saveCom.save((err, rex) => {
            if(err){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'err unknown ,it is maybe post error data'
                }));
                return console.log(err);
            }
            console.log('---评论成功---');
            res.json({
                success: true,
                msg: 'comment published successfully'
            })
        })
    }).then(() => {
        db.close();
    })
});
router.get('/topic',function (req,res,next){     //话题
    res.render('topic', {title: '(✪ω✪)话题'});
})
router.get('/tpc',function (req,res,next){     //话题详细
    res.render('tpc', {title: '(✪ω✪)讨论'});
})
router.get('/tpclist',function (req,res,next){   //根据pid获取主题
    let pid = req.query.pid;
    if(!pid){
        res.end(JSON.stringify({
            success:false,
            msg:'pid is necessary'
        }));
        return false;
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open',()=>{
        tpcTable.find({pid:pid},(err, tpc)=>{
            if(err){
                res.end(JSON.stringify({
                    success:false,
                    msg:'err unknown'
                }));
                return console.log(err);
            }
            res.json({
                success:true,
                data:tpc
            })
        })
    }).then(()=>{
        db.close();
    })
})
router.post('/postTpk', function (req, res, next){            //参与话题讨论
    try {
        let pid = req.body.pid;
        let userId = req.body.uid;
        let userName = req.body.name;
        let pic = req.body.pic;
        let thId = req.body.thId;
        let thTime = req.body.thTime;
        let thPhone = req.body.thPhone;
        let thCom = req.body.thCom;
        let type = req.body.type;
        let it = {
            pid: pid,
            userId: userId,
            userName: userName,
            pic: pic,
            thId: thId,
            thTime: thTime,
            thPhone: thPhone,
            type: type,
            thCom: thCom
        }
        mongoose.connect(url, {useNewUrlParser: true});
        let db = mongoose.connection;
        db.once('open', () => {
            let saveTpk = new tpkTable(it);
            saveTpk.save((err, item) => {
                if(err){
                    res.end(JSON.stringify({
                        success: false,
                        msg: '发表失败，可能是提交资料有问题.'
                    }));
                    return console.log(err);
                }
                console.log('---发表成功！---');
                res.json({
                    success: true,
                    msg: '发表成功!'
                })
            })
        }).then(() => {
            db.close();
        })
    }catch (e) {
        console.log(e);
        res.json({
            success: false,
            msg: '要提交的内容为空!'
        })
    }
});
router.get('/getTpk', function (req, res, next){        //根据pid获取讨论列表
    let pid = req.query.pid;
    if(!pid){
        res.end(JSON.stringify({
            success: false,
            msg: 'pid is required'
        }))
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        tpkTable.find({pid:pid},(err, tpk)=>{
            if(err){
                res.end(JSON.stringify({
                    success:false,
                    msg:'err unknown'
                }));
                return false;
            }
            res.json({
                success:true,
                data:tpk
            })
        })
    }).then(() => {
        db.close();
    })
});
router.get('/tpkpra', function (req, res, next){    //讨论点赞
    var uid = req.query.uid;
    var tid = req.query.tid;
    var type = req.query.type;         //0=取消 1=点赞 2=看low
    let it = {
        thID: tid,
        userId: uid,
        type: type
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        thkTable.find({userId: uid, thID: tid}, (err, pra) => {
            if(err){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'err unknown'
                }));
                return console.log(err);
            }
            if(pra.length == 0){
                let savePra = new thkTable(it);
                savePra.save((err, pra) => {
                    if(err){
                        res.end(JSON.stringify({
                            success: false,
                            msg: 'praise failed,maybe wrong with post data'
                        }))
                        return console.log(err);
                    }
                    res.end(JSON.stringify({
                        success: true,
                        msg: 'I get your attitude'
                    }));
                    return false;
                })
            }else{
                tpcTable.updateOne({userId: uid, thID: tid}, {type: type}, (err, news) => {
                    if(err){
                        res.end({
                            success: false,
                            msg: 'err unknown'
                        });
                        return console.log(err);
                    }
                    res.json({
                        success: true,
                        msg: 'update successfully'
                    });
                    if(news) db.close();
                })
            }
        })
    })
});
router.get('/thkpra', function (req, res, next){   //获取个人话题点赞数
    var uid = req.query.uid;
    if(!uid){
        res.end(JSON.stringify({
            success: false,
            msg: 'userId is necessary!'
        }))
        return false;
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        let query = thkTable.find({userId: uid});
        if(query.length == 0){
            res.end(JSON.stringify({
                success: false,
                msg: "it's not anything"
            }));
            return false
        } else{
            query = query.sort({'_id': -1}).lean().exec((err, cont) => {
                if(err){
                    res.end(JSON.stringify({
                        success: false,
                        msg: 'err unknown'
                    }));
                    return false;
                }
                res.json({
                    success: true,
                    data: cont
                })
            });
        }
    }).then(() => {
        db.close();
    })
});

router.post('/posttpcc', function (req, res, next){         //发表评论
    let uId = req.body.uid;
    let userName = req.body.name;
    let pid = req.body.pid;
    let pic = req.body.pic;
    let tId = req.body.tid;
    let cTime = req.body.time;
    let comt = req.body.com;
    if(uId == "" || comt == ""){
        res.end(JSON.stringify({
            success: false,
            msg: 'userId or comment is necessary'
        }));
        return false
    }
    let it = {
        userId: uId,
        userName: userName,
        pic: pic,
        pid:pid,
        thId: tId,
        comTime: cTime,
        comment: comt
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        let saveCom = new tpccTable(it);
        saveCom.save((err, rex) => {
            if(err){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'err unknown ,it is maybe post error data'
                }));
                return console.log(err);
            }
            console.log('---评论成功---');
            res.json({
                success: true,
                msg: 'comment published successfully'
            })
        })
    }).then(() => {
        db.close();
    })
});
router.get('/tpccList', function (req, res, next){             //根据thId获取话题评论
    let tid = req.query.id;
    if(!tid){
        res.end({
            success: false,
            msg: 'comId is necessary'
        })
        return false;
    }
    mongoose.connect(url, {useNewUrlParser: true});
    let db = mongoose.connection;
    db.once('open', () => {
        tpccTable.find({thId: tid}, function (err, comt){
            if(err){
                res.end(JSON.stringify({
                    success: false,
                    msg: 'err unknown'
                }));
                return console.log(err);
            }
            res.json({
                success: true,
                data: comt
            })
        })
    }).then(() => {
        db.close();
    })
});

router.get('*', function (req, res, next){      //404
    res.render('404', {title: '404'});
})
module.exports = router;
