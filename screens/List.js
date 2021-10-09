import React from "react";
import {
    Text,
    Heading,
    HStack,
    VStack,
    Spacer,
    Avatar,
    Box,
    FlatList,
    Button,
    NativeBaseProvider
} from 'native-base';
import moment from "moment";
import AttendanceService from '../Services/AttendanceService';
import RegistrationService from "../Services/RegistrationService";


class List extends React.Component {

    state = {
        listCount: 0,
        flatListData: [],
        recordIDs: []
    }

    componentDidMount() {

        AttendanceService.fetchAll()
            .child("2021-10-09") //moment().format('YYYY-MM-DD')
            .on('value', record => {

                record.forEach(d => {

                    let qrCode = d.val(), timeIn = d.key;

                    if (!this.state.recordIDs.includes(qrCode)) {

                        RegistrationService.fetchById(qrCode).then(r => {

                            this.setState({ recordIDs: [...this.state.recordIDs, qrCode] });

                            this.setState({
                                flatListData: [...this.state.flatListData, {
                                    id: qrCode,
                                    fullName: r.val().lastname + ", " + r.val().firstname,
                                    timeStamp: timeIn,
                                    recentText: r.val().address,
                                    avatarUrl: r.val().imageUri
                                }]
                            });

                            this.setState({ listCount: this.state.recordIDs.length })
                        });

                    }

                });

            });

    }


    render() {

        const updateList = () => {

            let i = 0;

            RegistrationService.fetchAll().get().then(rec => {
                rec.forEach(d => {
                    RegistrationService.getPhotoUrl(d.key).then(uri => {
                        let obj = {
                            imageUri: uri
                        }
                        RegistrationService.updateById(d.key, obj).then(() => console.log("UPDATED"));

                    }).catch(err => {
                        let obj = {
                            imageUri: "https://firebasestorage.googleapis.com/v0/b/smmpcc-f1d23.appspot.com/o/default-profile-photo.jpg?alt=media&token=8bbe761b-1556-42a7-b847-f5d6010fc6fd"
                        }
                        RegistrationService.updateById(d.key, obj).then(() => console.log("UPDATED"));
                    })
                });
            });
        }


        return (
            <NativeBaseProvider>
                <Box
                    flex={1}
                    p={2}
                    mt={20}
                    mb={5}
                    w="90%"
                    mx='auto'
                >
                    <Heading size="2xl" color='primary.500'>
                        Contact Tracing List
                    </Heading>
                    <Heading color="muted.400" size="md">
                        {moment().format('MMMM DD, YYYY HH:00')} | {this.state.listCount} Entries
                    </Heading>

                    <Box
                        flex={1}
                        mt={10}
                    >

                        {/* <Button onPress={updateList}>Update</Button> */}

                        <FlatList
                            data={this.state.flatListData}
                            renderItem={({ item }) => (
                                <Box
                                    borderBottomWidth="1"
                                    _dark={{
                                        borderColor: "gray.600",
                                    }}
                                    borderColor="coolGray.200"

                                    py="2"
                                >
                                    <HStack space={3} justifyContent="space-between">
                                        <Avatar
                                            size="48px"
                                            source={{
                                                uri: item.avatarUrl,
                                            }}
                                        />
                                        <VStack>
                                            <Text
                                                _dark={{
                                                    color: "warmGray.50",
                                                }}
                                                color="coolGray.800"
                                                bold
                                            >
                                                {item.fullName}
                                            </Text>
                                            <Text
                                                color="coolGray.600"
                                                _dark={{
                                                    color: "warmGray.200",
                                                }}
                                            >
                                                {!isNaN(item.recentText) ? `Poblacion ${item.recentText}` : item.recentText}
                                            </Text>
                                        </VStack>
                                        <Spacer />
                                        <Text
                                            fontSize="xs"
                                            _dark={{
                                                color: "warmGray.50",
                                            }}
                                            color="coolGray.800"
                                            alignSelf="flex-start"
                                        >
                                            {item.timeStamp}
                                        </Text>
                                    </HStack>
                                </Box>
                            )}
                            keyExtractor={(item) => item.id}
                        />

                    </Box>

                </Box>
            </NativeBaseProvider >
        )
    }
}

export default (List);