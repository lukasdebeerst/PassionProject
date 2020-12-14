import React from "react";
import {useStore} from "../../hooks/useStore";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const NumberKeys = () => {

    const {UiStore} = useStore();


    return (    
        <Keyboard
            onChange={(value) => UiStore.handleInputChange(value)}
            inputName={UiStore.keyboardInput}
            onKeyPress={UiStore.onKeyPress}
            layout={{"default": ["0 1 2 3 4 5 6 7 8 9 {bksp} {enter}"]}}
        />
    )

}

export default NumberKeys;
