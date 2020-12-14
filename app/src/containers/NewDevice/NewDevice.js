import React, {useState} from "react";
import screen_01 from "../../assets/screen_01.png"
import {useStore} from "../../hooks/useStore";
import {useParams, useHistory} from "react-router-dom";
import {observer} from "mobx-react-lite";
import Style from "./NewDevice.module.css";
import DMX from "./DMX";
import TextInput from "../../components/TextInput/TextInput";

const NewDevice = observer(() => {
    
    const {id} = useParams();
    const {DevicesStore} = useStore();
    const device = DevicesStore.getCurrentDeviceById(id);
    const history = useHistory();

    const [title, setTitle] = useState();
    const [lights, setLights] = useState([]);
    
    const handleNewDevice = e => {
        e.preventDefault();
        if(title){
            device.title = title
            DevicesStore.addADevice(device);
            history.push('/')
        }
    }

    return (
        <>
        {device ? (
            <>
            {device.type === "screen" && (
                <>
                <div className={Style.container}>
                    <img src={screen_01} alt="screen"/>
                    <div className={Style.element}>
                        <p className={Style.title}>ip</p>
                        <p>{device.ip}</p>
                    </div>
                    <div className={Style.element}>
                        <p className={Style.title}>mac</p>
                        <p>{device.mac}</p>      
                    </div>
                    <form className={Style.form} onSubmit={handleNewDevice}>
                        <label>Title</label>
                        <TextInput inputName="addDevice_title" getValue={setTitle}/>
                        <input className="primaryButton button" type="submit" name="Save" value="Save Device" />
                    </form>
                </div>    
                </>
            )}
            {device.type === "DMX" && (
                <>
                <DMX device={device} />
                </>
            )}
            
        </>) : (<> 
            <p>loading</p>
        </>)}
        </>
    )

});

export default NewDevice;