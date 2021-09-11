import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './utility';

const initialState = {
    schedule: null,
}

const setSchedule = (state, schedule) => updateObject(state, { schedule: schedule })

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SCHEDULE: return setSchedule(state, action.payload.schedule);
        default: return state;
    }

}