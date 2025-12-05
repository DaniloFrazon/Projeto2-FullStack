import React, { createContext, useReducer } from "react";

const initialState = {
  games: [],
  loading: false,
  error: null,
  filters: { query: "", platform: "", genre: "", year: "" }
};

const gameReducer = (state, action) => {
  switch(action.type){
    case "SET_FILTERS":
      return {...state, filters: {...state.filters, ...action.payload}};
    case "FETCH_START":
      return {...state, loading:true, error:null};
    case "FETCH_SUCCESS":
      return {...state, loading:false, games: action.payload};
    case "FETCH_ERROR":
      return {...state, loading:false, error: action.payload};
    default:
      return state;
  }
};

export const GameContext = createContext();
export const GameProvider = ({children}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{state, dispatch}}>{children}</GameContext.Provider>
};