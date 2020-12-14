import PlayStore from "../stores/PlayStore";

class PlayService {

    constructor(socket){
        this.socket = socket;
    }

    handleStop = () => {
        this.socket.emit("handleStop", true);
    }

}

export default PlayService;