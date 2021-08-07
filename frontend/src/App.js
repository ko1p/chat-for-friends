import React, {Component} from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Signin from "./components/Signin/Signin";
import RoomSwitcher from "./components/RoomSwitcher/RoomSwitcher";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Signin}/>
                    <Route exact path="/chat/:chatId" component={RoomSwitcher}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App;
