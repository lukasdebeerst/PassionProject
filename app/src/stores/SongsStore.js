import SongsService from "../Services/SongsService";
import { makeObservable, observable, action } from "mobx";
import Song from "../models/Song";

 
class SongsStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.SongsService = new SongsService(this.RootStore.socket);
        this.songs = [];

        makeObservable(this, {
            songs: observable,
            getAllSongs: action,
            addSongs: action,
        })
    }

    getSongByMidi = (message, cb) => {
        this.SongsService.getSongByMidi(message, data => {
            cb(data);
        });
    }
    
    addSongs = (songs) => {
        songs.map(song => {
            if(!this.songs.find(s => s.midi[1] === song.midi[1])){
                this.songs.push(song);
            }
        })
    }

    getAllSongs = () => {
        this.SongsService.getAllSongs(songs => {
            songs.map(song => {
                this.songs.push(new Song({
                    title: song.title,
                    midi: song.midi,
                    id: song._id
                }));
            })
            
        })
    }

    getNewMessage = () => {
        let values = [];
        this.songs.map(song => {
            values.push(song.midi[1]);
        });
        const message = Math.max(...values) + 1;
        return message
    }
}

export default SongsStore;