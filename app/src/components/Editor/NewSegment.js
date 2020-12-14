import React, {useState} from "react";
import { useStore } from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import Style from "./Editor.module.css";
import DragSortableList from 'react-drag-sortable'
import drag_01 from "../../assets/drag_01.png"
import TextInput from "../../components/TextInput/TextInput";

const NewSegment = observer(({cancel, song, setCurrentSong, devices}) => {
    
    const [title, setTitle] = useState();
    const [drag, setDrag] = useState([]);
    const [addSegment, setAddSegment] = useState(false);
    const [segmentToDelete, setSegmentToDelete] = useState();
    const {SegmentsStore, DevicesStore} = useStore();


    const handleDragList = () => {
        if(song.segments.length !== 0 && drag.length === 0){
            song.segments.map(segment => {
            const text = (<><div className={Style.dragItem}><img src={drag_01} alt="drag" /><p>{segment.title}</p><span onClick={() => setSegmentToDelete(segment)}>X</span></div></>)
            setDrag(drag => [...drag, {content: text, segment: segment}])
            });      
        }
        
    }

    const listenForDelete = () => {
        if(drag.length > 0){
            if(segmentToDelete){
                setSegmentToDelete(); 
                setDrag(drag.filter(item => item.segment !== segmentToDelete));
            }
        }
    }

    const handleSort = (sortedList, dropEvent) => {
        setDrag(sortedList);
    }

    const handleAddSong = e => {
        setAddSegment(false);
        e.preventDefault();
        if(title){
            setDrag(drag => [...drag, {content: (<><div className={Style.dragItem}><img src={drag_01} alt="drag"/><p>{title}</p><span onClick={() => setSegmentToDelete(title)}>X</span></div></>), segment: {
                title: title,
                message: 0,
                media: []
            }}]);
            setTitle(" ");
        }
    }

    const handleUpdateSegments = () => {
        let segments = [];
        drag.map((item, index) => {
            segments.push({
                title: item.segment.title,
                media: item.segment.media,
                message: index
            });
        });
        segments.map(segment => {
            if(segment.media.length === 0){
                devices.map(id => {
                    const device = DevicesStore.getDevicesById(id);
                    switch(device.type){
                        case "screen":
                            segment.media.push({
                                device_id: device.id,
                                src: "",
                                src_id: "",
                                effect_id: "" 
                            });
                            break;
                        case "DMX": 
                            segment.media.push({
                                device_id: device.id,
                                lights:[],
                                src: "DMX",
                            });
                            break;
                        case "midi": 
                        if(device.action === "output"){
                            segment.media.push({
                                device_id: device.id,
                                action: device.action,
                                message: [],
                                src: "midi",
                            });    
                        } else if(device.action === "input"){
                            segment.media.push({
                                device_id: device.id,
                                action: device.action,
                                inputs: [],
                                src: "midi",
                            });  
                        }
                        
                        break;
                        default:
                            break;   
                    }
                   
                })
            }
        })
        song.segments = segments;
        SegmentsStore.handleSongChange(song);
        cancel(false);
    }

    return (
    <>
    <article className={Style.container}>
        {handleDragList()}
        {listenForDelete()}
        {addSegment ? (
            <>
            <div className={Style.addSongContainer}>
                <h2 className={Style.title}>Segments</h2>
                <form className={Style.form} onSubmit={e => handleAddSong(e)}>
                    <label>Title</label>
                    <div className={Style.addSongForm}>
                        <TextInput inputName={`segment_title_${drag.length}`} getValue={setTitle} />
                        <input className={Style.formSubmitButton} type="submit" name="submit" value="Add" />
                    </div>     
                </form>
                <span onClick={() => setAddSegment(false)}>Cancel</span>
            </div>
            </>
        ) : (
            <>
            <div>
                <div className={Style.header}>
                    <h2 className={Style.title}>Segments</h2>
                    <span onClick={() => setAddSegment(true)}>+  Add a segment</span>
                </div>
            </div>
                <DragSortableList items={drag} onSort={handleSort} type="vertical"/>
            <div className={Style.buttons}>
                <span onClick={handleUpdateSegments} className={Style.primaryButton}>Update Segments</span>
                <span onClick={() => cancel(false)} className={Style.secundaryButton}>Cancel</span>
            </div>
            </>
        )}
        
        
    </article>
   
    </>
  );
});


export default NewSegment;