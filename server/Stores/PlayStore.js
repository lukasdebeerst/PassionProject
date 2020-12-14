class PlayStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.currentSet = {};
        this.currentSetlist = {};
        this.devices = [];
        this.currentSong = {};
        this.currentSegment = {};
        this.livestream = {};
        this.sender = "";

    }

    initSet = (midi) => {
        this.RootStore.Sets.getSetByMidi(midi, (set) => {
            this.currentSet = set[0];
            this.currentSetlist = this.currentSet.setlist ;
            this.getDevices();
            this.initSong();
        });

        
    }

    initSong = (message) => {
        if(!message){
            message = this.currentSetlist[0].midi;
        }
        this.RootStore.Songs.getSongByMidi(message, song => {
            this.currentSong = song;
            this.initSegment([195,0])
        })
    }
    
    initSegment = message => {
        this.currentSegment = this.currentSong.segments[message[1]];
        this.currentSegment.media.map(async segment => {
            const device = this.devices.find(d => d.id === segment.device_id);
            if(segment.device_id === "6bf7a98d-7f63-4cdf-b2b1-eac4fe7373b5"){
                segment.lights.map(light => {
                    this.RootStore.Lights.loadColorByMidi(light.color, light.light, segment.device_id);
                    this.RootStore.Lights.loadAnimationByMidi(light.animation, light.light, segment.device_id);
                })        
            }
            if(device){
                if(segment.src === 'video'){
                    this.RootStore.Videos.getVideoById(segment.src_id, video => {
                        this.RootStore.io.to(device.socketId).emit('video', video.path);
                     
                    });
                }
                if(segment.src === 'midi'){
                    if(segment.action === 'output'){
                        this.RootStore.Midi.handleMidiOutput(device, segment.message);
                    } else if(segment.action === 'input'){

                    }
                }
                if(segment.src === 'live'){
                    if(this.livestream){
                        this.RootStore.io.to(device.socketId).emit("signal", this.livestream, device.socketId, this.sender);
                    }
                }
                if(segment.src === 'DMX'){
                    segment.lights.map(light => {
                        this.RootStore.Lights.loadColorByMidi(light.color, light.light, segment.device_id);
                        this.RootStore.Lights.loadAnimationByMidi(light.animation, light.light, segment.device_id);
                    })        
                }
                if(segment.effect_id){
                    this.RootStore.Effects.getEffectById(segment.effect_id, (effect) => {
                        this.RootStore.io.to(device.socketId).emit('effect', effect.title);
                    })
                }
            }
        });
        this.RootStore.io.emit('playData', {
            currentSet: this.currentSet,
            currentSetlist: this.currentSetlist,
            currentSong: this.currentSong,
            currentSegment: this.currentSegment
        });
    }

    getDevices = () => {
        if(this.devices){
            this.devices = [];
        }
        const ids = this.currentSet.devices;
        ids.map(id => {
            const device = this.RootStore.Devices.getDeviceById(id);
            if(device){
                this.devices.push(device);
            }
        });
    }

    handleBank = (action) => {
        let segmentMessage;
        if(action === "+"){
            segmentMessage =  this.currentSegment.message + 1;
        } else if(action === "-"){
            segmentMessage =  this.currentSegment.message - 1;
        }
        if(segmentMessage > -1 && segmentMessage < this.currentSong.segments.length){
            this.initSegment([195, segmentMessage]);  
        } else {
            const songInSetlist = this.currentSet.setlist.find(song => {
                return song.midi[1] === this.currentSong.midi[1]
            });
            const nextSong = this.currentSet.setlist[songInSetlist.number + 1];
            if(nextSong){
                this.initSong(nextSong.midi);
            }
        }
    }

    handleStop = () => {
        this.RootStore.io.emit("handleStop", true);
        this.RootStore.Lights.handleStop();
    }

    handleLivestream = (data, receiver, sender) => {
        this.livestream = data;
        this.sender = sender;

        this.RootStore.io.to(receiver).emit("signal", data, receiver, this.sender);
    }

}


module.exports = PlayStore;