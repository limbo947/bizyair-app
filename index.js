import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

const nativeErrorUtils = global.ErrorUtils;
if (nativeErrorUtils) {
  const prevHandler = nativeErrorUtils.getGlobalHandler();
  nativeErrorUtils.setGlobalHandler((error, isFatal) => {
    if (Platform.OS === 'android' && error && error.message) {
      if (error.message.includes('undefined is not a function') && isFatal) {
        console.error('Intercepted fatal error:', error.message);
        return;
      }
    }
    if (prevHandler) {
      prevHandler(error, isFatal);
    }
  });
}

registerRootComponent(App);
