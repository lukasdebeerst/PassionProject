import React from "react";
import {useParams} from "react-router-dom";
import {useStore} from "../../hooks/useStore";
import {Link } from 'react-router-dom';
import Style from "./Set.module.css"

const Set = () => {

    const {id} = useParams();
    const {SetsStore} = useStore();
    const set = SetsStore.getSetById(id);

    return (
        <>

        <article className={Style.container} >
            <section>
                <h1>{set.title}</h1>
                <p>{set.getNumberOfSongs()} Songs</p>
                <p>{set.description}</p>
                <Link to={`/playview/${set.id}`}>Start Set</Link>
            </section>
            <section>
                <h2>Start from:</h2>
                {set.setlist.map((song) => (
                    <>  
                    <p key={song.songId}>{`${song.number}. ${song.title}`}</p>
                    </>
                ))}
            </section>
        </article>
        </>    
    )
}

export default Set;