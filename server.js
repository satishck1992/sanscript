/**
 * Created by vikram on 11/12/2015.
 */

//var mysql = require("mysql-native");
var mysql = require("mysql");
var sanscript = require("sanscript");
var express = require("express");
var path = require("path");
var app = express();


app.use("/styles", express.static(__dirname + '/styles'));
app.use("/js", express.static(__dirname + '/js'));

app.get("/pratyahara",function(req,res){

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "ss"
    });

    con.connect(function(err){
        if(err){
            console.log("Error connecting",err);
        }
    });

    con.query('call ss.pratyahara("'+req.query.characters.charAt(0)+'","'+req.query.characters.slice(1)+'")',function(err,rows){
        if(err) throw err;
        var pratyahara_characters = [];
        var procedure_results = rows[0];
        procedure_results.forEach(function(index){
            var json = {};
            json.data = { "character":index.characters, "iast": sanscript.t(index.characters,"devanagari","iast") };
            pratyahara_characters.push(json);
        });
        res.type("application/json");
        res.send(pratyahara_characters);
    });


    con.end(function(){
        //console.log("End");
    });
});

app.get("/sutras",function(req,res){

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "ss"
    });
    console.log(req.query.characters.charAt(0));
    console.log(req.query.characters.slice(1));
    con.connect(function(err){
        if(err){
            console.log("Error connecting",err);
        }
        //console.log("Connection successful");
    });

    con.query('call ss.sutras("'+req.query.characters.charAt(0)+'0000","'+req.query.characters.slice(1)+'0000")',function(err,rows) {
        if (err) {
            console.log(err);
        } else {
            var results = rows[0];
            rows.forEach(function (index) {
                var json = {};
                json.id = index.sutra_id;
                json.data = index.sutra_text;
                results.push(json);
            });
            res.type("application/json");
            res.send(results);
        }
    });

    con.end(function(){
        //console.log("End");
    });
});



app.get('/',function(req,res){
    var body = '';
    req.on('data',function(chunk){
        body += chunk;
    });
    req.on('end',function(){
        //console.log(body);
    });
    res.sendFile(path.join(__dirname+'/index.html'));
    //__dirname : It will resolve to your project folder.
});


app.listen(process.env.PORT || 3000);





