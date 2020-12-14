import React from "react";
import './App.css';
import Style from "./style/homeScreen.module.css";
import {Switch, Route} from "react-router-dom";
import Sets from "./containers/Sets/Sets";
import {useStore} from "./hooks/useStore";
import {observer} from "mobx-react-lite";
import PlayView from "./containers/PlayView/PlayView";
import Header from "./containers/header/Header";
import Devices from "./containers/Sidebars/Devices/Devices";
import Messages from "./containers/Sidebars/Messages/Messages";
import Editor from "./containers/Editor/Editor";
import NewDevice from "./containers/NewDevice/NewDevice";
import NewSet from "./containers/NewSet/NewSet";
import Keys from "./components/Keyboard/Keys";
import NumberKeys from "./components/Keyboard/NumberKeys";

const App = observer(() => {

  const {connected, UiStore} = useStore();

  return (
    <>
    <Switch>
    {connected ? (
      <>
      <Header />
      <div className={ Style.container}>
        <div className={UiStore.keyboard ? Style.containerWithKeyboard : Style.content}>
          <Route exact path="/">
            <Sets />
          </Route>
          <Route exact path="/playview">
            <PlayView />
          </Route>
          <Route exact path="/editor/:id">
            <Editor />
          </Route>
          <Route exact path="/newDevice/:id">
            <NewDevice />
          </Route>
          <Route path="/newSet">
            <NewSet />
          </Route>
        </div>
        <div className={Style.sideBar}>
          {UiStore.devices && (
            <>
            <Devices />    
            </>
          )}
          {UiStore.messages && (
            <>
            <Messages />    
            </>
          )}
          {UiStore.keyboard && (
            <>
            <Keys />    
            </>
          )}
          {UiStore.numberKeyboard && (
            <>
            <NumberKeys />    
            </>
          )}
        </div>
      </div>
      
      </>
    ) : (
      <>  
      <p>Loading</p>
      </>
    )}
    </Switch>
    </>
  );
});

export default App;

