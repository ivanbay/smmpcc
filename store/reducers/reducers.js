import scanner from './scanner';
import schedule from './schedule';
import { combineReducers } from 'redux';

const reducers = combineReducers({
    scanner: scanner,
    schedule: schedule
});

const rootReducer = (state, action) => {
    return reducers(state, action);
};

export default rootReducer;
