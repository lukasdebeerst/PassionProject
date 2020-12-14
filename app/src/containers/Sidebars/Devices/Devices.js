import React, {useEffect, useState} from "react";
import { useStore } from "../../../hooks/useStore";
import Style from "./Devices.module.css";
import {observer} from "mobx-react-lite";
import screen_01 from  "../../../assets/screen_01.png";
import light_01 from  "../../../assets/light_01.png";
import midi_01 from  "../../../assets/midi_01.png";
import {useHistory} from "react-router-dom";


const Devices = observer(() => {

  let history = useHistory();
  const {DevicesStore, UiStore} = useStore();
  const newDevices = [];
  const connectedDevices = [];
  
  
  DevicesStore.currentDevices.map(device => {
    switch(device.type){
      case "screen":
        if(device.title === "unknown device"){
          newDevices.push(device);
        } else {
          connectedDevices.push(device);
        }
        break;
      case "DMX":
        if(device.lights.length === 0){
          newDevices.push(device);
        } else {
          connectedDevices.push(device);
        }
        break;
      case "midi":
        connectedDevices.push(device);
        break;
      default:
        break;
    }
  });

  const handleNewDevice = (device) => {
    history.push(`/newDevice/${device.id}`);
    UiStore.devices = false;
  }



  return (
    <>
    <article className="sideBar" >
      {newDevices.length > 0 && (
        <>
        <h2 className={Style.title}>New Devices</h2>
        </>
      )}
      <div>
        {newDevices.map(device => (
        <div className={Style.device}>
          <>  
          {device.type === "screen" && (
            <>
            <img src={screen_01} alt="screen"/>
            </>
          )}
          {device.type === "DMX" && (
            <>
            <img src={light_01} alt="light"/>
            </>
          )}
           {device.type === "midi" && (
            <>
            <img src={midi_01} alt="midi"/>
            </>
          )}
          <p onClick={() => handleNewDevice(device)}>{device.title}</p> 
          </>   
        </div>
        ))} 
      </div>
      <h2 className={Style.title}>Connected Devices</h2>
      <div className={Style.devicesContainer}>
        {connectedDevices.map(device => (
          <>  
          <div className={Style.device} onClick={() => handleNewDevice(device)}>
            {device.type === "screen" && (
              <>
              <img src={screen_01} alt="screen"/>
              </>
            )}
            {device.type === "DMX" && (
              <>
              <img src={light_01} alt="light"/>
              </>
            )}
             {device.type === "midi" && (
              <>
              <img src={midi_01} alt="midi"/>
              </>
            )}
            <span>{device.title}</span>
          </div>
          </>   
        ))}
      </div>
    </article>
   
    </>
  );
});


export default Devices;