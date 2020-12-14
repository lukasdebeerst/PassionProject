class MessagesService {

    constructor(socket){
        this.socket = socket
    }

    getMessages = cb => {
        this.socket.on("messages", messages => cb(messages));
    }

}

export default MessagesService;