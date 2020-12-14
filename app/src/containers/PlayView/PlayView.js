import React from "react";
import {useStore} from "../../hooks/useStore";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import Style from "./PlayView.module.css";


const PlayView = observer(() => {

    const {PlayStore} = useStore();

    const currentSong = PlayStore.currentSong;
    const currentSetlist = PlayStore.currentSetlist;
    const currentSegments = toJS(PlayStore.currentSegments);

    return (
        <>
        <div className={Style.container}>
            <div>
                {currentSong && (
                    <>
                    {PlayStore.checkLivestream(currentSong)}
                    {PlayStore.handleDynamicEffect(currentSong)}
                    <p className={Style.songTitle}>{currentSong.title}</p>
                    {currentSong.segments.map(segment => (
                        <>
                        <p className={currentSegments.title === segment.title ? Style.currentSegment : Style.segment}>{segment.title}</p>
                        </>
                    ))}
                    </>
                )}
            </div> 
            <div className={Style.setlist}>
                {currentSetlist.map(song => (
                    <>
                    <p>{song.title}</p>
                    </>
                ))}
            </div>
        </div>
        </>
    )



});

export default PlayView;