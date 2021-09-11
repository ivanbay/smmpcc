import * as actionTypes from './actionTypes';

export const setSchedule = schedule => {
    return {
        type: actionTypes.SET_SCHEDULE,
        payload: {
            schedule: schedule
        }
    }
}