import React from "react";
import {useStore} from "../../hooks/useStore";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const Keys = () => {

    const {UiStore} = useStore();


    return (    
        <Keyboard
            onChange={(value) => UiStore.handleInputChange(value)}
            inputName={UiStore.keyboardInput}
            onKeyPress={UiStore.onKeyPress}
        />
    )

}

export default Keys;
