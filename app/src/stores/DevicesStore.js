import DevicesService from "../Services/DevicesService";
import { makeObservable, observable, action } from "mobx";
import Screen from "../models/Screen";
import DMX from "../models/DMX";
import MidiInput from "../models/MidiInput";
import MidiOutput from "../models/MidiOutput";

class DevicesStore {

    constructor(RootStore) {
        this.RootStore = RootStore;
        this.DevicesService = new DevicesService(this.RootStore.socket);
        this.currentDevices = [];
        this.devices = [];

        makeObservable(this, {
            currentDevices: observable,
            devices: observable,
            getAllDevices: action,
            getCurrentDevices: action,
            clearDevices: action,
        })
    }

    getCurrentDevices = () => {
        this.DevicesService.getCurrentDevices(devices => {
            this.currentDevices = [];
            devices.map(device => {
                switch(device.type){
                    case "screen":
                        this.currentDevices.push(new Screen(device));
                        break;
                    case "DMX":
                        this.currentDevices.push(new DMX(device));
                        break;
                    case "midi":
                        if(device.action === "input"){
                            this.currentDevices.push(new MidiInput(device));
                        } else if(device.action === "output"){
                            this.currentDevices.push(new MidiOutput(device));
                        }
                        break;
                    default:
                        break;
                }
            });
        });
    }

    getDevicesById = (id) => {
        let devices;
        if(this.devices){
            devices = this.devices.find(d => d.id === id);
        }
        return devices;
    }

    getCurrentDeviceById = id => {
        let devices;
        if(this.currentDevices){
            devices = this.currentDevices.find(d => d.id === id);
        }
        return devices;
    }
 
    getAllDevices = () => {
        this.DevicesService.getAllDevices(devices => {
            this.devices = [];
            devices.map(device => {
                switch(device.type){
                    case "screen":
                        this.devices.push(new Screen({
                            id: device._id,
                            mac: device.mac,
                            title: device.title,
                            type: device.type
                        }));
                        break;
                    case "DMX":
                        this.devices.push(new DMX({
                            id: device._id,
                            deviceName: device.deviceName,
                            title: device.title,
                            type: device.type,
                            lights: device.lights
                        }));
                        break;
                    case "midi":
                        if(device.action === "input"){
                            this.devices.push(new MidiInput({
                                id: device._id,
                                title: device.title,
                                action: device.action,
                                type: device.type,
                                inputs: device.inputs,
                            }));
                        } else if(device.action === "output"){
                            this.devices.push(new MidiOutput({
                                id: device._id,
                                title: device.title,
                                action: device.action,
                                type: device.type
                            }));
                        }
                        break;
                    default:
                        break;
                }
            })
        });
    }

    addADevice = (device) => {
        this.DevicesService.addADevice(device);
    }

    addADMXDevice = (device) => {
        this.DevicesService.addADMXDevice(device)
    }

    clearDevices = () => {
        this.currentDevices = [];
        this.devices = [];
    }; 

}

export default DevicesStore;