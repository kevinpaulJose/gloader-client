import { StatusBar } from "expo-status-bar";
import React from "react";
import Navigator from "./components/NavigationComponent";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigureStore } from "./components/redux/configureStore";

const { persistor, store } = ConfigureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Navigator />
        </PersistGate>
      </Provider>
    );
  }
}
