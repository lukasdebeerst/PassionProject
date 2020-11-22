class SegmentsService {

    constructor(socket){
        this.socket = socket;
    }

    loadNewSegment = (songId, segment) => {
        this.socket.emit("loadSegment", songId, segment);
    }

}

export default SegmentsService;