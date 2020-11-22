import SegmentsService from "../Services/SegmentsService";

class SegmentsStore {

    constructor(Rootstore){
        this.Rootstore = Rootstore;
        this.segments = [];
        this.SegmentService = new SegmentsService(Rootstore.socket);
    }

    startSet = async (songId) => {
        await this.SegmentService.loadNewSegment(songId, 0);


    }
 
    loadAllSegmentsOfSet = (setId) => {
        const Songs = this.Rootstore.SetsStore.getSongsIdFromSet(setId);
        this.SegmentService.getSegmentsBySet(setId);
    }
}

export default SegmentsStore;