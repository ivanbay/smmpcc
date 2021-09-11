import React, { useState, useEffect } from 'react';
import {
    Input,
    VStack,
    Button,
    Heading,
    FormControl,
    List,
    Box,
    Select,
    Modal,
    Text,
    AlertDialog,
    Icon,
    View
} from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker';
import { Image, StyleSheet, Platform } from 'react-native';
import SvgQRCode from 'react-native-qrcode-svg';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import RegistrationService from '../../Services/RegistrationService';

const SelfRegistrationForm = (props) => {

    const initialState = {
        qrCode: null,
        firstname: null,
        lastname: null,
        age: null,
        contactNumber: null,
        address: null,
        selBrgy: null
    }

    const [inputField, setInputField] = useState({ ...initialState });
    const [showAddressTextbox, setShowAddressTextbox] = useState(false);
    const [image, setImage] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showNotice, setShowNotice] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [qrCode, setQrCode] = useState(null);

    const logo = { uri: require('../../assets/logo.png') }


    useEffect(() => {

        setShowNotice(true);

        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })
    }, [])

    const inputHandler = (field, value) => {
        setInputField({ ...inputField, [field]: value });
    }

    const resetForm = () => {
        setInputField({ ...initialState });
        setShowAddressTextbox(false);
    }

    const uploadPhoto = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1]
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    }

    const register = () => {

        if ((inputField.lastname == null || inputField.lastname == "")
            || (inputField.firstname == null || inputField.firstname == "")
            || (inputField.age == null || inputField.age == "")
            || (inputField.contactNumber == null || inputField.contactNumber == "")
            || (inputField.address == null || inputField.address == "")) {

            alert("Error: All fields are required!", [{ text: "OK" }], { cancelable: false });
            return false;
        }

        if (image == null) {
            alert("Error: Picture is required!", [{ text: "OK" }], { cancelable: false });
            return false;
        }

        // checkIfExist();

        var uid = Math.ceil(Date.now() + Math.random());



        let data = {
            qrCode: uid,
            lastname: inputField.lastname,
            firstname: inputField.firstname,
            age: inputField.age,
            contactNumber: inputField.contactNumber,
            address: inputField.address
        }


        setIsProcessing(true);
        RegistrationService.create(uid, data)
            .then(() => {

                RegistrationService.uploadPhoto(uid, image)
                    .then(() => {
                        RegistrationService.getPhotoUrl(uid).then(imageUri => {
                            setImage(imageUri);

                            setIsRegistered(true);
                            setQrCode(uid);
                            setShowDialog(true);

                            setIsProcessing(false);
                        })
                    });

            });

        return true;

    }


    const addressSelection = addr => {

        if (addr == "OTHERS") {
            setShowAddressTextbox(true);
            setInputField({ ...inputField, address: null, selBrgy: addr });
        } else {
            setShowAddressTextbox(false);
            setInputField({ ...inputField, address: addr, selBrgy: addr });
        }

    }


    const RegistrationForm = () => {

        let addrBox = (
            <FormControl>
                <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                    Address
                </FormControl.Label>
                <Input value={inputField.address} onChangeText={value => inputHandler("address", value)} />
            </FormControl>
        );

        return (
            <Box
                flex={1}
                p={2}
                mt={5}
                w="90%"
                mx='auto'
            >

                {/* <Image style={{ alignSelf: 'center', height: 60, width: 60 }} resizeMode={'cover'} source={logo} /> */}

                <VStack space={2} mt={5} />

                <Heading size="xl" color='primary.500'>
                    QR Code Registration
                </Heading>
                <Heading color="muted.400" size="xs">
                    Please input basic information.
                </Heading>

                <VStack space={2} mt={5}>

                    <FormControl>
                        <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                            First Name
                        </FormControl.Label>
                        <Input value={inputField.firstname} onChangeText={value => inputHandler("firstname", value)} style={{ borderColor: '#000000' }} />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                            Last Name
                        </FormControl.Label>
                        <Input value={inputField.lastname} onChangeText={value => inputHandler("lastname", value)} style={{ borderColor: '#000000' }} />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                            Age
                        </FormControl.Label>
                        <Input keyboardType="numeric" value={inputField.age} onChangeText={value => inputHandler("age", value)} style={{ borderColor: '#000000' }} />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                            Contact Number
                        </FormControl.Label>
                        <Input keyboardType="numeric" value={inputField.contactNumber} onChangeText={value => inputHandler("contactNumber", value)} style={{ borderColor: '#000000' }} />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                            Barangay
                        </FormControl.Label>
                        <Select
                            selectedValue={inputField.selBrgy}
                            minWidth={200}
                            placeholder="Select barangay"
                            onValueChange={addr => addressSelection(addr)}
                            borderColor="#000000"
                        >

                            <Select.Item label="Poblacion 1" value="1" />
                            <Select.Item label="Poblacion 2" value="2" />
                            <Select.Item label="Poblacion 3" value="3" />
                            <Select.Item label="Poblacion 4" value="4" />
                            <Select.Item label="Poblacion 5" value="5" />
                            <Select.Item label="Poblacion 6" value="6" />
                            <Select.Item label="Poblacion 7" value="7" />
                            <Select.Item label="Poblacion 8" value="8" />
                            <Select.Item label="Poblacion 9" value="9" />
                            <Select.Item label="Poblacion 10" value="10" />
                            <Select.Item label="Poblacion 11" value="11" />
                            <Select.Item label="Poblacion 12" value="12" />
                            <Select.Item label="OTHERS" value="OTHERS" />

                        </Select>
                    </FormControl>

                    {showAddressTextbox ? addrBox : null}

                </VStack>

                <VStack space={2} mt={5} />

                <Button _text={{ color: 'white' }} size={"lg"} onPress={uploadPhoto} colorScheme={"gray"}>
                    {image !== null ? "Uploaded" : "Upload Photo"}
                </Button>

                <VStack space={2} mt={5} />

                <Button _text={{ color: 'white' }} size={"lg"} onPress={register} isLoading={isProcessing} isLoadingText="Processing...">
                    Generate QR Code
                </Button>

            </Box>
        )
    }

    const RegistrationDetails = () => {
        return (
            <Box
                flex={1}
                p={2}
                mt={10}
                w="90%"
                mx='auto'
            >

                <Image style={{
                    alignSelf: 'center',
                    height: 150,
                    width: 150
                }}
                    resizeMode={'cover'}
                    source={{ uri: image }} />


                <Heading mt={5} mb={5} textAlign="center " size="xl" color='primary.500'>
                    QR Information
                </Heading>

                <VStack mb={5} style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}>
                    {qrCode && <SvgQRCode value={qrCode + ''} size={RFPercentage(30)} />}
                </VStack>


                <Box
                    flex={1}
                    p={2}
                    w="90%"
                    mx='auto'
                >
                    <VStack style={style.row}>
                        <Text fontSize={"xl"} noOfLines={1} fontWeight='bold'><Icon mr={3} as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="account" size={"sm"} /> {inputField.lastname}, {inputField.firstname}</Text>
                    </VStack>

                    <VStack style={style.row}>
                        <Text fontSize={"xl"} noOfLines={1} fontWeight='bold'><Icon mr={3} as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="alarm-plus" size={"sm"} /> {inputField.age} y/o</Text>
                    </VStack>

                    <VStack style={style.row}>
                        <Text fontSize={"xl"} noOfLines={1} fontWeight='bold'><Icon mr={3} as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="phone" size={"sm"} /> {inputField.contactNumber}</Text>
                    </VStack>

                    <VStack style={style.row}>
                        <Text fontSize={"xl"} noOfLines={1} fontWeight='bold'><Icon mr={3} as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="home" size={"sm"} /> {(/^-?\d+$/.test(inputField.address)) ? 'Poblacion ' + inputField.address : inputField.address}</Text>
                    </VStack>

                </Box>

                <VStack space={2} mt={5} />

                {image && <Image soure={{ uri: image }} style={{ width: 50, height: 50 }} />}

            </Box>
        )
    }

    const Dialog = () => {
        return (
            <AlertDialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                motionPreset={"fade"}
            >
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <Heading size="md">Successful registration</Heading>
                    </AlertDialog.Header>

                    <VStack space={2} mt={2} />

                    <AlertDialog.Body>
                        <Text mb={3} fontSize={"sm"}>Thank you for your registration!</Text>
                        <Text mb={5} fontSize={"sm"}>Kindly take a screenshot of your registration after closing this dialog.</Text>
                        <Text fontSize={"lg"}>Stay Safe!</Text>
                    </AlertDialog.Body>

                    <AlertDialog.Footer>
                        <Button colorScheme="green" size={"sm"} onPress={() => setShowDialog(false)} >
                            Ok
                        </Button>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        )
    }

    const Notice = () => {
        return (
            <Modal isOpen={showNotice} onClose={() => setShowNotice(false)} >
                <Modal.Content maxWidth="400px">
                    <Modal.Header>
                        <Heading size="sm">Welcome to QR Code Self Registration</Heading>
                    </Modal.Header>

                    <VStack space={2} mt={10} />

                    <Modal.Body>
                        <Heading fontSize={15}>KEY REMINDERS:</Heading>
                        <List.Ordered spacing={2} style={{ border: "none" }}>
                            <List.Item>Please enter CORRECT information only.</List.Item>
                            <List.Item>Upload clear photo, it is required for validation during Contact Tracing.</List.Item>
                            <List.Item>After successful registration, take a screenshot of your registration with generated QR Code.
                                This will be presented to Contact Tracing Team before entering Church premises.</List.Item>
                        </List.Ordered>

                        <VStack space={2} mt={5} />
                        <Text mb={5} italic fontSize="sm" color='red.500'>All information provided will be used for Contact Tracing purposes only.</Text>
                        <Text italic fontSize="sm" color='red.500'>This QR Code system is specifically designed for <Text bold italic color='red.500'>SMMP Amadeo Contact Tracing team</Text>, therefore, QR Code generated here has no use for other purposes.</Text>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button size={"sm"} colorScheme={"blue"} onPress={() => setShowNotice(false)} >
                                Proceed
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        )
    }

    return (
        <div>
            <Dialog />
            <Notice />
            {!isRegistered ? RegistrationForm() : RegistrationDetails()}
        </div>
    )

}


export default SelfRegistrationForm;

const style = StyleSheet.create({
    row: {
        marginBottom: 10
    },
    label: {
        marginBottom: 2,
        fontStyle: "italic",
        color: "#A1A1A1"
    }
});