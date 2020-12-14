const Datastore = require('nedb');

class EffectsStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.effects = new Datastore({filename: './database/effects.db'});
        this.effects.loadDatabase();
    }

    getEffectById = (effect, cb) => {
        this.effects.findOne({title: effect}, (err, doc) => {
            cb(doc);
        });
    }

    getAllEffects = (io) => {
        this.effects.find({}, (err, docs) => {
            io.emit("getAllEffects", docs);
        })
    }

}

module.exports = EffectsStore