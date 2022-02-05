import { applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk';

const initialstate = {};

const middleware = [thunk]

const store =  createStore(() => [], {}, applyMiddleware());