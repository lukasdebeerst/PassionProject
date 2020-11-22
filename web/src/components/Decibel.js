import React, {useRef, useState} from "react";
import Song from "./humanbetweenquestionmarks.mp3";
import DecibelMeter from 'decibel-meter'

const Decibel = () => {

    let audio;
    const [db, setDb] = useState(0);

    const audioRef = useRef();
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
        audio = stream;  
    });



    const StartAnalyse = () => {
        let meter = new DecibelMeter('meter');
        meter.sources.then(sources => {
            console.log(sources);
            meter.connect(sources[0])
        });
        meter.listen();
        meter.on('sample', (dB, percent, value) => setDb(dB));
        console.log(meter);
    }

    

    return (
        <>
        <button onClick={StartAnalyse}>Start</button>
        <p>{db}</p>
        </>
    )

}

export default Decibel;
