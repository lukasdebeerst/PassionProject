const midi = require('midi');
const navigator = require('web-midi-api');
const events = require('events');
const DMX = require('dmx');

const Datastore = require('nedb');

class MidiStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.messages = new Datastore({filename: './database/midi.db'});
        this.messages.loadDatabase();
        this.midiInputs = [];
        this.midiOutputs = [];
    }


    startMidiPort = () => {
        const input = new midi.input();
        input.openVirtualPort("app");
    
        input.on('message', (deltaTime, message) => {
            this.handleAction(message);
        });

    }

   

    listenForMidiDevices = () => {
        navigator.requestMIDIAccess().then((midi, error) => {
            const inputs = midi.inputs.values();
            for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                this.midiInputs.push(input.value);
                this.RootStore.Devices.handleMidiInputDevice(input.value);
            }

            const outputs = midi.outputs.values();
            for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
                this.midiOutputs.push(output.value);
                this.RootStore.Devices.handleMidiOutputDevice(output.value);
            }

            this.listenForMidiInputs();
        });
    }

    listenForMidiInputs = () => {
        this.midiInputs.forEach(input => {
            input.onmidimessage = ({data}) => {
                const message = Array.from(data);
                this.handleAction(message);
            };
        }) 
    }

    handleAction = async (midi) => {
        const message = midi;
        if(midi[0] === 193){
            midi = 193;
        }
        this.messages.findOne({message: midi}, (err, doc) => {
            if(doc){
                switch (doc.action){
                    case "startSet":
                        this.RootStore.Play.initSet(message);
                        break;
                    case "bankUp":
                        this.RootStore.Play.handleBank("+");
                        break;
                    case "bankDown":
                        this.RootStore.Play.handleBank("-");
                        break;
                    default:
                        break;
                }
            }
            
        });
    }

    handleMidiOutput = (device, message) => {
        const output = this.midiOutputs.find(o => o.name === device.title);
        if(output){
            output.send(message);
        }
    }


}

module.exports = MidiStore;