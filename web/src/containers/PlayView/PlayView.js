import React from "react";
import {useParams} from "react-router-dom";
import {useStore} from "../../hooks/useStore";

const PlayView = () => {

    const {setId} = useParams();
    const {SetsStore, SegmentsStore} = useStore();
    const set = SetsStore.getSetById(setId);
    SegmentsStore.startSet(set.setlist[0].songId);
    let currentSong = 1;
    console.log(set.setlist[currentSong]);
    



    return (
        <>
        <div>
            <article>
                <section>
                    <h1>{set.title}</h1>
                    <p>{set.setlist[currentSong].title}</p>
                </section>
            </article>
            <article>

            </article>
        </div> 
        </>
    )



}

export default PlayView;