import React, {useState} from "react";
import Style from "./RadioButton.module.css";
import Screen_01 from "../../assets/screen_01.png"
import midi_01 from "../../assets/midi_01.png"
import light_01 from "../../assets/light_01.png"

const RadioButton = ({id, image, label, value, checked, onClick}) => {

    const [selected, setSelected] = useState(checked)

    const handleClick = value => {
        onClick(value);
        if(selected){
            setSelected(false);
        } else {
            setSelected(true);
        }
    }

    return (
        <>
        <label className={Style.container} HTMLfor={id}>
            {image === "screen" && (
                <img src={Screen_01} alt="screen" />
            )}
            {image === "midi" && (
                <img src={midi_01} alt="midi" />
            )}
             {image === "DMX" && (
                <img src={light_01} alt="light" />
            )}
            <span className={selected ? Style.labelSelected : Style.label}>{label}</span>
            <input onClick={e => handleClick(e.currentTarget.value)} className={Style.checkbox} type="checkbox" name={label} id={id} value={value} checked={checked}/>
        </label>
        </>
    )

}

export default RadioButton;