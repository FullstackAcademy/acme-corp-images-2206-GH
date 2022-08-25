import { createRoot } from 'react-dom/client'; 
import React from 'react';
const root = createRoot(document.querySelector('#root'));
import { Provider, connect } from 'react-redux';
import store, { fetchImages } from './store';
import { HashRouter as Router, Link, Route } from 'react-router-dom';


const Images = connect(
  state => state
)(({ images })=> {
  return (
    <div>
      <ul>
        {
          images.map( image => {
            return (
              <li key= { image.id }>
                { image.name }
              </li>
            );
          })
        }
      </ul>
    </div>
  );
});

const App = connect(
  state => state,
  dispatch => {
    return {
      fetchImages: ()=> dispatch(fetchImages())
    }
  }
)(class App extends React.Component{
  async componentDidMount(){
    try {
      await this.props.fetchImages();
    }
    catch(ex){
      console.log(ex);
    }
  }
  render(){
    return (
      <main>
        <nav>
          <Link to='/'>Home</Link>
          <Link to='/images'>Images</Link>
        </nav>
        <Route to='/images' component={ Images }/>
      </main>
    );
  }
});

root.render(<Provider store={ store }>
  <Router>
    <App />
  </Router>
</Provider>);
