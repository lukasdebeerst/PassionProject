import React, {useState} from "react";
import {useStore} from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";
import Set from "../../components/Set/Set";
import {toJS} from "mobx";
import Style from "./Sets.module.css";
import arrow_left from "../../assets/arrow_left.png";
import arrow_right from "../../assets/arrow_right.png";

const Sets = observer(() => {

    const [currentSet, setCurrentSet] = useState(0);
    const {SetsStore} = useStore();
    const sets = toJS(SetsStore.sets);
    
    const handlePrevious = () => {
        setCurrentSet(currentSet => currentSet - 1);
    }

    const handleNext = () => {
        setCurrentSet(currentSet => currentSet + 1);
    }

    return (
        <>
        <div className={Style.container}>
        {SetsStore.sets.length !== 0 ? (
            <>
            {currentSet !== 0 ? (
                <>
                <div onClick={handlePrevious}>
                    <img src={arrow_left} alt="previous" />
                </div>
                </>
            ): (
                <div></div>
            )}    
            {sets[currentSet] && (
                <>
                <div key={sets[currentSet]._id} className={Style.set}><Set set={sets[currentSet]} /></div>
                </>
            )}
            {currentSet < sets.length -1 && (
                <>
                <div onClick={handleNext}>
                    <img src={arrow_right} alt="next" />
                </div>
                </>
            )}
            </>
        ): (
            <>
            <article className={Style.noSetContainer}>
                <h2>There are no sets yet</h2>
                <Link to="/newSet" className="button primaryButton">Make your first set</Link>
            </article>
            
            </>
        )}
        </div>
        </>
    )

});

export default Sets;