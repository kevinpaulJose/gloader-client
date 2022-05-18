import * as ActionTypes from "./ActionTypes";

export const user = (
  state = {
    isLoading: false,
    errMess: null,
    data: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.USER_LOADING:
      return { ...state, isLoading: true, errMess: null, data: [] };
    case ActionTypes.USER_UPDATE:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        data: action.payload,
      };
    case ActionTypes.USER_ERROR:
      return { ...state, isLoading: false, errMess: "No Data Found", data: [] };
    default:
      return state;
  }
};
