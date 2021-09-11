import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Alert, View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';

import { useSelector, useDispatch } from 'react-redux';
import { setScanned } from '../store/actions/actions';

const { width } = Dimensions.get('window')

function QRScanner(props) {

    const scanner = useSelector(state => state.scanner);
    const dispatch = useDispatch();

    const [hasPermission, setHasPermission] = useState(null);
    const navigation = useNavigation();


    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

   
    if (hasPermission === false) {
        return <Alert>No access to camera</Alert>;
    }

    return (

        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanner.scanned ? undefined : props.scanEventHandler}
                style={StyleSheet.absoluteFillObject}
            />
            <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />

            <Text style={styles.cancel} onPress={props.toggleScanner}>Cancel</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    cancel: {
        top: '20%',
        fontSize: width * 0.05,
        textAlign: 'center',
        alignSelf: 'flex-end',
        width: '100%',
        color: 'white'
    }
});

export default QRScanner;