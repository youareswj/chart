const dbConfig = {
    db:'mongodb://127.0.0.1:27017/yChart',
    login:[{
        userId:String,
        userName:String,
        password:String,
        pic:String,
        sex:String,
        address:String,
        perShow:String
    }],
    think:[{
        userId: String,
        userName:String,
        pic:String,
        thId:Number,
        thTime:String,
        thPhone:String,
        type:Number,
        thCom: String
    }],
    comment:[{
        userId:String,
        userName:String,
        pic:String,
        thId: String,
        comTime:String,
        comment: String
    }],
    praise:[{
        thID:String,
        userId:String,
        type:Number
    }],
    topic:[{
        title:String,
        pid:Number
    }],
    tpcThk:[{
        pid:Number,
        userId: String,
        userName:String,
        pic:String,
        thId:Number,
        thTime:String,
        thPhone:String,
        type:Number,
        thCom: String
    }],
    tpcPra:[{
        thID:String,
        userId:String,
        type:Number
    }],
    tpcCom:[{
        userId:String,
        userName:String,
        pic:String,
        pid: String,
        thId:String,
        comTime:String,
        comment: String
    }],
}

module.exports = dbConfig;