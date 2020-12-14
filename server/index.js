const express = require('express');
const app = express();
const fs = require('fs');
const PlayStore = require('./Stores/PlayStore');
const options = {
    key: fs.readFileSync('./localhost.key'),
    cert: fs.readFileSync('./localhost.crt')
};
const server = require('http').createServer(options, app);
const port = 4000;
const io = require('socket.io')(server);


const RootStore = require('./Stores/RootStore');
const Root = new RootStore();
const Midi = Root.Midi;
const Sets = Root.Sets;
const Devices = Root.Devices;
const Messages = Root.Messages;
const Songs = Root.Songs;
const Videos = Root.Videos;
const Effects = Root.Effects;
const Lights = Root.Lights;
const Play = Root.Play;

Midi.startMidiPort();
Midi.listenForMidiDevices();
Devices.listenForUSBDevices(io);

io.on('connect', socket => {

    Root.SetSockets(io);

    socket.on('device', device => {
        if(device === "app"){
            Sets.getSets(socket, io);
            Devices.emitCurrentDevices(io);
            Devices.emitAllDevices(io);
            Messages.initSocket(io);
            Effects.getAllEffects(io);
            Videos.emitAllVideos(io);
            Lights.emitColors(io);
            Lights.emitAnimations(io);
        } else if(device === "screen"){
            Devices.getUserData(socket, io);
        }
    });    
    
    socket.on("getSongByMidi", message => {
        Songs.emitSongbyMidi(message, io)
    });

    socket.on("newDevice", device => {
        Devices.addADevice(device, io);
    });

    socket.on("newDMXDevice", device => {
        Devices.addADMXDevice(device, io);
    })

    socket.on("handleSongChange", (song) => {
        Songs.handleSongChange(song, io)
    });
    
    socket.on("updateSet", set => {
        Sets.updateSet(set);
    });
    
    socket.on("getAllSongs", bool => {
        Songs.getAllSongs(io);
    } );

    socket.on("handleStop", bool => {
        Play.handleStop();
    });

    socket.on('signal', (peerId, signal) => {
        io.to(peerId).emit('signal', peerId, signal, socket.id);
    });

    socket.on('dynamicEffect', (socketId, percent) => {
        socket.to(socketId).emit('dynamicEffect', percent);
    })

    socket.once('disconnect', () => {
        Devices.handleDisconnect(socket, io);
    });

});


app.use(express.static('./'));

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});