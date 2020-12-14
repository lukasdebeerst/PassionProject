import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useStore} from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import Style from "./Editor.module.css";
import screen_01 from "../../assets/screen_01.png"
import NewDevice from "../../components/Editor/NewDevice";
import NewSegment from "../../components/Editor/NewSegment";
import Media from "../../components/Editor/Media";
import Setlist from "../../components/Editor/Setlist";
import Lights from "../../components/Editor/Lights";
import light_01 from "../../assets/light_01.png";
import MidiOutput from "../../components/Editor/MidiOutput";
import midi_01 from "../../assets/midi_01.png";
import file_01 from "../../assets/file_01.png";

const Editor = observer(() => {

    const [currentSong, setCurrentSong] = useState();

    const [newDevice, setNewDevice] = useState(false);
    const [newSegment, setNewSegment] = useState(false);
    const [midiInput, setMidiInput] = useState(false);
    const [midiOutput, setMidiOutput] = useState(false);
    const [midiDevice, setMidiDevice] = useState(false);
    const [midiSegment, setMidiSegment] = useState(false);
    const [media, setMedia] = useState(false);
    const [mediaSegment, setMediaSegment] = useState(false);
    const [mediaDevice, setMediaDevice] = useState(false);
    const [lights, setLights] = useState(false);
    const [lightSegment, setLightSegment] = useState(false);
    const [lightDevice, setLightDevice] = useState(false);
    const [setlist, setSetlist] = useState(false);

    const {id} = useParams();
    const {SetsStore, SongsStore, DevicesStore} = useStore();
    const set = SetsStore.getSetById(id);

    const getDevice = (id) => {
        const device = DevicesStore.getDevicesById(id);
        return (
            <>
            {device && (
                <>
                <div className={Style.gridItemDevice}>
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
                {currentSong && currentSong.segments.map(segment => segment.media.map(data => (
                    <>
                    {data.device_id === device.id && (
                        <>  
                        {device.type === "screen" && (
                            <>
                            <div className={Style.gridMedia} onClick={() => handleMedia(segment, device)}>{data.src ? (
                                <>
                                <div className={Style.mediaResults}>
                                    <img src={file_01} width="22" alt="file" />
                                    <span>{data.src}</span>
                                    <span>{data.effect_id}</span>   
                                </div>
                                </>
                                ) : (
                                <>
                                <div className={Style.addContent}>
                                    <span className={Style.plus}>+</span>
                                    <span>Add content</span>
                                </div>
                                </>    
                                )}</div>
                            </>
                        )}
                        {device.type === "DMX" && (
                            <>
                            <div className={Style.gridMedia} onClick={() => handleLights(segment, device)}>{data.lights.length === 0 ? (
                                <>
                                <div className={Style.addContent}>
                                    <span className={Style.plus}>+</span>
                                    <span>Add content</span>
                                </div> 
                                </>
                                ) : (
                                <>
                                <div className={Style.mediaResults}>
                                    <img src={light_01} alt="light"/>
                                    <span>{data.src}</span>
                                </div>       
                                </>
                                )}</div>
                            </>
                        )}
                        {device.type === "midi" && (
                            <>
                            {device.action === "output" && (
                                <span className={Style.gridMedia} onClick={() => handleMidiOutput(segment, device)}>{data.src ? data.src : "Add content"}</span>
                            )}
                            {device.action === "input" && (
                                <span className={Style.gridMedia} onClick={() => handleMidiInput(segment, device)}>{data.src ? data.src : "Add content"}</span>
                            )}
                            </>
                        )}
                        </>
                    )}
                    </>
                )))}
                </>
            )}
            </>
        )
    }
    
    const handleSong = (song) => {
        SongsStore.getSongByMidi(song.midi, data => setCurrentSong(data));
       
    }
    
    const handleNewSegment = () => {
        setNewSegment(true);

    }

    const handleMedia = (segment, device) => {
        const data = segment.media.find(d => d.device_id === device.id);
        setMedia(data);
        setMediaSegment(segment);
        setMediaDevice(device);
    }

    const handleLights = (segment, device) => {
        setLights(true)
        setLightSegment(segment);
        setLightDevice(device);
    }

    const handleMidiInput = (segment, device) => {
        setMidiInput(true);

    }

    const handleMidiOutput = (segment, device) => {
        setMidiOutput(true);
        setMidiDevice(device);
        setMidiSegment(segment);
    }

    return(
        <>
        {set ? (
            <>
            <div className={Style.container}>
                <div className={Style.content}>
                    <div className={Style.setlistContainer}>
                        <span>{set.title}</span>
                        <article className={Style.setList}>
                            {set.setlist && set.setlist.map(song => (
                                <>
                                <div className={Style.song} >
                                    <p onClick={() => handleSong(song)}  className={currentSong && currentSong.title === song.title && Style.currentSong__title}>{song.title}</p>
                                </div>  
                                </>
                            ))}
                            {set.setlist === undefined ? (
                                <>
                                <span onClick={() => setSetlist(true)}>+  Add your first song</span>
                                </>
                            ) : (
                                <>
                                <span onClick={() => setSetlist(true)}>+</span>
                                </>
                            )}
                        </article>
                    </div>
                    {currentSong ? (
                        <>
                        <article className={Style.editorContainer}>
                            <span className={Style.whiteSpace}>
                                <div onClick={handleNewSegment} className={Style.gridItemSegmentPlus}>
                                    <span>edit segments</span>    
                                </div>    
                            </span>
                            {set.devices.map(device => getDevice(device))}
                            {currentSong && currentSong.segments.map((segment) => (
                                <>
                                <span className={Style.gridItemSegment}>{segment.title}</span>
                                </>
                            ))} 
                        </article>    
                        </>
                    ) : (
                        <>
                        <div className={Style.selectSong}>
                            <p> Select a song to start</p>
                        </div>
                        </> 
                    )}
                </div>
                <div className={Style.sideBar}>
                    {newDevice && (
                        <>
                        <NewDevice cancel={setNewDevice} song={currentSong} set={set}/>         
                        </>
                    )}
                    {newSegment && (
                        <>
                        <NewSegment cancel={setNewSegment} song={currentSong} setCurrentSong={setCurrentSong} devices={set.devices}/>         
                        </>
                    )}
                    {media && (
                        <>
                        <Media media={media} segment={mediaSegment} device={mediaDevice} cancel={setMedia} song={currentSong} setSong={setCurrentSong}/>
                        </>
                    )}
                    {lights && (
                        <>
                        <Lights lights={lights} segment={lightSegment} device={lightDevice} cancel={setLights} song={currentSong} setSong={setCurrentSong}/>
                        </>
                    )}
                    {setlist && (
                        <>
                        <Setlist set={set} cancel={setSetlist}/>
                        </>
                    )}
                    {midiOutput && (
                        <>
                        <MidiOutput set={set} cancel={setMidiOutput} segment={midiSegment} device={midiDevice} song={currentSong} setSong={setCurrentSong}/>
                        </>
                    )}
                </div>
            </div>
            
            </>
        ) : (
            <>
            <p>Loading</p>
            </> 
        )}
        
        </>
    )

});

export default Editor;