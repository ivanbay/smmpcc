import React from 'react';
import {
    NativeBaseProvider,
    ScrollView,
    VStack,
    Center,
    Text
} from 'native-base';
import { View, ImageBackground, StyleSheet } from 'react-native';
import SelfRegistrationForm from '../../components/web/SelfRegistrationForm';

export default class SelfRegistration extends React.Component {

    render() {

        const bgImage = { uri: require('../../assets/bg.jpg') }

        return (
            <NativeBaseProvider>
                <ImageBackground source={bgImage}
                    style={{
                        flex: 1,
                        resizeMode: 'cover',
                        justifyContent: 'center',
                        width: null,
                        height: null
                    }}
                >

                    <View style={styles.overlay}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 25}}>
                            <SelfRegistrationForm />
                        </ScrollView>
                    </View>

                </ImageBackground >
                <VStack safeAreaBottom alignItems='center' style={styles.footer}>
                    <Center>
                        <Text mb={1} fontSize={'xs'} color='white'>SMMP Amadeo | New Normal Team</Text>
                        <Text fontSize={'xs'} color='white'>© 2021</Text>
                    </Center>
                </VStack>
            </NativeBaseProvider>
        )
    }
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        height: '100%'
    },
    footer: {
        padding: '10px',
        backgroundColor: '#32454b',
        height: 50,
    }
})