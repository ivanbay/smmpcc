import React, { useState, useEffect } from 'react';
import {
    Input,
    VStack,
    HStack,
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
import Moment from 'moment';
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
        birthday: null,
        bYear: null,
        bMonth: null,
        bDay: null,
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

    const bYearList = () => {
        let list = [];
        for (let i = 2020; i >= 1900; i--) {
            list.push(<Select.Item label={i} value={i} />);
        }

        return list;
    }

    const bMonthList = () => {
        let list = [];
        for (let i = 1; i <= 12; i++) {
            list.push(<Select.Item label={i} value={i} />);
            console.log(`<Select.Item label="${i}" value="${i}" />`);
        }
        return list;
    }

    const bDayList = () => {
        let list = [];
        for (let i = 1; i <= 31; i++) {
            list.push(<Select.Item label={i} value={i} />);
            console.log(`<Select.Item label="${i}" value="${i}" />`);
        }
        return list;
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

        if ((inputField.lastname === null || inputField.lastname === "")
            || (inputField.firstname === null || inputField.firstname === "")
            || (inputField.bYear === null && inputField.bMonth === null && inputField.bDay === null)
            || (inputField.contactNumber === null || inputField.contactNumber === "")
            || (inputField.address === null || inputField.address === "")) {

            alert("Error: All fields are required!", [{ text: "OK" }], { cancelable: false });
            return false;
        }

        inputHandler("birthday", `${inputField.bMonth}/${inputField.bDay}/${inputField.bYear}`);

        if (image == null) {
            alert("Error: Picture is required!", [{ text: "OK" }], { cancelable: false });
            return false;
        }

        // checkIfExist();

        var uid = Math.ceil(Date.now() + Math.random());

        setIsProcessing(true);
        RegistrationService.uploadPhoto(uid, image)
            .then(() => {
                RegistrationService.getPhotoUrl(uid).then(imageUri => {

                    let data = {
                        qrCode: uid,
                        lastname: inputField.lastname,
                        firstname: inputField.firstname,
                        birthday: Moment(inputField.birthday).format('MM/DD/YYYY'),
                        contactNumber: inputField.contactNumber,
                        address: inputField.address,
                        imageUri: imageUri,
                        registrationDate: Moment().format('YYYY-MM-DD hh:mm:ss')
                    }

                    RegistrationService.create(uid, data).then(() => {

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
                            Birthday
                        </FormControl.Label>
                        <HStack space="1">

                            <Select
                                selectedValue={inputField.bYear}
                                width={"32%"}
                                placeholder="Year"
                                onValueChange={value => inputHandler("bYear", value)}
                                borderColor="#000000"
                            >

                                <Select.Item label="2020" value="2020" />
                                <Select.Item label="2019" value="2019" />
                                <Select.Item label="2018" value="2018" />
                                <Select.Item label="2017" value="2017" />
                                <Select.Item label="2016" value="2016" />
                                <Select.Item label="2015" value="2015" />
                                <Select.Item label="2014" value="2014" />
                                <Select.Item label="2013" value="2013" />
                                <Select.Item label="2012" value="2012" />
                                <Select.Item label="2011" value="2011" />
                                <Select.Item label="2010" value="2010" />
                                <Select.Item label="2009" value="2009" />
                                <Select.Item label="2008" value="2008" />
                                <Select.Item label="2007" value="2007" />
                                <Select.Item label="2006" value="2006" />
                                <Select.Item label="2005" value="2005" />
                                <Select.Item label="2004" value="2004" />
                                <Select.Item label="2003" value="2003" />
                                <Select.Item label="2002" value="2002" />
                                <Select.Item label="2001" value="2001" />
                                <Select.Item label="2000" value="2000" />
                                <Select.Item label="1999" value="1999" />
                                <Select.Item label="1998" value="1998" />
                                <Select.Item label="1997" value="1997" />
                                <Select.Item label="1996" value="1996" />
                                <Select.Item label="1995" value="1995" />
                                <Select.Item label="1994" value="1994" />
                                <Select.Item label="1993" value="1993" />
                                <Select.Item label="1992" value="1992" />
                                <Select.Item label="1991" value="1991" />
                                <Select.Item label="1990" value="1990" />
                                <Select.Item label="1989" value="1989" />
                                <Select.Item label="1988" value="1988" />
                                <Select.Item label="1987" value="1987" />
                                <Select.Item label="1986" value="1986" />
                                <Select.Item label="1985" value="1985" />
                                <Select.Item label="1984" value="1984" />
                                <Select.Item label="1983" value="1983" />
                                <Select.Item label="1982" value="1982" />
                                <Select.Item label="1981" value="1981" />
                                <Select.Item label="1980" value="1980" />
                                <Select.Item label="1979" value="1979" />
                                <Select.Item label="1978" value="1978" />
                                <Select.Item label="1977" value="1977" />
                                <Select.Item label="1976" value="1976" />
                                <Select.Item label="1975" value="1975" />
                                <Select.Item label="1974" value="1974" />
                                <Select.Item label="1973" value="1973" />
                                <Select.Item label="1972" value="1972" />
                                <Select.Item label="1971" value="1971" />
                                <Select.Item label="1970" value="1970" />
                                <Select.Item label="1969" value="1969" />
                                <Select.Item label="1968" value="1968" />
                                <Select.Item label="1967" value="1967" />
                                <Select.Item label="1966" value="1966" />
                                <Select.Item label="1965" value="1965" />
                                <Select.Item label="1964" value="1964" />
                                <Select.Item label="1963" value="1963" />
                                <Select.Item label="1962" value="1962" />
                                <Select.Item label="1961" value="1961" />
                                <Select.Item label="1960" value="1960" />
                                <Select.Item label="1959" value="1959" />
                                <Select.Item label="1958" value="1958" />
                                <Select.Item label="1957" value="1957" />
                                <Select.Item label="1956" value="1956" />
                                <Select.Item label="1955" value="1955" />
                                <Select.Item label="1954" value="1954" />
                                <Select.Item label="1953" value="1953" />
                                <Select.Item label="1952" value="1952" />
                                <Select.Item label="1951" value="1951" />
                                <Select.Item label="1950" value="1950" />
                                <Select.Item label="1949" value="1949" />
                                <Select.Item label="1948" value="1948" />
                                <Select.Item label="1947" value="1947" />
                                <Select.Item label="1946" value="1946" />
                                <Select.Item label="1945" value="1945" />
                                <Select.Item label="1944" value="1944" />
                                <Select.Item label="1943" value="1943" />
                                <Select.Item label="1942" value="1942" />
                                <Select.Item label="1941" value="1941" />
                                <Select.Item label="1940" value="1940" />
                                <Select.Item label="1939" value="1939" />
                                <Select.Item label="1938" value="1938" />
                                <Select.Item label="1937" value="1937" />
                                <Select.Item label="1936" value="1936" />
                                <Select.Item label="1935" value="1935" />
                                <Select.Item label="1934" value="1934" />
                                <Select.Item label="1933" value="1933" />
                                <Select.Item label="1932" value="1932" />
                                <Select.Item label="1931" value="1931" />
                                <Select.Item label="1930" value="1930" />
                                <Select.Item label="1929" value="1929" />
                                <Select.Item label="1928" value="1928" />
                                <Select.Item label="1927" value="1927" />
                                <Select.Item label="1926" value="1926" />
                                <Select.Item label="1925" value="1925" />
                                <Select.Item label="1924" value="1924" />
                                <Select.Item label="1923" value="1923" />
                                <Select.Item label="1922" value="1922" />
                                <Select.Item label="1921" value="1921" />
                                <Select.Item label="1920" value="1920" />
                                <Select.Item label="1919" value="1919" />
                                <Select.Item label="1918" value="1918" />
                                <Select.Item label="1917" value="1917" />
                                <Select.Item label="1916" value="1916" />
                                <Select.Item label="1915" value="1915" />
                                <Select.Item label="1914" value="1914" />
                                <Select.Item label="1913" value="1913" />
                                <Select.Item label="1912" value="1912" />
                                <Select.Item label="1911" value="1911" />
                                <Select.Item label="1910" value="1910" />
                                <Select.Item label="1909" value="1909" />
                                <Select.Item label="1908" value="1908" />
                                <Select.Item label="1907" value="1907" />
                                <Select.Item label="1906" value="1906" />
                                <Select.Item label="1905" value="1905" />
                                <Select.Item label="1904" value="1904" />
                                <Select.Item label="1903" value="1903" />
                                <Select.Item label="1902" value="1902" />
                                <Select.Item label="1901" value="1901" />
                                <Select.Item label="1900" value="1900" />

                            </Select>

                            <Select
                                selectedValue={inputField.bMonth}
                                width={"32%"}
                                placeholder="Month"
                                onValueChange={value => inputHandler("bMonth", value)}
                                borderColor="#000000"
                            >
                                <Select.Item label="January" value="January" />
                                <Select.Item label="February" value="February" />
                                <Select.Item label="March" value="March" />
                                <Select.Item label="April" value="April" />
                                <Select.Item label="May" value="May" />
                                <Select.Item label="June" value="June" />
                                <Select.Item label="July" value="July" />
                                <Select.Item label="August" value="August" />
                                <Select.Item label="September" value="September" />
                                <Select.Item label="October" value="October" />
                                <Select.Item label="November" value="November" />
                                <Select.Item label="December" value="December" />

                            </Select>

                            <Select
                                selectedValue={inputField.bDay}
                                width={"32%"}
                                placeholder="Day"
                                onValueChange={value => inputHandler("bDay", value)}
                                borderColor="#000000"
                            >
                                <Select.Item label="1" value="1" />
                                <Select.Item label="2" value="2" />
                                <Select.Item label="3" value="3" />
                                <Select.Item label="4" value="4" />
                                <Select.Item label="5" value="5" />
                                <Select.Item label="6" value="6" />
                                <Select.Item label="7" value="7" />
                                <Select.Item label="8" value="8" />
                                <Select.Item label="9" value="9" />
                                <Select.Item label="10" value="10" />
                                <Select.Item label="11" value="11" />
                                <Select.Item label="12" value="12" />
                                <Select.Item label="13" value="13" />
                                <Select.Item label="14" value="14" />
                                <Select.Item label="15" value="15" />
                                <Select.Item label="16" value="16" />
                                <Select.Item label="17" value="17" />
                                <Select.Item label="18" value="18" />
                                <Select.Item label="19" value="19" />
                                <Select.Item label="20" value="20" />
                                <Select.Item label="21" value="21" />
                                <Select.Item label="22" value="22" />
                                <Select.Item label="23" value="23" />
                                <Select.Item label="24" value="24" />
                                <Select.Item label="25" value="25" />
                                <Select.Item label="26" value="26" />
                                <Select.Item label="27" value="27" />
                                <Select.Item label="28" value="28" />
                                <Select.Item label="29" value="29" />
                                <Select.Item label="30" value="30" />
                                <Select.Item label="31" value="31" />

                            </Select>
                        </HStack>

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
                            <Select.Item label="Banaybanay" value="Banaybanay" />
                            <Select.Item label="Dagatan" value="Dagatan" />
                            <Select.Item label="Tamacan" value="Tamacan" />
                            <Select.Item label="Halang" value="Halang" />
                            <Select.Item label="Pangil" value="Pangil" />
                            <Select.Item label="Loma" value="Loma" />
                            <Select.Item label="Salaban" value="Salaban" />
                            <Select.Item label="Talon" value="Talon" />
                            <Select.Item label="Maitim" value="Maitim" />
                            <Select.Item label="Buho" value="Buho" />
                            <Select.Item label="Minantok Silangan" value="Minantok Silangan" />
                            <Select.Item label="Minantok Kanluran" value="Minantok Kanluran" />
                            <Select.Item label="Bucal" value="Bucal" />
                            <Select.Item label="Maymangga" value="Maymangga" />
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

        Moment.locale('en');

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
                        <Text fontSize={"xl"} noOfLines={1} fontWeight='bold'><Icon mr={3} as={MaterialCommunityIcons} style={{ color: "#A1A1A1" }} name="calendar-month" size={"sm"} /> {Moment(inputField.birthday).format('MMMM DD, YYYY')} ({Moment().diff(inputField.birthday, 'years')} y/o) </Text>
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