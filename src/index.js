import { createRoot } from 'react-dom/client'; 
import React from 'react';
const root = createRoot(document.querySelector('#root'));
import { Provider, connect } from 'react-redux';
import store, { fetchImages, uploadImage } from './store';
import { HashRouter as Router, Link, Route } from 'react-router-dom';

const ImageUpload = connect(
  null,
  dispatch => {
    return {
      uploadImage: (image)=> dispatch(uploadImage(image))
    }
  }
)(
  class ImageUpload extends React.Component{
    componentDidMount(){
      this.el.addEventListener('change', (ev)=> {
        const file = ev.target.files[0];
        const { name } = file;
        const fileReader = new FileReader();
        fileReader.addEventListener('load', async()=> {
          const image = {
            name,
            data: fileReader.result
          };
          await this.props.uploadImage(image);
          this.el.value = '';
        });
        fileReader.readAsDataURL(file);
        console.log(name);
      });

    }
    render(){
      return (
        <form>
          <input type='file' ref={ el => this.el = el } />
        </form>
      );
    }
  }
);

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
                <img src={ image.data } />
              </li>
            );
          })
        }
      </ul>
      <ImageUpload />
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
        <Route path='/images' component={ Images }/>
      </main>
    );
  }
});

root.render(<Provider store={ store }>
  <Router>
    <App />
  </Router>
</Provider>);
