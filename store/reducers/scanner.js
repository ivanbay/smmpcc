import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './utility';

const initialState = {
    scanned: true,
}

const setScanned = (state, isScanned) => updateObject(state, { scanned: isScanned })

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SCANNED: return setScanned(state, action.payload.isScanned);
        default: return state;
    }

}