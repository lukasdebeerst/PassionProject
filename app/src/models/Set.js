import * as _ from "lodash";

class Set {

    constructor({id, title, description, setlist, devices, message}){
        this.id = id;
        this.title = title;
        this.description = description;
        this.setlist = setlist;
        this.devices = devices;
        this.message = message;
    }

    getNumberOfSongs = () =>  _.size(this.setlist);;


}

export default Set;