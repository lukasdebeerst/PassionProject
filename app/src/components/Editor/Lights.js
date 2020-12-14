import React, {useState} from "react";
import { useStore } from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import {useHistory} from "react-router-dom";
import Style from "./Editor.module.css";
import screen_01 from "../../assets/screen_01.png";

const Lights = observer(({cancel, lights, segment, device, song, setSong}) => {
    
    const {LightsStore, SegmentsStore} = useStore();

    const handleChanges = () => {
        setSong(song);
        cancel(false);
        SegmentsStore.handleSongChange(song);
    }

    const handleObject = () => {
        song.segments[segment.message].media.map(d => {
            if(d.device_id === device.id){
                if(d.lights.length === 0){
                    device.lights.map(light => {
                        d.lights.push({
                            light: light._id,
                            color: [196],
                            animation: [197],
                        })
                    })
                }
            }
        });

    }

    const handleColor = (value, light) => {
        song.segments[segment.message].media.map(d => {
            if(d.device_id === device.id){
                d.lights.map(l => {
                    if(l.light === light._id){
                        l.color[1] = parseInt(value);
                    }
                })
            }
        })
    }

    const handleAnimation = (value, light) => {
        song.segments[segment.message].media.map(d => {
            if(d.device_id === device.id){
                d.lights.map(l => {
                    if(l.light === light._id){
                        l.animation[1] = parseInt(value);
                    }
                })
            }
        })
    }


    return (
    <>
    <article className={Style.container} >
        <h2 className={Style.title}>Lights</h2>
        <div>
        {handleObject()}
        {device.lights.map(device => (
            <>
            <h3 className={Style.deviceName}>{device.title}</h3>
            <form className={Style.form}>
                <label>Colors</label>
                <select className={Style.dropDown} onChange={e => handleColor(e.currentTarget.value, device)}>
                    <option>-- choose a color --</option>
                    {LightsStore.colors.map(color => (
                        <>
                        <option value={color.midi[1]}>{color.name}</option>
                        </>
                    ))}
                </select>
                <label>Animations</label>
                <select className={Style.dropDown} onChange={e => handleAnimation(e.currentTarget.value, device)}>
                    <option>-- choose a animation --</option>
                    {LightsStore.animations.map(animation => (
                        <>
                        <option value={animation.midi[1]}>{animation.name}</option>
                        </>
                    ))}
                </select>
            </form>
            </>
        ))}
        </div>
        <div className={Style.buttons}>
            <span onClick={handleChanges} className={Style.primaryButton}>Save</span>
            <span onClick={() => cancel(false)} className={Style.secundaryButton}>Cancel</span>
        </div>
        
    </article>
   
    </>
  );
});


export default Lights;