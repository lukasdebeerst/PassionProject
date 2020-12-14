import {v4} from "uuid";


class Message {

    constructor({id = v4(), content, device}){
        this.id = id;
        this.content = content;
        this.device = device;
        this.image = "";
    }
}

export default Message;