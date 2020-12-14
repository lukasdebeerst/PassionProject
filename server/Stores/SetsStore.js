const Datastore = require('nedb');
const DevicesStore = require('./DevicesStore');

class SetsStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.sets = new Datastore({filename: './database/sets.db'});
        this.sets.loadDatabase();
    }

    getSets = (io) => {
        this.sets.find({}, async (err, docs) => {
            io.emit("sets", docs);
        });
    }

    getSetByMidi = (message, cb) => {
        this.sets.find({message: message}, (err, doc) => {
            cb(doc);
        })
    }

    updateSet = (set) => {
        let cnt;

        this.sets.count({}, function (err, count){
            cnt = count;
        })
        
        this.sets.findOne({_id: set.id}, (err, doc) => {
            if(doc){
                this.sets.update({_id: set.id}, {
                    _id: set.id,
                    title: set.title,
                    description: set.description,
                    devices: set.devices,
                    setlist: set.setlist,
                    message: set.message,
                }, {}, function (err, numReplaced) {});
                this.RootStore.Songs.checkForNewSongs(set.setlist);
            } else {
                this.sets.insert({
                    _id: set.id,
                    title: set.title,
                    description: set.description,
                    devices: set.devices,
                    setlist: set.setlist,
                    message: [193, cnt]
                },function (err, numReplaced) {})
            }     
        })
    }  

}

module.exports = SetsStore;