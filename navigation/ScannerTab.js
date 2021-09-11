import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailScanner from '../screens/DetailScanner';


const Stack = createStackNavigator();


const ScannedDetails = () => {
    return (
        <Text>Hellow</Text>
    )
}

const ScannerTab = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DetailScanner" component={DetailScanner} />
            {/* <Stack.Screen name="ScannedDetails" component={ScannedDetails} /> */}
        </Stack.Navigator>
    );
}


export default ScannerTab;