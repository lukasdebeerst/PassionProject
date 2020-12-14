import LightsService from "../Services/LightsServices";
import { makeObservable, observable, action } from "mobx";
import Color from "../models/Color";
import Animation from "../models/Animation";

class LightsStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.LightsService = new LightsService(this.RootStore.socket);
        this.colors = [];
        this.animations = [];

        makeObservable(this, {
            colors: observable,
            animations: observable,
            getAllAnimations: action,
            getAllColors: action,
            resetLights: action,
        })
    }

    getAllColors = () => {
        this.LightsService.getAllColors(colors => {
            colors.map(color => {
                this.colors.push(new Color({
                    id: color._id,
                    name: color.name,
                    midi: color.midi,
                    dmx: color.dmx
                }))
            })
        });
    }

    getAllAnimations = () => {
        this.LightsService.getAllAnimations(animations => {
            animations.map(animation => {
                this.animations.push(new Animation({
                    id: animation._id,
                    name: animation.name,
                    midi: animation.midi,
                }))
            })
        });
    }

    resetLights = () => {
        this.colors = [];
        this.animations = [];
    }

}

export default LightsStore;