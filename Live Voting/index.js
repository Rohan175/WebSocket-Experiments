const express = require('express')
const path = require('path');
const WebSocketServer = require('ws').Server;
const fs = require('fs');

let wss = new WebSocketServer({port: 40510});

let count = 0;
let clients = [];
let cIndex = 0;
 
let imageFiles =[];

let imagepath = path.join(__dirname,'/public/images');

let allData=[];

fs.readdirSync(imagepath).forEach(file => {
  imageFiles.push(file);
});

for(let i=0; i<imageFiles.length ; i++){
  allData[i] = [];
}

wss.on('connection', function (ws) {

  let msg = (cIndex!=0) ? cIndex : "Welcome Stage";
  clients.push(ws);
  count++;
  ws.send(JSON.stringify({
    "client" : "server",
    "id" : count,
    "data":msg,
    "imageUrl" : imageFiles[cIndex]
    })
  );

  ws.on('close',()=> clients.splice(clients.indexOf(ws),1)); 

  ws.on('message', function (message) {
    console.log('received: %s', message)
    let msgString;
    try{msgString = JSON.parse(message);}
    catch(err){console.log(err);}
    
    
    if(msgString.client === "admin"){
        cIndex = msgString.data
        clients.forEach((client) => {
          if(client !=ws && client.readyState != 3){
            
            client.send(JSON.stringify({
              "client" : "admin",
              "data" : cIndex,
              "imageUrl" : imageFiles[cIndex],
              "test":"test"
              })  
            );
          }
       });

    }else if(msgString.client === "client"){

        allData[msgString.imageid][msgString.id] = {
          "data": msgString.data,
          "data1": msgString.data1,
          "data2": msgString.data2
        }

    }else{
      console.log("Message has no client parsing error data: " + msgString);
    }

    })
  });

var app = express()

app.get('/data', function (req, res) {

    let sum=[];
    let data =[];

    allData.forEach((image,i) => {
    
      let isum=0;
      image.forEach(d=>{
        isum += d.data+d.data1+d.data2;
      });
      sum[i] =isum;
      data[i]=isum;

    });
    let winner = Math.max(...sum);
    console.log(Math.max(...sum));
    
    data.push({
      "winner" : winner,
      "index" : sum.indexOf(winner)
    })
    console.log(data);
    res.json(data);
 })

var publicDir = path.join(__dirname,'/public');
app.use(express.static(publicDir));

app.listen(3000, () => {
   console.log('Listening on port 3000!')
})