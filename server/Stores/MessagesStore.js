class MessagesStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.Messages = [];
        this.io;
    }

    initSocket = io => {
        this.io = io
        this.io.emit("messages", this.Messages);
    };

    handleDeviceConnection = (type, device) => {
        let content;

        if(type === "connect"){
            if(device.title === "unknown device"){
                content = `Unknown device connected`;
            } else {
                content = `Device ${device.title} is now connected`;
            }
        } else if(type === "disconnect"){
            if(device.title === "unknown device"){
                content = `Unknown device disconnected`;
            } else {
                content = `Device ${device.title} is now disconnected`;
            }
        }   
       
        const message = {content: content, device: device};
        this.Messages.push(message);
        if(this.io){
            this.io.emit("messages", message);
        }
    }


}

module.exports = MessagesStore;