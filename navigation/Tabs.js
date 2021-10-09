import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { setScanned } from '../store/actions/actions';

import ScannerTab from './ScannerTab';
import RegistrationTab from './RegistrationTab';
import ListTab from './ListTab';

const Tab = createBottomTabNavigator();


const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -30,
            justifyContent: 'center',
            alignItems: 'center',
            ...style.shadow
        }}
        onPress={onPress}
    >
        <View style={{
            width: 60,
            height: 60,
            borderRadius: 35,
            backgroundColor: '#e32f45'
        }}>
            {children}
        </View>
    </TouchableOpacity>
)



const Tabs = () => {

    const dispatch = useDispatch();

    return (
        <Tab.Navigator
            initialRouteName={'BarcodeScanner'}
            tabBarOptions={{
                showLabel: false,
                style: {
                    // position: 'absolute',
                    // bottom: 25,
                    // paddingTop: 25,
                    // left: 20,
                    // right: 20,
                    elevation: 0,
                    backgroundColor: '#ffffff',
                    // borderRadius: 15,
                    height: 60,
                    ...style.shadow
                }
            }}
        >
            <Tab.Screen name="Register" component={RegistrationTab} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../assets/images/register.png')}
                            resizeMode='contain'
                            style={{
                                width: 20,
                                height: 20,
                                marginBottom: 5,
                                tintColor: focused ? '#e32f45' : '#748c94'
                            }}
                        />
                        <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                            Register
                        </Text>
                    </View>
                ),
            }}
            />
            <Tab.Screen name="BarcodeScanner" component={ScannerTab} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={require('../assets/images/barcode-scanner.png')}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: '#fff'
                        }}
                    />
                ),
                tabBarButton: (props) => (
                    <CustomTabBarButton {...props} />
                )
            }}
                listeners={{
                    tabPress: e => {
                        dispatch(setScanned(false));
                    }
                }}
            />
            <Tab.Screen name="List" component={ListTab} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../assets/images/list.png')}
                            resizeMode='contain'
                            style={{
                                width: 20,
                                height: 20,
                                marginBottom: 5,
                                tintColor: focused ? '#e32f45' : '#748c94'
                            }}
                        />
                        <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                            List
                        </Text>
                    </View>
                ),
            }}
            />
        </Tab.Navigator>
    );
}

const style = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})

export default Tabs;