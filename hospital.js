var express=require("express");
var app=express();
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospitals';
let db
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database:${url}`);
    console.log(`Database :${dbName}`);

});
app.get('/HospDetails',(req,res)=>{
        var hospname=req.query.hospitalname;
        var phoneno=req.query.phoneno;
        var email=req.query.email;
        var location=req.query.location;
        var hospid=req.query.hospitalid;
        console.log(hospname+" "+phoneno+" "+email+" "+location+" "+hospid);
        var obj={"hospitalname":hospname,"phoneno":phoneno,"email":email,"location":location,"hospid":hospid};
        db.collection("hospitaldetails").insertOne(obj,function(err,res){
                 if(err) throw err;
                 console.log("1 document inserted");
        });

});
app.get('/ventDetails',(req,res)=>{
    var hospname=req.query.hospitalname;
    var ventid=req.query.ventilatorid;
    var status=req.query.ventilatorstatus;
    var hospid=req.query.hospitalid;
    console.log(hospname+" "+ventid+" "+status+" "+hospid);
    var obj={"hospitalname":hospname,"hospid":hospid,"ventilatorid":ventid,"status":status};
    db.collection("ventilatordetails").insertOne(obj,function(err,res){
             if(err) throw err;
             console.log("1 document inserted");
    });

});
app.get('/fetchhospdetails',(req,res)=>{
              console.log("Fetching data from hospital collection");
              db.collection("hospitaldetails").find().toArray().then((result)=>{
                  res.json(result);
              }).catch((err)=>{
                    console.log("error");
              });
});
app.get('/fetchventdetails',(req,res)=>{
    console.log("Fetching data from ventilator collection");
    db.collection("ventilatordetails").find().toArray().then((result)=>{
        res.json(result);
    }).catch((err)=>{
          console.log("error");
    });
});
app.get('/searchvent',(req,res)=>{
       console.log("search ventilator by status and hospitalname");
       var hospitalname=req.query.hospitalname;
       var status=req.query.status;
       console.log(hospitalname+" "+status);
       db.collection("ventilatordetails").find({"hospitalname":hospitalname,"status":status}).toArray().then((result)=>{
             res.json(result);
       }).catch((err)=>{
            res.send("No Match found");
       });
});
app.get('/searchhosp',(req,res)=>{
    console.log("search ventilator by status and hospitalname");
    var hospitalname=req.query.hospitalname;
    console.log(hospitalname);
    db.collection("hospitaldetails").find({"hospitalname":hospitalname}).toArray().then((result)=>{
          res.json(result);
    }).catch((err)=>{
         res.send("No Match found");
    });
});
app.post('/updatestatus',(req,res)=>{
    console.log("update ventilator status by id");
    var ventilatorid=req.query.ventilatorid;
    var status=req.query.status;
    console.log(ventilatorid);
    var cond={"ventilatorid":ventilatorid};
    var set={$set:{"status":status}};
    db.collection("ventilatordetails").updateOne(cond,set,function(err,res){
        if(err) throw err;
        console.log("updated succesfully");
    });
});
app.delete('/deletevent',(req,res)=>{
    console.log("delete ventilator by id");
    var ventilatorid=req.query.ventilatorid;
    console.log(ventilatorid);
    var cond={"ventilatorid":ventilatorid};
    db.collection("ventilatordetails").deleteOne(cond,function(err,res){
        if(err) throw err;
        console.log("deleted succesfully");
    });
});
app.listen(3000);