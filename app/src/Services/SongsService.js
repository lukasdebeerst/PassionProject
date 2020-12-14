class SongsService {

    constructor(socket){
        this.socket = socket;
    }

    getSongByMidi = (message, cb) => {
        this.socket.emit("getSongByMidi", message);
        this.socket.once("SongByMidi", (data) => {
            cb(data);
        })
    }

    getAllSongs = cb => {
        this.socket.emit("getAllSongs", true);
        this.socket.on("getAllSongs", songs => {
            cb(songs);
        })
    }
}

export default SongsService;