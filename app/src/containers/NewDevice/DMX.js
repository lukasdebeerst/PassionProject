import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import Style from "./DMX.module.css";
import {useStore} from "../../hooks/useStore";
import {useHistory} from "react-router-dom";
import NumberInput from "../../components/NumberInput/NumberInput";
import TextInput from '../../components/TextInput/TextInput';
import light_01 from "../../assets/light_01.png";


const DMX = observer(({device}) => {

    const history = useHistory();
    const [lights, setLights] = useState(device.lights);
    const [currentLight, setCurrentLight] = useState();
    const [title, setTitle] = useState(device.title);
    const {DevicesStore} = useStore();

    const addALight = () => {
        const channel = 5;
        const numberOfLights = device.lights.length;
        const light = {
            title: "new Light",
            rotation: numberOfLights * channel + 1,
            inclination: numberOfLights * channel + 2 ,
            speed: numberOfLights * channel + 3,
            color: numberOfLights * channel + 4, 
            dimmer: numberOfLights * channel + 5,
        }
        device.lights.push(light);
        setLights(lights =>[...lights, light]);
    }

    const handleNewDevice = () => {
        DevicesStore.addADMXDevice(device);
        history.push("/");
    }

    const handleDelete = () => {
        if(currentLight){
            const d = device.lights[currentLight];
            device.lights.splice(currentLight, 1);
            setLights(lights.filter(l => l !== d));
            setCurrentLight();
        }
    }

    const setRotation = (value) => device.lights[currentLight].rotation = parseInt(value);
    const setInclination  = (value) => device.lights[currentLight].inclination = parseInt(value);
    const setSpeed  = (value) => device.lights[currentLight].speed = parseInt(value);
    const setColor  = (value) => device.lights[currentLight].color = parseInt(value);
    const setDimmer  = (value) => device.lights[currentLight].dimmer = parseInt(value);
    const setLightTitle = value => device.lights[currentLight].title = value;

    return (
        <>
        <div className={Style.container}>
            <div className={Style.deviceContainer}>
                <h2 className={Style.title}>Set up your DMX device</h2>
                <form className={Style.deviceFrom}>
                    <label className={Style.formLabel}>Title</label>
                    <TextInput getValue={setTitle} inputName="dmxDevice_title" defaultValue={title}/>
                </form>
                <div className={Style.chooseLightContainer}>
                    <div className={Style.chooseLight__header}>
                        <h3>Lights</h3>
                        <span className={Style.chooseLight__header__plus} onClick={addALight}>+</span>     
                    </div>
                    <div className={Style.chooseLight__lights}>
                    {lights.length !== 0 &&(
                        <>
                        {device.lights.length > 1 ? (
                        <>
                        {device.lights.map((light, index) => (
                        <>
                        <div onClick={() => setCurrentLight(index)}>
                            <img src={light_01} alt={light.title} />
                            <p className={currentLight === index && Style.highlight}>{light.title}</p>
                        </div>
                        </>
                        ))}             
                        </>
                        ) : (
                        <>
                        <div onClick={() => setCurrentLight(0)}>
                            <img src={light_01} alt={lights.title} />
                            <p  className={currentLight === 0 && Style.highlight}>{device.lights[0].title}</p>
                        </div>
                        </>
                    )}    

                        </>
                    )}
                    </div>
                </div>
                <div className={Style.submitButton}><p onClick={handleNewDevice} className="button primaryButton">Save Light</p></div>
            </div>
            <div className={Style.lightContainer} >
                {currentLight > -1 && (
                    <>
                    <div className={Style.chooseLight__header}>
                        <h3>Edit light</h3>
                        <span onClick={() => handleDelete()}>X</span>
                    </div>
                    <form className={Style.lightContent}>
                        <label>Title</label>
                        <TextInput getValue={setLightTitle} inputName={`dmx_lighTitle_${currentLight}`} defaultValue={device.lights[currentLight].title} />
                        <div className={Style.lightContent__input}>
                            <label>Rotation</label>
                            <NumberInput getValue={setRotation} inputName={`dmx_rotation_${currentLight}`} defaultValue={device.lights[currentLight].rotation}/>
                        </div>    
                        <div className={Style.lightContent__input}>
                            <label>Inclination</label>
                            <NumberInput getValue={setInclination} inputName={`dmx_inclination_${currentLight}`} defaultValue={device.lights[currentLight].inclination}/>
                        </div>
                        <div className={Style.lightContent__input}>
                            <label>Motor Speed</label>
                            <NumberInput getValue={setSpeed} inputName={`dmx_speed_${currentLight}`} defaultValue={device.lights[currentLight].speed}/>
                        </div>
                        <div className={Style.lightContent__input}>
                            <label>Color</label>
                            <NumberInput getValue={setColor} inputName={`dmx_color_${currentLight}`} defaultValue={device.lights[currentLight].color}/>
                        </div>
                        <div className={Style.lightContent__input}>
                            <label>Master Dimmer</label>
                            <NumberInput getValue={setDimmer} inputName={`dmx_dimmer_${currentLight}`} defaultValue={device.lights[currentLight].dimmer}/>
                        </div>
                    </form> 
                    </>
                )}
            </div>
        </div>
        
        </>
    )

});

export default DMX;