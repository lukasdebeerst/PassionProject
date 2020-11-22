import React, {useEffect, useState} from "react";
import Style from "./Header.module.css";


const Header = () => {

    const [time, setTime] = useState({hour: "", minutes: ""});

    useEffect(() => {
        const date = new Date;
        setTimeout(() => {
            setTime({hour: date.getHours(), minutes: date.getMinutes()})
        }, 1000);
       
    })


    return (
        <>
        <article className={Style.container}>
            <section className={Style.content}>
                <p>Library</p>
                <p>Devices</p>
                <p>Messages</p>
                <p>Settings</p>
            </section>
           <section>
            <p className={Style.time}>{time.hour}:{time.minutes < 10 ? (`0${time.minutes}`):(time.minutes)}</p>
           </section>
        </article>


        </>
    )

}

export default Header;