import * as actionTypes from './actionTypes';

export const setScanned = isScanned => {
    return {
        type: actionTypes.SET_SCANNED,
        payload: {
            isScanned: isScanned
        }
    }
}