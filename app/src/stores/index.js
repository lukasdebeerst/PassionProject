import io from "socket.io-client";
import SetsStore from "./SetsStore";
import { makeObservable, observable, action } from "mobx";
import SegmentsStore from "./SegmentsStore";
import PlayStore from "./PlayStore";
import DevicesStore from "./DevicesStore";
import UiStore from "./UiStore";
import MessagesStore from "./MessagesStore";
import SongsStore from "./SongsStore";
import VideosStore from "./VideosStore";
import EffectsStore from "./EffectsStore";
import LightsStore from "./LightsStore";

class Rootstore {

    constructor() {
        this.socket = io.connect('http://192.168.1.56:4000');
        this.midi = {}
        this.connected = false;
        this.checkConnectivity();
        this.SetsStore = new SetsStore(this);
        this.SegmentsStore = new SegmentsStore(this);
        this.PlayStore = new PlayStore(this);
        this.DevicesStore = new DevicesStore(this);
        this.UiStore = new UiStore(this);
        this.MessagesStore = new MessagesStore(this);
        this.SongsStore = new SongsStore(this);
        this.VideosStore = new VideosStore(this);
        this.EffectsStore = new EffectsStore(this);
        this.LightsStore = new LightsStore(this);

        makeObservable(this, {
            connected: observable,
            midi: observable,
            checkConnectivity: action,
            getMidiOutput: action,
        });
    }

    checkConnectivity = () => {
        this.socket.on('connect', async () => {
            this.socket.emit('device', "app");
            await this.SetsStore.getAllSets();
            await this.getMidiOutput();
            await this.DevicesStore.getCurrentDevices();
            await this.DevicesStore.getAllDevices();
            await this.MessagesStore.getMessages();
            await this.VideosStore.getAllVideos();
            await this.EffectsStore.getAllEffects();
            await this.SongsStore.getAllSongs();
            await this.LightsStore.getAllColors();
            await this.LightsStore.getAllAnimations();
            this.connected = true;

            this.socket.on('signal', async (myId, signal, peerId) => {
                if (this.PlayStore.peer) {
                    this.PlayStore.peer.signal(signal);
                } else if (signal.type === 'offer') {
                  this.Playstore.checkLivestream();
                  this.PlayStore.peer.signal(signal);
                }
            })
        });
        this.socket.on('disconnect', () => {
            this.SetsStore.clearSets();
            this.DevicesStore.clearDevices();
            this.MessagesStore.clearMessages();
            this.LightsStore.resetLights();
            this.VideosStore.clearVideos();
            this.EffectsStore.clearEffects();
            this.connected = false;
        })
        
    }

    getMidiOutput = () => {
        navigator.requestMIDIAccess().then((midi) => {
            const outputs = midi.outputs.values();
            for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
              if(output.value.name === "app"){
                this.midi = output.value;
              }
            }
        });

    }
}

export default Rootstore;
