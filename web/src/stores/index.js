import io from "socket.io-client";
import SetsStore from "./SetsStore";
import { makeObservable, observable, action } from "mobx";
import SegmentsStore from "./SegmentsStore";

class Rootstore {

    constructor(){
        this.socket = io.connect('http://192.168.1.33:4000');
        this.connected = false;
        this.checkConnectivity();
        this.SetsStore = new SetsStore(this);
        this.SegmentsStore = new SegmentsStore(this);

        makeObservable(this, {
            connected: observable,
            checkConnectivity: action,
        });
    }

    checkConnectivity = () => {
        this.socket.on('connect', async () => {
            console.log(`connected: ${this.socket.id}`);
            await this.SetsStore.getAllSets();
            this.connected = true;
        });
        
    }
}

export default Rootstore;
