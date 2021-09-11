import React from 'react';
import { StyleSheet, Alert, ToastAndroid, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';
import {
    NativeBaseProvider,
    ScrollView,
    Text,
    VStack,
    Box,
    Button,
    Icon,
    Heading
} from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import moment from 'moment';
import QRScanner from '../screens/QRScanner';
import RegistrationService from '../Services/RegistrationService';
import AttendanceService from '../Services/AttendanceService';


class DetailsScanner extends React.Component {

    initialState = {
        test: null,
        qrCode: null,
        fullname: null,
        age: null,
        address: null,
        contactNumber: null
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.initialState
        };
    }

    qrHandler = ({ data }) => {
        this.props.setScanned(true);

        RegistrationService.fetchById(data)
            .then(d => {
                if (d.exists() == false) {
                    Alert.alert(
                        "No record found",
                        "QR Code not registered to database.",
                        [
                            { text: "Register", onPress: () => this.props.navigation.navigate('Register') },
                            { text: "Cancel" }
                        ],
                    );
                } else {
                    this.setState({
                        address: d.val().address,
                        age: d.val().age,
                        fullname: d.val().lastname + ", " + d.val().firstname,
                        qrCode: d.val().qrCode,
                        contactNumber: d.val().contactNumber
                    })
                }

            })
            .catch(e => {
                Alert.alert(
                    "Scan Error",
                    "QR Code scanning did not proceed! Check your internet connection or report this to system administrator.",
                    [{ text: "OK" }],
                    { cancelable: false }
                );
                return false;
            });;
    }

    confirmBtnHandler = () => {
        if (this.state.qrCode !== null) {

            let data = {
                qrCode: this.state.qrCode,
                fullname: this.state.fullname,
                age: this.state.age,
                address: this.state.address,
                contactNumber: this.state.contactNumber,
                timein: moment().format('YYYY-MM-DD hh:mm:ss')
            }

            AttendanceService.create(this.state.qrCode, data)
                .then(() => {
                    ToastAndroid.show('Attendance confirmed!', ToastAndroid.SHORT);
                    this.toggleScanner();
                })
                .catch(e => {
                    Alert.alert(
                        "Error",
                        "Transaction did not proceed! Check your internet connection or report this to system administrator.",
                        [{ text: "OK" }],
                        { cancelable: false }
                    );
                    return false;
                });
        }
    }

    toggleScanner = () => {
        this.props.setScanned(true);
        this.setState({ ...this.initialState });
    }

    buttonElement = () => {
        if (this.state.qrCode == null) {
            return (
                <VStack style={style.row}>
                    <Text style={{ color: "red", fontStyle: "italic", textAlign: "center", fontSize: 25 }}>Tap Scan Button to scan QR</Text>
                </VStack>
            )
        } else {
            return (
                <>
                    <Button colorScheme="teal" onPress={this.confirmBtnHandler}>Confirm</Button>
                    <Button _text={{ color: 'white' }} colorScheme="danger" mt={2} onPress={this.toggleScanner}>Cancel</Button>
                </>
            );
        }
    }

    render() {

        if (this.props.scanner.scanned == false) {

            return (<QRScanner scanEventHandler={this.qrHandler} toggleScanner={this.toggleScanner} />)

        } else {

            return (

                <NativeBaseProvider>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="height"
                    >
                        <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 30 }}>
                            <Box
                                flex={1}
                                p={2}
                                mt={20}
                                w="90%"
                                mx='auto'
                            >
                                <Heading size="xl" color='primary.500'>
                                    Contact Tracing
                                </Heading>
                                <Heading color="muted.400" size="xs">
                                    Information attached to the QR Code
                                </Heading>

                                <Box
                                    flex={1}
                                    p={2}
                                    mt={20}
                                    w="90%"
                                    mx='auto'
                                >
                                    <VStack style={style.row}>
                                        <Text style={style.label} adjustsFontSizeToFit ><Icon as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="qrcode" size={5} /> QR Code</Text>
                                        <Text fontSize={35} adjustsFontSizeToFit fontWeight='bold'>{this.state.qrCode}</Text>
                                    </VStack>

                                    <VStack style={style.row}>
                                        <Text style={style.label}><Icon as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="account" size={5} /> Full Name</Text>
                                        <Text fontSize={35} fontWeight='bold'>{this.state.fullname}</Text>
                                    </VStack>

                                    <VStack style={style.row}>
                                        <Text style={style.label}><Icon as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="account-multiple-plus" size={5} /> Age</Text>
                                        <Text fontSize={35} fontWeight='bold'>{this.state.age}</Text>
                                    </VStack>

                                    <VStack style={style.row}>
                                        <Text style={style.label}><Icon as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="home" size={5} /> Contact Number</Text>
                                        <Text fontSize={35} fontWeight='bold'>{this.state.contactNumber}</Text>
                                    </VStack>

                                    <VStack style={style.row}>
                                        <Text style={style.label}><Icon as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="home" size={5} /> Barangay/Address</Text>
                                        <Text fontSize={35} fontWeight='bold'>{this.state.address}</Text>
                                    </VStack>


                                    {this.buttonElement()}

                                </Box>
                            </Box>

                        </ScrollView>
                    </KeyboardAvoidingView>
                </NativeBaseProvider>

            )

        }
    }

}

const style = StyleSheet.create({
    row: {
        height: 50,
        textAlign: 'center',
        marginBottom: 40
    },
    label: {
        marginBottom: 2,
        fontStyle: "italic",
        color: "#A1A1A1"
    }
});

const mapStateToProps = state => {
    return {
        scanner: state.scanner,
        scheduler: state.schedule
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setScanned: value => dispatch(actions.setScanned(value)),
        setSchedule: sched => dispatch(actions.setSchedule(sched)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsScanner);