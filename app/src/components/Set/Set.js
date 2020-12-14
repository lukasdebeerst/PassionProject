import React from "react";
import {Link, useHistory} from "react-router-dom";
import Style from "./Set.module.css";
import {useStore} from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import screen_01 from "../../assets/screen_01.png";
import light_01 from "../../assets/light_01.png";
import midi_01 from "../../assets/midi_01.png"


const Set = observer(({set}) => {
    
    let history = useHistory();
    const {midi, PlayStore, DevicesStore} = useStore();


    const handleStart = () => {
        midi.send(set.message);
        PlayStore.listenToPlayData();
        history.push('/playview');
    }

    const getDevice = (id) => {
        const device = DevicesStore.getDevicesById(id);

        return (
            <>
            {device && (
                <>
                <div className={Style.device}>
                    {device.type === "screen" && (
                        <>
                        <img src={screen_01} width="50px" alt="screen"/>
                        </>
                    )}
                    {device.type === "DMX" && (
                        <>
                        <img src={light_01} width="50px" alt="light"/>
                        </>
                    )}
                    {device.type === "midi" && (
                        <>
                        <img src={midi_01} width="50px" alt="midi"/>
                        </>
                    )}
                    <p>{device.title}</p>
                </div>
                </>
            )}
            </>
        )
    }
    


    return (
        <>
        <article className={Style.container}>
            <section className={Style.content} key={set.id}>
                <h1>{set.title}</h1>
                <p>{set.description}</p>
                <div className={Style.buttons} >
                    <span onClick={handleStart} className="primaryButton button">Start Set</span>
                    <Link to={`/editor/${set.id}`} className="secundaryButton button">Edit Set</Link>
                </div>
            </section>
            <section>
                <h2>Setlist</h2>
                {set.setlist && set.setlist.map((song, index) => (
                    <>
                    <p className={Style.song}>{index + 1}. {song.title}</p>
                    </>
                ))}
            </section>
        </article>
        <article className={Style.devices}>
            <h2>Devices ({set.devices.length})</h2>
            <div className={Style.devicesList}>
            {set.devices.map(device => getDevice(device))}
            </div>
        </article>

        </>
    )



});

export default Set;