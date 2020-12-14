const DMX = require('dmx');
const Datastore = require('nedb');

class LightStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.dmx = new DMX();
        try {
            this.universe = this.dmx.addUniverse('universe', 'enttec-usb-dmx-pro', '/dev/cu.usbserial-EN300845');
        } catch(error){
            console.log(error);
        }   
        // this.universe = this.dmx.addUniverse('universe', 'enttec-usb-dmx-pro','/dev/serial/by-id/usb-ENTTEC_DMX_USB_PRO_EN300845-if00-port0');
        this.colors = new Datastore({filename: './database/lightsColor.db'});
        this.animations = new Datastore({filename: './database/lightsAnimation.db'});
        this.colors.loadDatabase();
        this.animations.loadDatabase();
        this.animation = new DMX.Animation();
        this.play = true;
    }

    emitColors = (io) => {
        this.colors.find({}, (err, doc) => {
            io.emit("light_colors", doc);
        })
    }

    emitAnimations = (io) => {
        this.animations.find({}, (err, doc) => {
            io.emit("light_animations", doc);
        })
    }

    loadColorByMidi = (midi, light_id, device_id) => {
        this.RootStore.Devices.getLightById(device_id, light_id, light => {
            this.colors.findOne({midi: midi}, (err, doc) => {
                const ColorChannel = light.color;
                const DimmerChannel = light.dimmer;
                this.universe.update({[ColorChannel]: doc.dmx, [DimmerChannel]: 255});
            })
        });
        
    }

    loadAnimationByMidi = (midi, light_id, device_id) => {
        this.RootStore.Devices.getLightById(device_id, light_id, light => {
            this.animations.findOne({midi: midi}, (err, doc) => {
                if(doc){
                    switch(doc.midi[1]){
                        case 0: 
                            this.handleFadeInAndOut(light.dimmer); 
                            break;
                        case 1: 
                            this.handleSearchForLife(light.rotation, light.inclination); 
                            break;
                        default:
                            break;   
                    }
                } else {
                    clearTimeout(this.animationTimeoutId);
                }
               
            })
        });
    }

    handleSearchForLife = (rotation, inclination) => {
        const animation = new DMX.Animation().add({
            [rotation]: 255,
            [inclination]: 0,
          }, 2000).add({
            [rotation]: 0,
            [inclination]: 255,
          }, 2000).runLoop(this.universe);
    }

    handleFadeInAndOut = (dimmer) => {
        const animation = new DMX.Animation().add({
          [dimmer]: 255,
        }, 1000).add({
          [dimmer]: 0,
        }, 1000).runLoop(this.universe);
        setTimeout(() => {
            animation.stop()
        }, 60000)
    }

    handleStop = () => {
        this.play = false;
    }



}

module.exports = LightStore;
