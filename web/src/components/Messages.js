import React, {useEffect, useState} from "react";
import io from "socket.io-client";

const socket = io.connect('http://192.168.1.33:4000');

const Messages = () => {

    const [messages, setMessages] =  useState([]);

    useEffect(() => {
        socket.on('messages', (messages) => {
            setMessages(messages)
        })
    })

    return(
        <>
        <h2>Recent Messages</h2>
        {messages.map(message => (
            <>
            <p key={message}>{message}</p>
            </>
        ))}
        </>
    )


}

export default Messages;