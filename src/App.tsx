import React, {Component} from 'react';
import './App.css';
import Lists from "./containers/Lists";
import Items from "./containers/Items";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import EditList from "./containers/EditList";
import EditItem from "./containers/EditItem";


class App extends Component {

  render() {
    return (
      <div style={{marginRight: "auto", marginLeft: "auto", paddingTop: "54px", overflowX: "hidden", maxWidth: "1000px"}} className="App">

        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route exact path="/list/add" children={<EditList/>}/>
            <Route exact path="/list/:listId" children={<Items/>}/>
            <Route exact path="/list/:listId/edit" children={<EditList/>}/>
            <Route exact path="/list/:listId/item/add" children={<EditItem/>}/>
            <Route exact path="/list/:listId/item/:itemId" children={<EditItem/>}/>
            <Route path="/" children={<Lists />}/>
          </Switch>
        </Router>

        <link
          rel="stylesheet"
          href="https://bootswatch.com/4/superhero/bootstrap.min.css"
          crossOrigin="anonymous"
        />
      </div>
    );
  }

}

export default App
