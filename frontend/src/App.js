import React, {Component} from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Login from "./components/Login/Login";
import Chat from "./components/Chat/Chat";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/chat/:chatId" component={Chat}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App;
