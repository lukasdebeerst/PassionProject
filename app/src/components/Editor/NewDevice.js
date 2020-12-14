import React, {useState} from "react";
import { useStore } from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import {useHistory} from "react-router-dom";
import Style from "./Editor.module.css";
import screen_01 from "../../assets/screen_01.png";

const NewDevice = observer(({cancel, song, set}) => {
    
    const {DevicesStore, SetsStore} = useStore();
    const [currentDevices, setCurrentDevices] = useState(set.devices);

    const showDeviceById = id => {
        const device = DevicesStore.getDevicesById(id);

        return (
            <>
            <p>{device.title}</p>
            <span onClick={() => deleteDevice(device.id)}>X</span>
            </>
        )
    }

    const deleteDevice = device => {
        setCurrentDevices(currentDevices.filter(item => item !== device));
    }

    const addADevice = device => {
        setCurrentDevices(currentDevices => [...currentDevices, device]);
    }

    const handleSubmit = () => {
        set.devices = currentDevices;
        SetsStore.updateSet(currentDevices);
        cancel(false);
    }

    return (
    <>
    <article className={Style.container} >
        <div>
            <h2 className="title">New Devices</h2>
        </div>
        <div>
            {currentDevices.map(device => showDeviceById(device))}
        </div>
        <select onChange={e => addADevice(e.currentTarget.value)}>
            <option>-- choose a device --</option>
            {DevicesStore.devices.map(device => (
                <>
                {!currentDevices.find(d => d === device.id) && (
                    <>
                    <option value={device.id}>{device.title}</option>
                    </>
                )}
                </>
            ))}
        </select>
      
        <div className={Style.buttons}>
            <span onClick={() => handleSubmit()} className="primaryButton button">update Devices</span>
            <span onClick={() => cancel(false)} className="secundaryButton button">Cancel</span>
        </div>
        
    </article>
   
    </>
  );
});


export default NewDevice;