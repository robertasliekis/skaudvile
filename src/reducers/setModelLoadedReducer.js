const initialState = {
  modelLoaded: false
};

const setModelLoadedReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MODEL_LOADED":
      return { ...state, modelLoaded: action.payload };
    default:
      return state;
  }
};

export default setModelLoadedReducer;
