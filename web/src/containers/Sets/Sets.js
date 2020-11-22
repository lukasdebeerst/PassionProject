import React from "react";
import {useStore} from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";

const Sets = observer(() => {


    const {SetsStore} = useStore();
    const sets = SetsStore.sets;

    
    return (
        <>
        {sets.map(set => (
            <>
            <Link  to={`/set/${set.id}`}>
                <div key={set.id}>
                    <p>{set.title}</p>
                    <p>{set.description}</p>
                </div>
            </Link>
            </>
        ))}
        </>
    )

});

export default Sets;