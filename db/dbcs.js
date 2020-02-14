const mongoose = require('mongoose');
const dbCfg = require('./config');
const url = dbCfg.db;
const Schema = mongoose.Schema;

let topic = dbCfg.topic;
let db_tpc = new Schema(topic);
let tpcTable = mongoose.model('topic', db_tpc);
let it = {
    pid:3,
    title:'冰阔落'
}
mongoose.connect(url, {useNewUrlParser: true});

let saveTpc = new tpcTable(it);
saveTpc.save()
// thTable.find({},function (err,cont){
//     console.log(cont)
// })
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log('connected');
// });