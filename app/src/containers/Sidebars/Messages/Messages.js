import React from "react";
import { useStore } from "../../../hooks/useStore";
import Style from "./Messages.module.css";
import {observer} from "mobx-react-lite";

const Messages = observer(() => {

  const {MessagesStore} = useStore();


  return (
    <>
    <article className="sideBar" >
      <h2 className={Style.title}>Messages</h2>
      {MessagesStore.Messages ? (
        <>
        {MessagesStore.Messages.map(message => (
          <>
          <p >{message.content}</p>
          </>
        ))}
        </>
      ) : (
        <>
        <p>No Messages</p>
        </>
      )}
      
    </article>
   
    </>
  );
});


export default Messages;