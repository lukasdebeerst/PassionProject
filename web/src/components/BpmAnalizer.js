import React, {useRef, useState} from "react";
import RealTimeBPMAnalyzer from 'realtime-bpm-analyzer';
import Song from "./humanbetweenquestionmarks.mp3";

const BpmAnalizer = () => {

    let audio;
    const [bpm, setBpm] = useState(0);

    const audioRef = useRef();
    // navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
    //     audio = stream;  
    // });



    const StartAnalyse = () => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audioRef.current);
        const scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessorNode.connect(audioContext.destination);
        source.connect(scriptProcessorNode);
        source.connect(audioContext.destination);

        const onAudioProcess = new RealTimeBPMAnalyzer({
            scriptNode: {
                bufferSize: 4096,
                numberOfInputChannels: 1,
                numberOfOutputChannels: 1
            },
            pushTime: 2000,
            pushCallback: (err, bpm) => {
                console.log('bpm', bpm);
                if(bpm !== undefined){
                    setBpm(bpm[0].tempo);
                }
            }
        });

        // Attach realTime function to audioprocess event.inputBuffer (AudioBuffer)
        scriptProcessorNode.onaudioprocess = (e) => {
            onAudioProcess.analyze(e);
        };
    }

    

    return (
        <>
        <audio  ref={audioRef} src={Song} controls />
        <button onClick={StartAnalyse}>Start</button>
        <p>{bpm}</p>
        </>
    )

}

export default BpmAnalizer;
