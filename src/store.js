import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const images = (state = [], action)=> {
  if(action.type === 'SET_IMAGES'){
    return action.images;
  }
  return state;
};

const store = createStore(
  combineReducers({
    images
  }),
  applyMiddleware(thunk, logger)
);

export const fetchImages = ()=> {
  return async(dispatch)=> {
    return dispatch({ images: (await axios.get('/api/images')).data, type: 'SET_IMAGES' });
  };
};

export default store;
