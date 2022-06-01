import { StatusBar } from "expo-status-bar";
import React from "react";
import Navigator from "./components/NavigationComponent";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigureStore } from "./components/redux/configureStore";
import { LogBox } from "react-native";

const { persistor, store } = ConfigureStore();
LogBox.ignoreLogs([/ViewPropTypes/]);
LogBox.ignoreLogs([/useNativeDriver/]);
LogBox.ignoreLogs([/VirtualizedLists/]);

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
