import React, {useState} from "react";
import { useStore } from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import Style from "./Editor.module.css";
import DragSortableList from 'react-drag-sortable';
import {toJS} from "mobx";
import drag_01 from "../../assets/drag_01.png"
import TextInput  from "../../components/TextInput/TextInput";


const Setlist = observer(({cancel, set}) => {

    const {SetsStore, SongsStore} = useStore();
    const [addSong, SetAddSong] = useState(false);
    const [title, setTitle] = useState();
    const [drag, setDrag] = useState([]);
    const [songToDelete, setSongToDelete] = useState();

    const listenForDelete = () => {
        if(set.setlist && set.setlist !== 0 && drag.length > 0){
            if(songToDelete){
                setSongToDelete(); 
                setDrag(drag.filter(item => item.song !== songToDelete));
            }
        }
    }
   

    const handleDragList = () => {
        if(set.setlist && drag.length === 0){
            set.setlist.map(song => {
            const text = (<><div className={Style.dragItem}><img src={drag_01} alt="drag" /><p>{song.title}</p><span onClick={() => setSongToDelete(song)}>X</span></div></>)
            setDrag(drag => [...drag, {content: text, song: song}])
            });       
        }
        
    }

  
    const handleSort = (sortedList, dropEvent) => {
        setDrag(sortedList);
    }

    const handleAddSong = e => {
        SetAddSong(false);
        e.preventDefault();
        if(title){
            setDrag(drag => [...drag, {content: (<><div className={Style.dragItem}><img src={drag_01} alt="drag" /><p>{title}</p><span onClick={() => setSongToDelete(title)}>X</span></div></>), song: title}]);
            setTitle(" ");
        }
    }

    const handleAddSongFromDB = (title) => {
        SetAddSong(false);
        const song = set.setlist.find(song => song.title === title);
        const inList = drag.find(s => {
            return s.song === song
        });
        if(!inList){
            setDrag(drag => [...drag, {content: (<><div className={Style.dragItem}><img src={drag_01} alt="drag" /><p>{song.title}</p><span onClick={() => setSongToDelete(song)}>X</span></div></>), song: song}]);
        }

    }

    const handleUpdateSetlist = () => {
        let setlist = [];
        let lastSong = SongsStore.songs[SongsStore.songs.length - 1];
        let message;
        if(lastSong){
            message = SongsStore.getNewMessage();
        } else {
            message = 0;
        }
        drag.map((item, index) => {
            if(typeof item.song === "object"){
                setlist.push({
                    number: index,
                    title: item.song.title,
                    midi: item.song.midi
                })
            } else {
                setlist.push({
                    number: index,
                    title: item.song,
                    midi: [194, message + index]
                })
            }
        });
        SongsStore.addSongs(setlist);
        set.setlist = setlist;
        SetsStore.updateSet(set);

        cancel(false);
    }

    return (
    <>
    <article className={Style.container} >
        
        {handleDragList()}
        {listenForDelete()}
        {addSong ? (
            <>
            <div className={Style.addSongContainer}>
                <h2 className={Style.title}>Setlist</h2>
                    <h3>Add New Song</h3> 
                <form className={Style.form} onSubmit={e => handleAddSong(e)}>
                    <div className={Style.addSongForm}>
                        <TextInput placeholder="title" inputName={`setlist_title_${drag.length}`} getValue={setTitle} />
                        <input className={Style.formSubmitButton} type="submit" name="submit" value="add" />
                    </div>
                </form>
                <h3>Choose existing songs</h3>
                <select onChange={e => handleAddSongFromDB(e.currentTarget.value)} className="dropdown">
                    <option>-- Select Song --</option>
                {SongsStore.songs.map(song => (
                    <option value={song.title}>{song.title}</option>
                ))}
                </select>
                <span onClick={() => SetAddSong(false)}>Cancel</span>
            </div>            
            </>
        ) : (
            <>
            <div>
                <div className={Style.header}>
                    <h2 className={Style.title}>Setlist</h2> 
                    <span onClick={() => SetAddSong(true) }>+ Add a Song</span>
                </div>
            </div>
                <DragSortableList items={drag} onSort={handleSort} type="vertical"/>
            <div className={Style.buttons}>
                <span onClick={handleUpdateSetlist} className={Style.primaryButton} >Update Setlist</span>
                <span onClick={() => cancel(false)} className={Style.secundaryButton}>Cancel</span>
            </div>
            </>
        )}
        
        
    </article>
   
    </>
  );
});


export default Setlist;