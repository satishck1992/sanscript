/**
 * Created by vikram on 11/12/2015.
 */

var mysql = require("mysql");
var sanscript = require("sanscript");
var express = require("express");
var path = require("path");
var app = express();

var routes = {
    "pratyahara":"/pratyahara",
    "sutras":"/sutras"
}

app.use("/styles", express.static(__dirname + '/styles'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/img", express.static(__dirname + '/img'));

function query(db,routes,params,callback){

    switch (routes){
        case "pratyahara":
            db.query('call ss.pratayahara("'+params[0]+'","'+params[1]+'")',callback);
            break;
        case "sutras":
            db.query('call ss.sutras("'+params[0]+'","'+params[1]+'")',callback);
            break;
    }

    return callback.characters;
}

function process(err,rows){
    if(err) throw err;
        var characters = [];
        var procedure_results = rows[0];
        procedure_results.forEach(function(index){
            var json = {};
            json.data = { "character":index.characters, "iast": sanscript.t(index.characters,"devanagari","iast") };
            characters.push(json);
        });
    return characters;
}

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

    //var params = [];
    //params.push(req.query.characters.charAt(0));
    //params.push(req.query.characters.slice(1));
    //var results = query(con,"pratyahara",params,process);
    //res.type("application/json");
    //res.send(results);

    con.end(function(){

    });
});

app.get("/sutras",function(req,res){

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
        //console.log("Connection successful");
    });
    con.query('call ss.sutras("'+req.query.characters.charAt(0)+'0000","'+req.query.characters.slice(2)+'0000")',function(err,rows) {
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


app.listen(3000);





