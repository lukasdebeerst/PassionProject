import { makeObservable, observable, action } from "mobx";
import Effect from "../models/Effect";
import EffectsService from "../Services/EffectsService";


class EffectsStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.EffectsService = new EffectsService(this.RootStore.socket);
        this.effects = [];

        makeObservable(this, {
           effects: observable,
           getAllEffects: action,
           clearEffects: action 
        })
    }

    getAllEffects = () => {
        this.EffectsService.getAllEffects(effects => {
            effects.map(effect => {
                this.effects.push(new Effect({
                    id: effect._id,
                    title: effect.title,
                }))
            })
        })
    }

    clearEffects = () => this.effects = [];

}

export default EffectsStore;