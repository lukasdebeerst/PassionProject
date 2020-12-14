import SetsService from "../Services/SetsService";
import Set from "../models/Set";
import { makeObservable, observable, action } from "mobx";

class SetsStore {

    constructor(Rootstore){
        this.Rootstore = Rootstore;
        this.SetsService = new SetsService(Rootstore.socket);
        this.sets = [];

        makeObservable(this, {
            sets: observable,
            getAllSets: action,
            clearSets: action,
        });

    }


    getAllSets =  async () => {
        this.SetsService.getAllSets(sets => {
            sets.map(set => this.sets.push(
                new Set({
                    id: set._id,
                    title: set.title,
                    description: set.description,
                    setlist: set.setlist,
                    devices: set.devices,
                    message: set.message
                })
            ));
        })
    }

    getSetById = id => {
        return this.sets.find(set => set.id === id);
    }

    updateSet = set => {
        this.SetsService.updateSet(set);
        // this.sets.push(set);
    }

    clearSets = () => this.sets = [];

}

export default SetsStore;