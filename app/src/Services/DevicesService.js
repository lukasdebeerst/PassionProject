

class DevicesService {

    constructor(socket){
        this.socket = socket;
    }

    getCurrentDevices = cb => {
        this.socket.on("currentDevices", (devices) => {
            cb(devices);
        })
    }

    getAllDevices = cb => {
        this.socket.on("devices", (devices) => {
            cb(devices);
        })
    }

    addADevice = device => this.socket.emit("newDevice", device);
    addADMXDevice = device => this.socket.emit("newDMXDevice", device);

 
}

export default DevicesService;