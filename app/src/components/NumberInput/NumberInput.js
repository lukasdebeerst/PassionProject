import React, {useState, useEffect} from "react";
import {useStore} from "../../hooks/useStore";
import Style from "../NumberInput/NumberInput.module.css";
import {observer} from "mobx-react-lite";

const NumberInput = observer(({inputName, getValue, placeholder, defaultValue}) => {
    
    const {UiStore} = useStore();
    const [value, setValue] = useState(UiStore.inputs[inputName] || defaultValue);



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
            type="number"
            name={inputName}
            className={Style.input}
            onFocus={() => UiStore.setCurrentNumberInput(inputName)}
            value={value}
            defaultValue={defaultValue}
            onChange={e => UiStore.handleInputChange(e.currentTarget.value)}
            autoComplete="off"
            placeholder={placeholder}
        />
        </>
    )

})

export default NumberInput;