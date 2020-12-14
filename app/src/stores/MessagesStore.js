import Message from "../models/Message";
import MessagesService from "../Services/MessagesService";
import { makeObservable, observable, action } from "mobx";


class MessagesStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.Messages = [];
        this.MessagesService =  new MessagesService(this.RootStore.socket);

        makeObservable(this, {
            Messages: observable,
            getMessages: action,
            clearMessages: action
        })

    }

    getMessages = () => {
        this.MessagesService.getMessages(messages => {
            if(messages.length > 1){
                messages.map(message => {
                    this.Messages.push(new Message(message))
                });
            } else {
                this.Messages.push(new Message(messages));
            }
        })
    }

    clearMessages = () => this.Messages = [];

}

export default MessagesStore;