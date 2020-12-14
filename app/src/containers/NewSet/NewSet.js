import React, {useState, useRef} from "react";
import {useStore} from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import {v4} from "uuid";
import {useHistory, Link} from "react-router-dom";
import Style from "./NewSet.module.css";
import TextInput from "../../components/TextInput/TextInput";
import RadioButton from "../../components/RadioButton/RadioButton";

const NewSet = observer(() => {

    const history = useHistory();
    const {DevicesStore, SetsStore} = useStore();
    const [title, setTitle] = useState();
    const [titleError, setTitleError] = useState();
    const [descriptionError, setDescriptionError] = useState();
    const [devicesError, setDevicesError] = useState();
    const [description, setDescription] = useState();
    const [devices, setDevices] = useState([]);



    const handleDevice = (device) => {
        if(devices.find(d => d === device)){
            setDevices(devices.filter(item => item !== device));
        } else {
            setDevices(devices => [...devices, device]);
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        setTitleError();
        setDescriptionError();
        setDevicesError();
        if(title !== undefined && description !== undefined && devices.length !== 0){
            const lastSet = SetsStore.sets[SetsStore.sets.length - 1];
            let message;
            if(lastSet){
                message = lastSet.message[1] + 1;
            } else {
                message = 0;
            }
            const id = v4();
            const set = {
                id: id, 
                title: title, 
                description: description, 
                devices: devices,
                message: [193, message]
            };
            SetsStore.updateSet(set);
            SetsStore.sets.push(set);
            history.push(`/editor/${id}`);
        } else {
            if(!title){
                setTitleError("Please enter a title");
            }
            if(!description){
                setDescriptionError("Please enter a description");
            }
            if(devices.length === 0){
                setDevicesError("Please select as least 1 device");
            }
        }
    }


    return( 
        <>
        <article className={Style.container}>
            <h1>Add A New Set</h1>
            <form className={Style.form} onSubmit={e => handleSubmit(e)}>
                <label className={Style.label}>Title</label>
                {titleError && (
                    <>
                    <span className={Style.error}>{titleError}</span>
                    </>
                )}
                <TextInput inputName="newSet_title" getValue={setTitle}/>
                <label className={Style.label}>Description</label>
                {descriptionError && (
                    <>
                    <span className={Style.error}>{descriptionError}</span>
                    </>
                )}
                <TextInput inputName="newSet_description" getValue={setDescription}/>
                <label className={Style.label}>Devices</label>
                {devicesError && (
                    <>
                    <span className={Style.error}>{devicesError}</span>
                    </>
                )}
                <div className={Style.devices}>
                    {DevicesStore.devices.map(device => (
                        <>
                        <RadioButton id={device.id} image={device.type} label={device.title} value={device.id} onClick={handleDevice}  />
                        </>
                    ))}
                </div>
                <input type="submit" name="submit" value="Save Set" className={Style.button} />
            </form>
            <Link to={`/`} className="secundaryButton button">Cancel</Link>
        </article>
        </>
    )
});

export default NewSet;
