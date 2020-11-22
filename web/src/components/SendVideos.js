import React, {useEffect, useState, useRef} from "react";
import { useStore } from "../hooks/useStore";
import Peer from "simple-peer";


const SendVideo = () => {
    
    const {socket} = useStore();

    const [devices, setDevices] = useState([]);
    const [videos, setVideos] = useState([]);
    const [effects, setEffects] = useState([]);

    let feed;
    let peer;

    const videoRef = useRef();
    navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 1280, height: 720 }}).then(stream => {
        feed = stream;   
    });


    const servers = {
        iceServers: [{
          urls: 'stun:stun.l.google.com:19302'
        }]
    };

    useEffect(() => {
        socket.on('currentDevices', (devices) => {
          setDevices(devices);
        });

        socket.on('videos', (videos) => {
            setVideos(videos);
        });

        socket.on('effects', (effects) => {
            setEffects(effects);
        });

        socket.on('signal', async (data, receiver, sender) => {
            if(peer){
                peer.signal(data);
            }
        })
        
    });

    function handleCanPlay() {
        videoRef.current.play();
    }

    const handleVideo = (data, socketId) => {
        if(data === "camera"){
            handleLiveFeed(socketId);
        } else {
            socket.emit("sendVideo", {title: data, socketId: socketId});
        }
    }

    const handleLiveFeed = async socketId => {
        peer = new Peer({ initiator: true, stream: feed });
        peer.on('signal', data => {
            socket.emit('signal', data, socketId, socket.id);
        })

    }

    const handleEffect = (data, socketId) => {
        socket.emit("sendEffect", {title: data, socketId: socketId});
    }

    return (
        <>
        <h2>Send Videos</h2>
        {devices.map(device => (
            <>
            <span>{device.title}</span><br />
            <select name="videos" onChange={e => handleVideo(e.target.value, device.socketId)}>
                <option value="">Choose a video</option>
                <option value="camera">Live Camera</option>
                {videos.map(video => (
                    <>
                    <option value={video.id}>{video.title}</option>
                    </>
                ))}
            </select>
            <select name="effects" onChange={e => handleEffect(e.target.value, device.socketId)}>
                <option value="">No effect</option>
                {effects.map(effect => (
                    <>
                    <option value={effect.id}>{effect.title}</option>
                    </>
                ))}
            </select>
            </>
        ))}
        </>
    )
}

export default SendVideo;