import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Rootnavigator from './src/utils/Rootnavigator';
import {Provider} from 'react-redux';
import store, {persistor} from './src/utils/store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer style={{backgroundColor: 'transparent'}}>
          <Rootnavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
