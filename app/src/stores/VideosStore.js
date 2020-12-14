import VideosService from "../Services/VideosService";
import { makeObservable, observable, action } from "mobx";
import Video from "../models/Video";


class VideosStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.videoService = new VideosService(this.RootStore.socket);
        this.videos = [];

        makeObservable(this, {
            videos: observable,
            getAllVideos: action,
            clearVideos: action,
        })
    }

    getAllVideos = () => {
        this.videoService.getAllVideos(videos => {
            videos.map(video => {
                this.videos.push(new Video({
                    id: video._id,
                    title: video.title,
                    path: video.path
                }))
            })
        });

    }

    getVideoById = (id) => {
        return this.videos.find(v => v.id === v);
    }

    clearVideos = () => this.videos = [];

}

export default VideosStore;