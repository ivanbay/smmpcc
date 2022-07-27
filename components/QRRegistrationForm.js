import React, { useState, useEffect } from 'react';
import {
    Input,
    VStack,
    Button,
    Heading,
    FormControl,
    Icon,
    Box,
    Select,
} from 'native-base';
import DatePicker from 'react-native-datepicker';
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { ToastAndroid, Alert } from 'react-native';
import moment from 'moment';

const QRRegistrationForm = (props) => {

    const initialState = {
        qrCode: null,
        firstname: null,
        lastname: null,
        birthday: null,
        contactNumber: null,
        address: null,
        selBrgy: null
    }

    const [inputField, setInputField] = useState({ ...initialState });
    const [showAddressTextbox, setShowAddressTextbox] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // scanned qr code, assigned to local state
    useEffect(() => setInputField({ ...inputField, qrCode: props.qrCode }), [props.qrCode]);

    const inputHandler = (field, value) => {
        setInputField({ ...inputField, [field]: value });
    }

    const resetForm = () => {
        setInputField({ ...initialState });
        setShowAddressTextbox(false);
    }

    const register = () => {

        if (inputField.qrCode == null
            || (inputField.lastname == null || inputField.lastname == "")
            || (inputField.birthday == null || inputField.birthday == "")
            || (inputField.firstname == null || inputField.firstname == "")
            || (inputField.contactNumber == null || inputField.contactNumber == "")
            || (inputField.address == null || inputField.address == "")) {
            ToastAndroid.show('All fields are required!', ToastAndroid.SHORT);
            return false;
        }

        let data = {
            qrCode: inputField.qrCode,
            lastname: inputField.lastname,
            firstname: inputField.firstname,
            birthday: inputField.birthday,
            contactNumber: inputField.contactNumber,
            address: inputField.address,
            imageUri: "https://firebasestorage.googleapis.com/v0/b/smmpcc-f1d23.appspot.com/o/default-profile-photo.jpg?alt=media&token=8bbe761b-1556-42a7-b847-f5d6010fc6fd",
            registrationDate: moment().format('YYYY-MM-DD hh:mm:ss')
        }

        if(props.formSubmit(data)) {
            resetForm();
        }

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

    let addrBox = (
        <FormControl>
            <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                Address
            </FormControl.Label>
            <Input value={inputField.address} onChangeText={value => inputHandler("address", value)} />
        </FormControl>
    );

    if (!showAddressTextbox) {
        addrBox = null;
    }

    return (
        <Box
            flexGrow={1}
            p={2}
            mt={20}
            w="90%"
            mx='auto'
        >
            <Heading size="xl" color='primary.500'>
                QR Code Registration
            </Heading>
            <Heading color="muted.400" size="xs">
                Please input basic information.
            </Heading>

            <VStack space={2} mt={5}>
                <Input
                    isReadOnly={true}
                    InputRightElement={
                        <Button startIcon={<Icon as={MaterialCommunityIcons} name="qrcode" size={6} />} onPress={props.toggleScanner} />
                    }
                    placeholder="Scan QR Code"
                    value={inputField.qrCode}
                />

                <FormControl>
                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                        First Name
                    </FormControl.Label>
                    <Input value={inputField.firstname} onChangeText={value => inputHandler("firstname", value)} />
                </FormControl>

                <FormControl>
                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                        Last Name
                    </FormControl.Label>
                    <Input value={inputField.lastname} onChangeText={value => inputHandler("lastname", value)} />
                </FormControl>

                <FormControl>
                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                        Birthday
                    </FormControl.Label>
                   
                    <DatePicker
                        showIcon={false}
                        androidMode="spinner"
                        style={{ width: "100%" }}
                        date={inputField.birthday}
                        mode="date"
                        placeholder="MM/DD/YYYY"
                        format="MM/DD/YYYY"
                        maxDate={moment().format('MM/DD/YYYY')}
                        confirmBtnText="Chọn"
                        cancelBtnText="Hủy"
                        customStyles={{
                            dateInput: {
                                borderWidth: 1,
                                borderColor: '#DFDFDF',
                            },
                        }}
                        onDateChange={(date) => {
                            inputHandler("birthday", date);
                        }}
                        />

                </FormControl>

                <FormControl>
                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                        Contact Number
                    </FormControl.Label>
                    <Input keyboardType="numeric" value={inputField.contactNumber} onChangeText={value => inputHandler("contactNumber", value)} />
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

                {addrBox}


            </VStack>

            <VStack space={2} mt={5} />
            <Button _text={{ color: 'white' }} size={"lg"} onPress={register}>
                Register
            </Button>
            <Button _text={{ color: 'white' }} colorScheme="danger" mt={2} size={"lg"} onPress={resetForm}>
                Clear
            </Button>

        </Box>
    )

}


export default QRRegistrationForm;