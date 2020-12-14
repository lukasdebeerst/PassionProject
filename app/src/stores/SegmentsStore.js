import SegmentsService from "../Services/SegmentsService";

class SegmentsStore {

    constructor(Rootstore){
        this.Rootstore = Rootstore;
        this.segments = [];
        this.SegmentService = new SegmentsService(Rootstore.socket);
    }

    handleSongChange = (song) => {
        this.SegmentService.handleSongChange(song);
    }


    
}

export default SegmentsStore;