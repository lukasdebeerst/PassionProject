import React, {useState} from "react";
import { useStore } from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import Style from "./Editor.module.css";
import NumberInput from "../../components/NumberInput/NumberInput";

const MidiOutput = observer(({cancel, segment, device, song, setSong}) => {
    
    const {SegmentsStore} = useStore();
    const [channel, setChannel] = useState(0);
    const [message, setMessage] = useState(0);

    const handleChanges = () => {
        song.segments[segment.message].media.map(data => {
            if(data.device_id === device.id){
                data.message = [parseInt(channel), parseInt(message)];
            }
        })
        SegmentsStore.handleSongChange(song);
        setSong(song);
        cancel(false);
    }

    const getDefaultValues = () => {
        song.segments[segment.message].media.map(data => {
            if(data.device_id === device.id){
                if(data.message){
                    setChannel(data.message[0]);
                    setMessage(data.message[1]);
                }
            }
        })
    } 

    return (
    <>
    <article className={Style.container} >
        <h2 className="title">Lights</h2>
        <form className={Style.form}>
            {getDefaultValues}
            <label>channel</label>
            <NumberInput setValue={setChannel} inputName={`midiOutput_channel_${segment.message}`} getValue={setChannel} defaultValue={channel}/>
            <label>message</label>
            <NumberInput setValue={setMessage} inputName={`midiOutput_Message_${segment.message}`} getValue={setMessage}  defaultValue={message}/>
        </form>
        <div className={Style.buttons}>
            <span onClick={handleChanges} className={Style.primaryButton}>Save</span>
            <span onClick={() => cancel(false)} className={Style.secundaryButton}>Cancel</span>
        </div>
        
    </article>
   
    </>
  );
});


export default MidiOutput;