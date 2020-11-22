import React, {useEffect, useState} from "react";
import io from "socket.io-client";

const socket = io.connect('http://192.168.1.33:4000');


const SendData = () => {

    const [devices, setDevices] = useState([]);
    const [device, setDevice] = useState();
    const [content, setContent] = useState();

    useEffect(() => {
        socket.on('currentDevices', (devices) => {
          // console.log(devices);
          setDevices(devices);
        });
    })

    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            socketId: device,
            content: content, 
        }
        console.log(data);
        socket.emit("data", data);
    }

    return (
        <>
        <h2>Send data</h2>
        <form onSubmit={handleSubmit}>
            <select name="devices" onChange={e => setDevice(e.target.value)}>
                <option value="">Choose a device</option>
                {devices.map(device => (
                    <>
                    <option value={device.socketId}>{device.title} ({device.ip})</option>
                    </>
                ))}
            </select>
            <input type="text" name="content" onChange={e => setContent(e.target.value)} />
            <input type="submit" value="send" />
        </form>
        </>
    )
}

export default SendData;