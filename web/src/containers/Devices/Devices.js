import React, {useEffect, useState} from "react";
import { useStore } from "../../hooks/useStore";


const Devices = () => {

    const {socket} = useStore();
    const [devices, setDevices] = useState([]);


    useEffect(() => {
      socket.on('currentDevices', (devices) => {
        setDevices(devices)
      });
    })

    return (
      <>
      <h1>Current Devices</h1>
        {devices.map(device => (
        <>
            <p key={device.id}>{device.title}</p>
            {device.title === "unknown device" && (
              <>  
              <button>Configure device</button>
              </> 
            )}
        </>
        ))}
      </>
    );
}


export default Devices;