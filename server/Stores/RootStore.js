const DevicesStore = require("./DevicesStore");
const EffectsStore = require("./EffectsStore");
const MidiStore = require("./MidiStore");
const SetsStore = require("./SetsStore");
const SongsStore = require("./SongsStore");
const VideosStore = require("./VideosStore");
const PlayStore = require("./PlayStore");
const MessagesStore = require("./MessagesStore");
const LightStore = require("./LightStore");

class RootStore {

    constructor(){
        this.io = {};
        this.Devices = new DevicesStore(this);
        this.Midi = new MidiStore(this);
        this.Sets = new SetsStore(this);
        this.Play = new PlayStore(this);
        this.Effects = new EffectsStore(this);
        this.Songs = new SongsStore(this);
        this.Videos = new VideosStore(this);
        this.Messages =  new MessagesStore(this);
        this.Lights = new LightStore(this);
    }

    SetSockets = io => this.io = io;

}

module.exports = RootStore;