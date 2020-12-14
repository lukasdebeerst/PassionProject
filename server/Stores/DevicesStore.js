const Datastore = require('nedb');
const find = require('local-devices');
const usbDetect = require('usb-detection');;

class DevicesStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.devices = new Datastore({filename: './database/devices.db'});
        this.devices.loadDatabase();
        this.currentDevices = [];
    }

    getDeviceById = (deviceId) => {
        const device = this.currentDevices.find(currrentDevice => currrentDevice.id === deviceId);
        if(device){
            return device;
        }
    }

    emitAllDevices = (io) => {
        this.devices.find({}, (err, docs) => {
            io.emit("devices", docs);
        });
    }

    getUserData = async (socket, io) => {
        const remoteAddress = socket.conn.remoteAddress;
        const ip = remoteAddress.substring(7);
        let mac;
        await find(ip).then(device => mac = device.mac);
        await this.handleNewDevice(socket, ip, mac, io);
    }

    handleNewDevice = (socket, ip, mac, io) => {
        this.devices.findOne({"mac": mac}, (err, doc) => {
            if(doc){
                const device = {
                    id: doc._id,
                    mac: doc.mac,
                    ip: ip,
                    title: doc.title,
                    socketId: socket.id,
                    type: doc.type,
                }
                this.currentDevices.push(device);
                this.RootStore.Messages.handleDeviceConnection("connect", device);
            } else {
                const device = {
                ip: ip,
                title: "unknown device",
                socketId: socket.id,
                mac: mac,
                type: "screen"
                }
                this.currentDevices.push(device);
                this.RootStore.Messages.handleDeviceConnection("connect",device);
            }
            
            io.emit("currentDevices", this.currentDevices);
        });
    }

    addADevice = (device, io) => {
        this.devices.insert({
           mac: device.mac,
           title: device.title,
           type: "screen",
        });
        let newDev = {};
        newDev.id = device.socketId;
        this.emitAllDevices(io);
        this.currentDevices = this.currentDevices.filter(d => d.mac !== device.mac);
        this.handleNewDevice(newDev, "", device.mac, io);
    }

    addADMXDevice = (device) => {
        const data = {
            _id: device.id,
            deviceName: device.deviceName,
            title: device.title,
            type: device.type,
            lights: device.lights
        }
        this.devices.find({_id: device.id},(err, doc) => {
            if(doc.length > 0){
                this.devices.update({_id: data._id}, data, {}, (err, doc) => {console.log(doc); console.log(err)});
            } else {
                this.devices.insert(data);
            }
        })
    }

    getLightById = (device, light, cb) => {
        this.devices.findOne({_id: device}, (err, doc) => {
            cb(doc.lights.find(l => l._id === light));
        });
    }

    handleMidiInputDevice = (device) => {
        this.devices.findOne({title: device.name, action: "input"},(err, doc) => {
            if(doc){
                this.currentDevices.push({
                    id: doc._id,
                    title: doc.title,
                    action: doc.action,
                    type: doc.type,
                    inputs: doc.inputs
                })
            } 
        })
        
    }

    handleMidiOutputDevice = (device) => {
        this.devices.findOne({title: device.name, action: "output"},(err, doc) => {
            if(doc){
                this.currentDevices.push({
                    id: doc._id,
                    title: doc.title,
                    action: doc.action,
                    type: doc.type,
                })
            } 
        })
    }

    handleUsbDevice = (device) => {
        switch(device.deviceName){
            case "DMX USB PRO":
                this.handleNewDMXDevice(device);
                break;
            default:
                break;
        }
    }

    listenForUSBDevices = async (io) => {
        usbDetect.find((err, devices) => {
            devices.map(device => {
            this.handleUsbDevice(device, io);
        }); 
    });
    }

    handleNewDMXDevice = (device) => {
        this.devices.findOne({deviceName: device.deviceName},(err, doc) => {
            if(doc){
               this.currentDevices.push({
                    id: doc._id,
                    deviceName: doc.deviceName,
                    title: doc.title,
                    type: doc.type,
                    lights: doc.lights 
               }); 
            } else {
                const newDevice = {
                    deviceName: device.deviceName,
                    title: device.deviceName,
                    type: "DMX"
                }
                this.currentDevices.push(newDevice);
            }
        })
    } 

    handleDisconnect = (socket, io) => {
        const device = this.currentDevices.find(device => device.socketId === socket.id)
        if(device){
            this.currentDevices = this.currentDevices.filter(device => device.socketId !== socket.id);
            this.RootStore.Messages.handleDeviceConnection("disconnect", device);
        }
    }

    emitCurrentDevices = io => io.emit("currentDevices", this.currentDevices);

}

module.exports = DevicesStore;