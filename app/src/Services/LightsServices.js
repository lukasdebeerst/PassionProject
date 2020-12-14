class LightsService {

    constructor(socket){
        this.socket = socket;
    }

    getAllColors = cb => {
        this.socket.once("light_colors", colors => cb(colors));
    }

    getAllAnimations = cb => {
        this.socket.once("light_animations", animations => cb(animations));
    }

}

export default LightsService;