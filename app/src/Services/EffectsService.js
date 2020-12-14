class EffectsService {

    constructor(socket){
        this.socket = socket;
    }

    getAllEffects = (cb) => {
        this.socket.once("getAllEffects", effects => {
            cb(effects);
        })
    }

}

export default EffectsService;