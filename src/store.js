import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const images = (state = [], action)=> {
  if(action.type === 'SET_IMAGES'){
    return action.images;
  }
  else if(action.type === 'CREATE_IMAGE'){
    return [...state, action.image];
  }
  return state;
};

const store = createStore(
  combineReducers({
    images
  }),
  applyMiddleware(thunk, logger)
);

export const uploadImage = (image)=> {
  return async(dispatch)=> {
    const response = await axios.post('/api/images', image);
    dispatch({ type: 'CREATE_IMAGE', image: response.data});
  }
};

export const fetchImages = ()=> {
  return async(dispatch)=> {
    return dispatch({ images: (await axios.get('/api/images')).data, type: 'SET_IMAGES' });
  };
};

export default store;
