const Datastore = require('nedb');

class SongsStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.songs = new Datastore({filename: './database/songs.db'});
        this.songs.loadDatabase(); 
    }

    getSongByMidi = (message, cb) => {
        this.songs.findOne({midi: message}, (err, doc) => {
            cb(doc);
        });
    }

    emitSongbyMidi = (message, io) => {
        this.getSongByMidi(message, (data) => {
            io.emit("SongByMidi", data);
        })
    }

    getAllSongs = io => {
        this.songs.find({},(err, doc) => {
            io.emit("getAllSongs", doc);
        })
    }

    handleSongChange = (song, io) => {
        this.songs.update({_id: song._id}, song, {}, function(err, doc){
            if(err){
                console.log(err);
            }
        });
    }

    checkForNewSongs = setlist => {
        setlist.map(song => {
            this.songs.findOne({midi: song.midi}, (err, doc) => {
                if(!doc){
                    this.songs.insert({
                        title: song.title,
                        midi: song.midi,
                        segments: []
                    })
                }
            })
        });
    }

}

module.exports = SongsStore;