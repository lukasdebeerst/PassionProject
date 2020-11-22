
class SetsService{
    
    constructor(socket){
        this.socket = socket;
    }

    getAllSets = cb => {
        this.socket.on("sets", (sets) => {
            cb(sets);
        });

    }

}

export default SetsService;