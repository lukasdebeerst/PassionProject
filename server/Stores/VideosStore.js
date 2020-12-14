const Datastore = require('nedb');

class VideosStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.videos = new Datastore({filename: './database/videos.db'});
        this.videos.loadDatabase();
    }

    getVideoById = (id, cb) => {
        let data;
        this.videos.findOne({_id: id}, (err, doc) => {
            cb(doc);
        });
        return data;
    }

    emitAllVideos = (io) => {
        this.videos.find({}, (err, docs) => {
            io.emit("getAllVideos", docs);
        })
    }

}

module.exports = VideosStore;