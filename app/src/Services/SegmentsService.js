class SegmentsService {

    constructor(socket){
        this.socket = socket;
    }

    loadNewSegment = (songId, segment) => {
        this.socket.emit("loadSegment", songId, "intro");
    }

    handleSongChange = (song) => {
        this.socket.emit("handleSongChange", song);
    }

}

export default SegmentsService;