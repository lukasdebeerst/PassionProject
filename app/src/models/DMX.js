import {v4} from "uuid";

class DMX {

    constructor({id= v4(), deviceName, title, type, lights = []}){
        this.id = id;
        this.deviceName = deviceName;
        this.title = title;
        this.type = type;
        this.lights = lights;
    }

}

export default DMX;