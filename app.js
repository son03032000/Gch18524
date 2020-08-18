// cài đặt seversever
const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// cài đặt dùng file static
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://son0303:03032000@cluster0.rhe01.mongodb.net/Son";

app.get('/',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("Son");
    let results = await dbo.collection("Sondt").find({}).toArray();
    res.render('index',{model:results});
})


//localhost:3000/student
app.get('/lego',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("Son");
    let results = await dbo.collection("Sondt").find({}).toArray();
    res.render('allLegomodel',{model:results});
})

//user submit form
app.post('/doSearch',async (req,res)=>{
    let inputName = req.body.Teddybear;
    let client= await MongoClient.connect(url);
    let dbo = client.db("Son");

//tìm kiêm thường đúng chuẩn têntên
     let results = await dbo.collection("Sondt").find({Name:inputName}).toArray();
     res.render('allLegomodel',{model:results});

//tìm kiếm không phân biệt chữ hoa thường.

     //let results = await dbo.collection("Sondt").find({Name: new RegExp(inputName,'i')}).toArray();
     //res.render('allLegomodel',{model:results});
})



app.get('/insert',(req,res)=>{
    res.render('insert');
})


app.get('/update',async function(req,res){
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("Son");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    let results = await dbo.collection("Sondt").find(condition).toArray();
    res.render('update',{model:results});
})




app.post('/doInsert',async (req,res)=>{
    //lấy thông tin từ người quản trị wed
    let inputName = req.body.txtName;
    let inputSize = req.body.txtSize;
    let inputPrice = req.body.txtPrice;
    let inputAmount = req.body.txtAmount;

    let newStudent = { Name: inputName, Size: inputSize, Price: inputPrice , Amount: inputAmount};
    // check xem người dùng cho nhập vào hay không
    if(inputName.trim().length == 0){
        let modelError = {nameError:"Khong duoc de trong!"
        , emailError:"Email khong hop le"};
        res.render('insert',{model:modelError});
    }else{
    let client= await MongoClient.connect(url);
    let dbo = client.db("Son");
    await dbo.collection("Sondt").insertOne(newStudent);
    res.redirect('/lego');
    }
})

app.post('/doupdate',async (req,res)=>{
    let inputId = req.body.txtId;
    let inputName = req.body.txtName;
    let inputSize = req.body.txtSize;
    let inputPrice = req.body.txtPrice;
    let inputAmount = req.body.txtAmount;

    var ObjectID = require('mongodb').ObjectID;
    let condition ={ _id : ObjectID(inputId)};
    let Change = {$set :{Name: inputName, Size: inputSize , Price: inputPrice , Amount: inputAmount}};
    let client = await MongoClient.connect(url);
    let dbo = client.db("Son");
    await dbo.collection("Sondt").updateOne(condition,Change);
    res.redirect('/lego');
})


app.get('/delete',async (req,res)=>{
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("Son");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    await dbo.collection("Sondt").deleteOne(condition);
    res.redirect('/lego');

})
const PORT = process.env.PORT || 3000;
var server=app.listen(PORT,function() {});

