import React from "react";
import './App.css';
import {Switch, Route} from "react-router-dom";
import Sets from "./containers/Sets/Sets";
import Set from "./containers/Set/Set";
import {useStore} from "./hooks/useStore";
import {observer} from "mobx-react-lite";
import PlayView from "./containers/PlayView/PlayView";
import Header from "./containers/header/Header";
import Devices from "./containers/Devices/Devices";

const App = observer(() => {

  const {connected} = useStore();

  return (
    <>
    <Switch>
    {connected ? (
      <>
      <Header />
      <Route exact path="/">
        <Sets />
      </Route>
      <Route exact path="/set/:id">
        <Set />
      </Route>
      <Route exact path="/playview/:setId">
        <PlayView />
      </Route>
      <Route exact path="/devices">
        <Devices />
      </Route>
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

