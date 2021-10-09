import * as React from 'react';
import { View, Text, Button, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import reducers from './store/reducers/reducers';

import Tabs from './navigation/Tabs';

import SelfRegistration from './screens/web/SelfRegistration';

// const Tabs = Platform.select({
//     android: () => require('./navigation/Tabs'),
//     default: null
// });

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}


const store = createStore(reducers, composeEnhancers());

const isWeb = Platform.OS === 'web';

const Stack = createStackNavigator();


export default function App() {

    if (isWeb) {
        return (
            <NavigationContainer linking={{
                prefixes: ["http://127.0.0.1"],
                config: {
                    screens: {
                        Home: "/",
                        Details: "/details"
                    }
                }
            }}>
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }}>
                    <Stack.Screen name="contact-tracing/selfregistration" component={SelfRegistration} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    } else {
        return (
            <Provider store={store} >
                <NavigationContainer>
                    <Tabs />
                </NavigationContainer>
            </Provider>
        )
    }

}

