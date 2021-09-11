export const updateObject = (prevState, newState) => {
    return {
        ...prevState,
        ...newState
    }
}