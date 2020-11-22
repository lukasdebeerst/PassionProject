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
        });

    }

    getAllSets =  async () => {
        console.log("getallsets");
        this.SetsService.getAllSets(sets => {
            sets.map(set => this.sets.push(
                new Set({
                    id: set._id,
                    title: set.title,
                    description: set.description,
                    setlist: set.setlist
                })
            ));
            console.log(this.sets);
        })
    }

    getSetById = id => {
        return this.sets.find(set => set.id === id);
    }

    


}

export default SetsStore;