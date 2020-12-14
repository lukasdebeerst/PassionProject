import React, {useState, useEffect} from "react";
import {useStore} from "../../hooks/useStore";
import Style from "./TextInput.module.css";
import {observer} from "mobx-react-lite";

const TextInput = observer(({inputName, getValue, placeholder, defaultValue}) => {

    const {UiStore} = useStore();
    const [value, setValue] = useState(UiStore.inputs[inputName]);

    useEffect(() => {
        setValue(UiStore.inputs[inputName]);
    })
    
    if(value !== undefined){
        getValue(value);
    } else {
        getValue(defaultValue);
    }

    return (
        <>
        <input 
            type="text"
            name={inputName}
            className={Style.input}
            onFocus={() => UiStore.setCurrentInput(inputName)}
            value={value}
            defaultValue={defaultValue}
            onChange={e => UiStore.handleInputChange(e.currentTarget.value)}
            autoComplete="off"
            placeholder={placeholder}
        />
        </>
    )

})

export default TextInput;