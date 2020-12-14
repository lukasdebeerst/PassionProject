
class SetsService{
    
    constructor(socket){
        this.socket = socket;
    }

    getAllSets = cb => {
        this.socket.once("sets", (sets) => {
            cb(sets);
        });

    }

    updateSet = set => {
        this.socket.emit("updateSet", set);
    }

}

export default SetsService;