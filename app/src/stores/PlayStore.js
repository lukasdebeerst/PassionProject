import { makeObservable, observable, action } from "mobx";
import PlayService from "../Services/PlayService";
import SimplePeer from "simple-peer";
import DecibelMeter from 'decibel-meter'



class PlayStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.PlayService = new PlayService(this.RootStore.socket);
        this.currentSong = "";
        this.segments = "";
        this.currentSegments = "";
        this.currentSetlist = [];
        this.peer = null;
        this.meter = {};
        
        makeObservable(this, {
            currentSegments: observable,
            currentSong: observable,
            currentSetlist: observable,
            segments: observable,
            meter: observable,
            listenToPlayData: action,
            handleDynamicEffect: action,
            handleStop: action
        })
    }

    listenToPlayData = () => {
        this.RootStore.socket.on('playData', (data) => {
            this.currentSong = data.currentSong;
            this.currentSetlist = data.currentSetlist;
            this.currentSegments = data.currentSegment;
        })
    }


    handleStop = () => {
        //handle Stop
        // this.meter.stopListening();
        this.PlayService.handleStop();
    }

    checkLivestream = (song) => {
        song.segments.map(segment => {
            segment.media.map(async d => {
                if(d.src === "live"){
                    const feed = await navigator.mediaDevices.getUserMedia({ audio: false, video: true})
                        const device = this.RootStore.DevicesStore.getCurrentDeviceById(d.device_id);
                        if(device){

                            const servers = {
                                iceServers: [{
                                  urls: 'stun:stun.l.google.com:19302'
                                }]
                            };

                            this.peer = new SimplePeer({ initiator: true, stream: feed });
                            this.peer.on('signal', data => {
                                this.RootStore.socket.emit('signal', device.socketId, data);
                            });

                            
                        }
                    
                }
            })
        })
    }

    handleDynamicEffect = (song) => {
        song.segments.map(segment => {
            segment.media.map(async d => {
                switch(d.dynamic){
                    case "decibel":
                        const currentD = this.RootStore.DevicesStore.getCurrentDeviceById(d.device_id);
                        let meter = new DecibelMeter('meter');
                        meter.sources.then(sources => {
                            meter.connect(sources[0])
                        });
                        meter.listen();
                        meter.on('sample', (dB, percent, value) => this.RootStore.socket.emit("dynamicEffect", currentD.socketId, percent));
                        break;
                    case "BPM":
                        //comming soon
                        break;
                    default:
                        break;
                }
            })
        })
    }


}

export default PlayStore;