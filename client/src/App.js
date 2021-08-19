import './App.css';
import React from 'react'
import Landing from './components/Landing';
import { Route, Switch, Link } from "react-router-dom";
import GameDetail from './components/GameDetail';
import Home from './components/Home';
import SearchBar from './components/SearchBar';
import AddGame from './components/AddGame';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route path='/videogames'>
          <nav className='navbar'>
            <div className='container'>
              <div className='logo'>
                <Link to={'/videogames'}>
                  <h1>Game Search</h1>
                </Link>
              </div>
              <SearchBar />
            </div>
          </nav>
          <div>
            <div className='container'>
              <Switch>
                <Route exact path='/videogames' component={Home} />
                <Route path='/videogames/create' component={AddGame} />
                <Route path='/videogames/:idVideogame' component={GameDetail} />
              </Switch>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
