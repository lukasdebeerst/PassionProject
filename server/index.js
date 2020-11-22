const express = require('express');
const app = express();
const fs = require('fs');
const { getPackedSettings } = require('http2');
const options = {
    key: fs.readFileSync('./localhost.key'),
    cert: fs.readFileSync('./localhost.crt')
};
const server = require('http').createServer(options, app);
const port = 4000;
const io = require('socket.io')(server);
const find = require('local-devices');
const Datastore = require('nedb');

let currentDevices = [];
let messages = [];

//initalize databses
let db = {
  devices: new Datastore({filename: './database/devices.db'}),
  videos: new Datastore({filename: './database/videos.db'}),
  effects: new Datastore({filename: './database/effects.db'}),
  sets: new Datastore({filename: './database/sets.db'}),
  songs: new Datastore({filename: './database/songs.db'})
};

db.devices.loadDatabase();
db.videos.loadDatabase();
db.effects.loadDatabase();
db.sets.loadDatabase();
db.songs.loadDatabase(function(err){
    console.log(err);
});


io.on('connect', socket => {
    
    getVideos();
    getEffects();
    getSets();
    getUserData(socket);

    socket.once('disconnect', () => {
        console.log('client just disconnected', socket.id);
        handleDisconnect(socket);
    });

    socket.on("data", data => {
        console.log(data);
        io.to(data.socketId).emit("data", data.content);
    });

    socket.on("sendVideo", data => {
        console.log(data);
        sendVideo(data)
    });

    socket.on("sendEffect", data => {
        console.log(data);
        sendEffect(data)
    });

    socket.on("signal", (data, receiver, sender) => {
        console.log("signal", receiver);
        io.to(receiver).emit("signal", data, receiver, sender);
    });

    socket.on("loadSegment", (songId, segment) => {
        handleSegment(songId, segment);
    });

    io.emit("currentDevices", currentDevices);
    io.emit("messages", messages);

});

const getUserData = async socket  => {
    const remoteAddress = socket.conn.remoteAddress;
    if(remoteAddress !== "::1" && remoteAddress !== '::ffff:127.0.0.1' && remoteAddress !== '::ffff:192.168.1.33') {
        const ip = remoteAddress.substring(7);
        console.log(ip);
        let mac;
        await find(ip).then(device => {
            console.log("device", device);
            mac = device.mac
        });
        
        await handleNewDevice(socket, ip, mac);
    }
}

const handleNewDevice = (socket, ip, mac) => {
    db.devices.findOne({"mac": mac}, (err, doc) => {
        if(doc){
            currentDevices.push({
                id: doc._id,
                mac: doc.mac,
                ip: ip,
                title: doc.title,
                socketId: socket.id
            });
            messages.push(`${doc.title} (${doc.mac}) is now connected`);
            console.log(currentDevices);
        } else {
            //handle new device
            currentDevices.push({
                ip: ip,
                title: "unknown device",
                socketId: socket.id,
                mac: mac,
            });
            messages.push(`an undefined device (${mac}) is now connected`);
            console.log(currentDevices);
        }
        
        console.log(messages);
        io.emit("currentDevices", currentDevices);
        io.emit("messages", messages);
        if(err){
            console.log(err);
        }
    });
}

const handleDisconnect = socket => {
    const device = currentDevices.find(device => device.socketId === socket.id)
    if(device){
        currentDevices = currentDevices.filter(device => device.socketId !== socket.id);
        console.log(currentDevices);
        if(device.title === "unknown device"){
            messages.push(`an undefined device (${device.ip}) is disconnected`);
        } else {
            messages.push(`${device.title} (${device.ip}) is disconnected`);
        }
        io.emit("messages", messages);
        io.emit("currentDevices", currentDevices);

    }

}

const getVideos = () => {
    db.videos.find({}, function(err, docs){
        if(docs){
            io.emit("videos", docs);
        } else if(err){
            console.log(err);
        }
    });
}

const getEffects = () => {
    db.effects.find({}, function(err, docs){
        if(docs){
            io.emit("effects", docs);
        } else if(err){
            console.log(err);
        }
    });
}

const sendVideo = (id, socketId) => {
    console.log(id, socketId);
    db.videos.findOne({_id: id}, function(err, doc){
        console.log(doc);
        io.to(socketId).emit("playVideo", doc.path);
    })
};

const sendEffect = (effectId, socketId) => {
    db.effects.findOne({_id: effectId}, (err, doc) => {
        io.to(socketId).emit("playEffect", doc.title);
    })
};

const getSets = () => {
    db.sets.find({}, function(err, docs){
        io.emit("sets", docs);
        if(err){
            console.log(err);
        }
    });
}

const handleSegment = (songId, segm) => {
    console.log("songId", songId);
    db.songs.findOne({songId: songId}, async (err, doc) => {
        if(err){
            console.log(err);
        }

        const segments = doc.segments[segm];
        console.log(segments);
        segments.map(async (segment) => {
           const socketId = await getSocketId(segment.deviceId);
           await sendVideo(segment.srcId, socketId);
        //    sendEffect(segment.effect, socketId);
        });
    });
}

const getSocketId = (deviceId) => {
    const device = currentDevices.find(currrentDevice => currrentDevice.id === deviceId);
    if(device){
        return device.socketId;
    } else {
        console.log("device is not connected");
    }
}


app.use(express.static('./'));

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});