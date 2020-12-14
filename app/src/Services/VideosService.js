class VideosService {

    constructor(socket){
        this.socket = socket;
    }

    getAllVideos = cb => {
        this.socket.once("getAllVideos", videos => {
            cb(videos);
        })
    }

}

export default VideosService;