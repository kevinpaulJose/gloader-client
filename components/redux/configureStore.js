import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

import { user } from "./user";

import { persistStore, persistCombineReducers } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ConfigureStore = () => {
  const config = {
    key: "root",
    storage: AsyncStorage,
    debug: true,
  };
  const store = createStore(
    persistCombineReducers(config, {
      user,
    }),
    applyMiddleware(thunk)
  );
  const persistor = persistStore(store);
  return { persistor, store };
};
