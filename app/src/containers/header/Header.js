import React, {useEffect, useState} from "react";
import Style from "./Header.module.css";
import {useStore} from "../../hooks/useStore";
import devices_01 from "../../assets/devices_01.png";
import devices_02 from "../../assets/devices_02.png";
import messages_01 from "../../assets/messages_01.png";
import messages_02 from "../../assets/messages_02.png";
import {useLocation, Link, useHistory} from "react-router-dom";


const Header = () => {

    const history = useHistory();
    const [time, setTime] = useState({hour: "", minutes: ""});
    const [devicesIcon, setDevicesIcon] = useState(devices_01);
    const [messagesIcon, setMessagesIcon] = useState(messages_01);

    const {UiStore, PlayStore} = useStore();
    const location = useLocation();

    useEffect(() => {
        const date = new Date;
        setTimeout(() => {
            setTime({hour: date.getHours(), minutes: date.getMinutes()})
        }, 1000);
    });

    const handleStopPlayview = () => {
        PlayStore.handleStop();
        history.push('/');
    }

    const handleDevices = () => {
        if(UiStore.devices){
            setDevicesIcon(devices_01);
            UiStore.setDevices(false);
        } else {
            setDevicesIcon(devices_02);
            UiStore.setDevices(true);
        }

        if(UiStore.messages){
            setMessagesIcon(messages_01);
            UiStore.setMessages(false);
        }
    }

    const handleMessages = () => {
        if(UiStore.messages){
            setMessagesIcon(messages_01);
            UiStore.setMessages(false);
        } else {
            setMessagesIcon(messages_02);
            UiStore.setMessages(true);
        }

        if(UiStore.devices){
            setDevicesIcon(devices_01);
            UiStore.setDevices(false);
        }
    }


    return (
        <>
        <article className={Style.container}>
            <section className={Style.content}>
            {location.pathname === "/" && (
                <>
                <Link className={Style.element} to="/newSet">Add A new Set</Link>
                </>
            )}
            {location.pathname === "/newSet" && (
                <>
                <Link className={Style.element} to="/">Go Back</Link>
                </>
            )}
            {location.pathname === "/playview" && (
                <>
                <span onClick={() => handleStopPlayview()}>Stop</span>
                </>
            )}
            {location.pathname.includes("editor") && (
                <>
                <Link to="/" className={Style.element}>Save and Exit</Link>
                </>
            )}
             {location.pathname.includes("newDevice") && (
                <>
                <Link to="/" className={Style.element}>cancel</Link>
                </>
            )}
            </section>
           <section className={Style.content}>
                <img src={devicesIcon} onClick={handleDevices} />
                <img src={messagesIcon} onClick={handleMessages} />
                <p className={Style.time}>{time.hour}:{time.minutes < 10 ? (`0${time.minutes}`):(time.minutes)}</p>
           </section>
        </article>
        </>
    )

}

export default Header;