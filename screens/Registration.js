import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';
import { ToastAndroid, Alert, KeyboardAvoidingView } from 'react-native';
import {
    Input,
    VStack,
    Button,
    Heading,
    FormControl,
    Icon,
    NativeBaseProvider,
    Box,
    Select,
    ScrollView,
    View
} from 'native-base';
import QRScanner from './QRScanner';

import RegistrationService from '../Services/RegistrationService';
import QRRegistrationForm from '../components/QRRegistrationForm';


class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showScanner: false
        };
    }

    toggleScanner = () => {
        this.props.setScanned(false);
        this.setState({ showScanner: !this.state.showScanner });
    }


    qrHandler = ({ data }) => {
        this.props.setScanned(true);
        this.setState({ showScanner: false, qrCode: data });
    }

    processRegistration = data => {

        RegistrationService.create(this.state.qrCode, data)
            .then(() => {
                ToastAndroid.show('Registration successful', ToastAndroid.SHORT);
            })
            .catch(() => {
                Alert.alert(
                    "Registration Error",
                    "Registration did not proceed! Check your internet connection or report this to system administrator.",
                    [{ text: "OK" }],
                    { cancelable: false }
                );
                return false;
            });

        return true;
    }



    render() {

        if (this.state.showScanner) {

            return (<QRScanner scanEventHandler={this.qrHandler} toggleScanner={this.toggleScanner} />)

        } else {

            return (

                <NativeBaseProvider>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="height"
                    >
                        <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 30 }}>
                            <QRRegistrationForm
                                toggleScanner={this.toggleScanner}
                                formSubmit={this.processRegistration}
                                qrCode={this.state.qrCode} />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </NativeBaseProvider>
            )

        }

    }

}


const mapDispatchToProps = dispatch => {
    return {
        setScanned: value => dispatch(actions.setScanned(value))
    }
}

export default connect(null, mapDispatchToProps)(Registration);