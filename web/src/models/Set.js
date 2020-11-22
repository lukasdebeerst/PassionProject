import * as _ from "lodash";

class Set {

    constructor({id, title, description, setlist}){
        this.id = id;
        this.title = title;
        this.description = description;
        this.setlist = setlist;
    }

    getNumberOfSongs = () =>  _.size(this.setlist);;


}

export default Set;