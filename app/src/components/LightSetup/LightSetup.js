import React, {useState} from "react";
import {useStore} from "../../hooks/useStore";

const LightSetup = ({light, device, setLight}) => {

    const {DevicesStore} = useStore();
    const [rotation, setRotation] = useState(light.rotation);
    const [inclination, setInclincation] = useState(light.inclination);
    const [speed, setSpeed] = useState(light.speed);
    const [color, setColor] = useState(light.color);
    const [dimmer, setDimmer] = useState(light.dimmer);

    

    return( 
        <form>
            <label>Title</label>
            <input type="text" name="title"  onChange={e => device.lights[index].title}/>
            <label>Rotation</label>
            <input onChange={e => device.lights[index].rotation = parseInt(e.currentTarget.value)} type="number" name="Rotation"/>
            <label>Inclination</label>
            <input onChange={e => device.lights[index].inclination = parseInt(e.currentTarget.value)} type="number" name="Inclination" />
            <label>Motor Speed</label>
            <input onChange={e => device.lights[index].speed = parseInt(e.currentTarget.value)} type="number" name="Speed" />
            <label>Color</label>
            <input onChange={e => device.lights[index].color = parseInt(e.currentTarget.value)} type="number" name="Color" />
            <label>Master Dimmer</label>
            <input onChange={e => device.lights[index].dimmer = parseInt(e.currentTarget.value)} type="number" name="dimmer" />
        </form>
    );

}

export default LightSetup;