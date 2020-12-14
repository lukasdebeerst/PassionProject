import React, {useState} from "react";
import { useStore } from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import {useHistory} from "react-router-dom";
import Style from "./Editor.module.css";
import screen_01 from "../../assets/screen_01.png";

const Media = observer(({cancel, media, segment, device, song, setSong}) => {
    
    const [source, setSource] = useState(media.src);
    const [file, setFile] = useState(media.src_id);
    const [effect, setEffect] = useState(media.effect_id);
    const [dynamic, setDynamic] = useState(media.dynamic);
    const {EffectsStore, VideosStore, SegmentsStore} = useStore();

    const handleChanges = () => {
            song.segments[segment.message].media.map(d => {
                if(d.device_id === device.id){
                    d.src = source;
                    d.src_id = file;
                    d.effect_id = effect;
                    d.dynamic = dynamic;
                }
            })
            setSong(song);
            cancel(false);
            SegmentsStore.handleSongChange(song);
    }

    return (
    <>
    <article className={Style.container} >
        <h2 className={Style.title}>Media</h2>
        <form className={Style.form}>
            <label>Source</label>
            <select className="dropdown" onChange={e => setSource(e.currentTarget.value)}>
                <option>-- choose source ---</option>
                <option value="live" selected={source === "live"}>Live</option>
                <option value="video" selected={source === "video"}>Video</option>
            </select>
            {source === 'video' && (
                <>
                <label>File</label>
                <select className="dropdown" onChange={e => setFile(e.currentTarget.value)}>
                    <option>-- choose file ---</option>
                    {VideosStore.videos.map(video => (
                        <option  value={video.id} selected={file === video.id}>{video.title}</option>
                    ))}
                </select>
                </>
            )}     
            <label>Effect</label>
            <select className="dropdown" onChange={e => setEffect(e.currentTarget.value)}>
                <option>none</option>
                {EffectsStore.effects.map(fx => (
                    <option value={fx.title} selected={effect === fx.id}>{fx.title}</option>
                ))}
            </select>
            <label>Dynamic</label>
            <select onChange={e => setDynamic(e.currentTarget.value)} className="dropdown">
                <option value="">None</option>
                <option value="BPM">BPM</option>
                <option value="decibel">Decibel</option>
            </select>
        </form>
        <div className={Style.buttons}>
            <span onClick={handleChanges} className={Style.primaryButton}>Save</span>
            <span onClick={() => cancel(false)} className={Style.secundaryButton}>Cancel</span>
        </div>  
    </article>
    </>
  );
});


export default Media;