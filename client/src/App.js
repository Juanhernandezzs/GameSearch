import './App.css';
import React from 'react'
import Landing from './components/Landing';
import { Route, Switch, Link } from "react-router-dom";
import GameDetail from './components/GameDetail';
import Home from './components/Home';
import SearchBar from './components/SearchBar';
import AddGame from './components/AddGame';
import logo from './assets/icon.png'

function App() {
  return (
    <div className="App box">
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route path='/videogames'>
          <nav className='navbar'>
            <div className='container'>
              <div className='logo'>
                <Link className='logo__link' to={'/videogames'}>
                  <img className='logo__icon' src={logo} alt='logo'/>
                  <h1>Game Search</h1>
                </Link>
              </div>
              <SearchBar />
              <div></div>
            </div>
          </nav>
          <div className='box'>
            <div className='container box'>
              <Switch>
                <Route exact path='/videogames' component={Home} />
                <Route path='/videogames/create' component={AddGame} />
                <Route path='/videogames/edit/:idVideogame' component={AddGame} />
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
