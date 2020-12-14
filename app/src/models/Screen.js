import {v4} from "uuid";

class Screen{

    constructor({id = v4(), mac, ip, title, socketId = "notConnected", type = "screen"}){
        this.id = id;
        this.mac = mac;
        this.ip = ip;
        this.title = title;
        this.socketId = socketId;
        this.type = type;
    }

}

export default Screen;