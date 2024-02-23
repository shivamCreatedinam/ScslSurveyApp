import { Text, View, Image, SafeAreaView, Dimensions, TouchableOpacity, StatusBar, useWindowDimensions, ActivityIndicator, TextInput, Alert, BackHandler, ScrollView, StyleSheet } from 'react-native'
import React, { Component, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageContaints from '../../../utility/AsyncStorageConstants';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import { Dropdown } from 'react-native-element-dropdown';
import RadioButtonRN from 'radio-buttons-react-native';
import MultiSelect from 'react-native-multiple-select';
import AudioRecord from 'react-native-audio-record';
import Modal from 'react-native-modal';
import Axios from 'axios';
// import fs from 'fs';

const AddSurveyScreen = () => {

    const navigation = useNavigation();
    const [name, setName] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [isRecording, setIsRecording] = React.useState(false);
    const [isInstruction, setSurveyInstruction] = React.useState(true);
    const [isLoading, setLoading] = React.useState(false);
    const [isSubmitSurvey, setSubmitSurvey] = React.useState(false);
    const [isAudioUploading, setAudioUploading] = React.useState(false);
    const [userSendToken, setUserSendToken] = React.useState('');
    const [audioPath, setAudioPath] = React.useState('');
    const [areas, setAreas] = React.useState([{ "id": 1, "area_title": "Rural Area - Population Less Than 10000", "status": 1, "created_date": "2024-01-13 08:48:30" }, { "id": 2, "area_title": "Semi-Urban Area - Population Above 10000 But Less Than 1 Lakh", "status": 1, "created_date": "2024-01-13 08:48:30" }, { "id": 3, "area_title": "Urban Area - Population 1 Lakh And Above But Less Than 10 Lakhs", "status": 1, "created_date": "2024-01-13 08:48:30" }, { "id": 4, "area_title": "Metro Area - Population More Than 10 Lakhs", "status": 1, "created_date": "2024-01-13 08:48:30" }]);
    const [educations, setEducations] = React.useState([{ "id": 1, "education_title": "Illitrate", "status": 1, "created_date": "2024-01-13 08:33:35" }, { "id": 2, "education_title": "No formal education but literate", "status": 1, "created_date": "2024-01-13 08:33:35" }, { "id": 3, "education_title": "Up to 8th std.", "status": 1, "created_date": "2024-01-13 08:33:35" }, { "id": 4, "education_title": "Matric-10th std", "status": 1, "created_date": "2024-01-13 08:33:35" }, { "id": 5, "education_title": "Graduate", "status": 1, "created_date": "2024-01-13 08:33:35" }, { "id": 6, "education_title": "Post-Graduate", "status": 1, "created_date": "2024-01-13 08:33:35" }, { "id": 7, "education_title": "Professional Degree Holder", "status": 1, "created_date": "2024-01-13 08:33:35" }]);
    const [incomes, setIncomes] = React.useState([{ "id": 1, "icomes_title": "Up to 1 Lakh", "status": 1, "created_date": "2024-01-13 08:38:22" }, { "id": 2, "icomes_title": "1 Lakh - 3 Lakhs", "status": 1, "created_date": "2024-01-13 08:38:22" }, { "id": 3, "icomes_title": "3 Lakhs - 5 Lakhs", "status": 1, "created_date": "2024-01-13 08:38:22" }, { "id": 4, "icomes_title": "5 Lakhs - 10 Lakhs", "status": 1, "created_date": "2024-01-13 08:38:22" }, { "id": 5, "icomes_title": "10 Lakhs - 20 Lakhs", "status": 1, "created_date": "2024-01-13 08:38:22" }, { "id": 6, "icomes_title": "20 Lakhs and above", "status": 1, "created_date": "2024-01-13 08:38:22" }]);
    const [occupations, setOccupations] = React.useState([{ "id": 1, "occupation_name": "Student", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 2, "occupation_name": "Homemaker", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 3, "occupation_name": "Govt Service", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 4, "occupation_name": "Private Sector Service", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 5, "occupation_name": "Professional", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 6, "occupation_name": "Farmer-L", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 7, "occupation_name": "Farmer-S/M", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 8, "occupation_name": "Tenant Farmers", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 9, "occupation_name": "Wholesale Trader", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 10, "occupation_name": "Retail Trader", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 11, "occupation_name": "Manufacturer", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 12, "occupation_name": "Daily Wager", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 13, "occupation_name": "Gig Worker", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 14, "occupation_name": "Service Provider", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 15, "occupation_name": "Unemployed", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 16, "occupation_name": "Self-Employed", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 17, "occupation_name": "Not Working", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 18, "occupation_name": "Pensioner", "status": 1, "created_date": "2024-01-13 08:14:06" }, { "id": 19, "occupation_name": "Other Occupation", "status": 1, "created_date": "2024-01-13 08:14:06" }]);
    const [areasSelected, setSelectedAreas] = React.useState([]);
    const [state, setStateData] = React.useState([]);
    const [DistrictData, setDistrictData] = React.useState([]);
    const [Lattitude, setLattitude] = React.useState('');
    const [Longitude, setLongitude] = React.useState('');

    // country dropdowns
    const [value, setValue] = React.useState(null);
    const [selectedState, setSelectedState] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);

    // select district
    const [valueDistrict, setDistrictValue] = React.useState(null);
    const [selectedDistrict, setSelectedDistrict] = React.useState(null);
    const [isDistrictFocus, setIsDistrictFocus] = React.useState(false);

    // lable fields. 
    const [surveryName, setSurveyName] = React.useState('Not to be recorded');
    const [gender, setGender] = React.useState('');
    const [age, setAgeNumber] = React.useState('');
    const [member, setMember] = React.useState('');
    const [adult, setAdults] = React.useState('');
    const [children, setChildren] = React.useState('');
    const [selectedEducation, setSelectedEducation] = React.useState([]);
    const [selectedOccupations, setSelectedOccupations] = React.useState([]);
    const [selectedIncomes, setSelectedIncomes] = React.useState([]);
    const [differentlyAble, setDifferently] = React.useState('');
    const [smartPhone, setSmartphone] = React.useState('');
    const [anyGroup, setAnyGroup] = React.useState('');
    const [is1Focus, setIs1Focus] = React.useState(false);
    const [is2Focus, setIs2Focus] = React.useState(false);
    const [is3Focus, setIs3Focus] = React.useState(false);
    const [is4Focus, setIs4Focus] = React.useState(false);
    const [is5Focus, setIs5Focus] = React.useState(false);
    const [is6Focus, setIs6Focus] = React.useState(false);


    // gender setDifferently
    const data = [
        {
            label: 'Male'
        },
        {
            label: 'Female'
        },
        {
            label: 'Prefer not to say'
        }
    ];

    // anyGroup
    const dataGroup = [
        {
            label: 'Yes'
        },
        {
            label: 'No'
        }
    ];

    const smartphone = [
        {
            label: 'Yes'
        },
        {
            label: 'No'
        }
    ];

    const differently = [
        {
            label: 'Yes'
        },
        {
            label: 'No'
        }
    ];

    const adults = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    const childern = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    useFocusEffect(
        React.useCallback(() => {
            readMessages();
            return () => {
                // Useful for cleanup functions.

            };
        }, [])
    );

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, []);


    const readMessages = async () => {
        try {
            const userId = await AsyncStorage.getItem(AsyncStorageContaints.tempServerTokenId);
            const UserData = await AsyncStorage.getItem(AsyncStorageContaints.UserData);
            const UserToken = await AsyncStorage.getItem(AsyncStorageContaints.UserId);
            const surveyLatitude = await AsyncStorage.getItem(AsyncStorageContaints.surveyLatitude);
            const surveyLongitude = await AsyncStorage.getItem(AsyncStorageContaints.surveyLongitude);
            //UserId
            setLattitude(surveyLatitude);
            setLongitude(surveyLongitude);
            setUserSendToken(UserToken);
            setUserName(UserData);
            setName(userId);
            getState();
            console.log("error", userId)
        } catch (error) {
            console.log("error_", error)
        }
    }

    const getState = async () => {
        setLoading(true);
        const UserToken = await AsyncStorage.getItem(AsyncStorageContaints.UserId);
        let url = `https://createdinam.in/RBI-CBCD/public/api/get-states`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${UserToken}`
        }
        Axios.get(url, {
            headers: headers
        })
            .then((response) => {
                if (response.data.status === true) {
                    setLoading(false);
                    setStateData(response?.data?.data);
                } else {
                    setLoading(false);
                    showMessage({
                        message: "Something went wrong!",
                        description: "Something went wrong. Try again!",
                        type: "danger",
                    });
                }
            });
    }

    const loadDistrict = async (state) => {
        const UserToken = await AsyncStorage.getItem(AsyncStorageContaints.UserId);
        let url = `https://createdinam.in/RBI-CBCD/public/api/get-city/${Number(state)}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${UserToken}`
        }
        Axios.get(url, {
            headers: headers
        })
            .then((response) => {
                console.log('loadDistrict_______>', JSON.stringify(response?.data))
                if (response.data.status === true) {
                    setDistrictData(response?.data?.data);
                } else {
                    setLoading(false);
                    showMessage({
                        message: "Something went wrong!",
                        description: "Something went wrong. Try again!",
                        type: "danger",
                    });
                }
            });
    }

    const askToCloseApp = () => {
        Alert.alert(
            "Close Survey",
            "Are you sure, you want to Close survey, you lose all the data?",
            [
                { text: "No" },
                {
                    text: "Yes", onPress: () => {
                        stopRecordingBack();
                        navigation.replace('DashboardScreen');
                        return true;
                    }
                },
            ]
        );
    }

    const stopRecordingBack = async () => { const audioFile = await AudioRecord.stop(); }

    const renderCustomHeader = () => {
        const user = {
            _id: 1,
            name: name,
            avatar: 'https://electricallicenserenewal.com/app-assets/images/user/12.jpg',
            active: true,
        };
        // this.props?.route?.params?.item?.profile_image,
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, alignSelf: 'flex-start', marginTop: StatusBar.currentHeight, paddingHorizontal: 20, backgroundColor: '#fff', elevation: 5, width: '100%' }}>
                <TouchableOpacity onPress={() => askToCloseApp()} style={{ marginRight: 10, padding: 5 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../../assets/app_logo.png')} />
                </TouchableOpacity>
                <Image
                    source={require('../../../assets/app_logo.png')}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>{userName} - {user.name}</Text>
                    {user.active && <Text style={{ color: 'green', fontSize: 12, fontWeight: 'bold' }}>Active Survey Token - <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'red' }}>Block A</Text> </Text>}
                </View>
                {isRecording === true ? <View style={{ height: 10, width: 10, borderRadius: 100, backgroundColor: 'green' }} /> : <View style={{ height: 10, width: 10, borderRadius: 100, backgroundColor: 'red' }} />}
            </View>
        );
    }

    const startRecording = async () => {
        try {
            setSurveyInstruction(false);
            setIsRecording(true);
            AudioRecord.start();
        } catch (error) {
            console.log(error);
        }
    };

    const stopRecording = async () => {
        try {
            // or to get the wav file path
            const audioFile = await AudioRecord.stop();
            console.warn('stopRecording', audioFile);
            setAudioPath(audioFile);
            uploadAudioFinal(audioFile);
            submitSurvey();
        } catch (error) {
            console.log(error);
        }
    };

    const validationCheck = () => {
        const pattern = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/
        const AgeRegex = /^(?:1[01][0-9]|120|1[7-9]|[2-9][0-9])$/;
        // if (pattern.test(surveryName)) {
        if (gender !== '') {
            if (AgeRegex.test(age)) {
                if (selectedOccupations.length !== 0) {
                    if (selectedEducation.length !== 0) {
                        if (selectedIncomes.length !== 0) {
                            if (value !== null) {
                                if (valueDistrict !== null) {
                                    if (areasSelected.length !== 0) {
                                        if (differentlyAble !== '') {
                                            if (adult !== '') {
                                                if (children !== '') {
                                                    if (member !== '') {
                                                        if (anyGroup !== '') {
                                                            if (smartPhone !== '') {
                                                                stopRecording();
                                                            } else {
                                                                showMessage({
                                                                    message: "Please Select SmartPhone Own!",
                                                                    description: "Please Select SmartPhone Own!",
                                                                    type: "danger",
                                                                });
                                                            }
                                                        } else {
                                                            showMessage({
                                                                message: "Please Select Any Group Part!",
                                                                description: "Please Select Any Group Part SHG/JLG!",
                                                                type: "danger",
                                                            });
                                                        }
                                                    } else {
                                                        showMessage({
                                                            message: "Please Select Earning Members!",
                                                            description: "Please Select Earning Members!",
                                                            type: "danger",
                                                        });
                                                    }
                                                } else {
                                                    showMessage({
                                                        message: "Please Select Children!",
                                                        description: "Please Select Number Of Children!",
                                                        type: "danger",
                                                    });
                                                }
                                            } else {
                                                showMessage({
                                                    message: "Please Select Adults!",
                                                    description: "Please Select Number Of Adults!",
                                                    type: "danger",
                                                });
                                            }
                                        } else {
                                            showMessage({
                                                message: "Please Select Differently!",
                                                description: "Please Select Differently abled!",
                                                type: "danger",
                                            });
                                        }
                                    } else {
                                        showMessage({
                                            message: "Please Select Area",
                                            description: "Please Select Area!",
                                            type: "danger",
                                        });
                                    }
                                } else {
                                    showMessage({
                                        message: "Please Select District",
                                        description: "Please Select District!",
                                        type: "danger",
                                    });
                                }
                            } else {
                                showMessage({
                                    message: "Please Select State",
                                    description: "Please Select State!",
                                    type: "danger",
                                });
                            }
                        } else {
                            showMessage({
                                message: "Please Select Incomes",
                                description: "Please Select Incomes!",
                                type: "danger",
                            });
                        }
                    } else {
                        showMessage({
                            message: "Please Select Education",
                            description: "Please Select Education!",
                            type: "danger",
                        });
                    }
                } else {
                    showMessage({
                        message: "Please Select Occupation",
                        description: "Please Select Occupation!",
                        type: "danger",
                    });
                }
            } else {
                showMessage({
                    message: "Please Enter Valid Age",
                    description: "Please Enter Valid Age!",
                    type: "danger",
                });
            }
        } else {
            showMessage({
                message: "Please Select Gender",
                description: "Please Select Valid Gender!",
                type: "danger",
            });
        }
        // } else {
        //     showMessage({
        //         message: "Please Enter Name",
        //         description: "Please Enter Valid Name!",
        //         type: "danger",
        //     });
        // }
    }

    const submitSurvey = async () => {
        setSubmitSurvey(true);
        const FormData = require('form-data');
        let data = new FormData();
        data.append('user_name', 'Not to be recorded');
        data.append('survey_token', name);
        data.append('gender', gender?.label);
        data.append('age_of_repons', Number(age));
        data.append('city', value);
        data.append('state', valueDistrict);
        data.append('occupation_id', selectedOccupations);
        data.append('education_id', selectedEducation);
        data.append('income_id', selectedIncomes);
        data.append('area_id', areasSelected);
        data.append('diff_abled', differentlyAble?.label);
        data.append('adults', adult);
        data.append('children', children);
        data.append('total', Number(adult) + Number(children));
        data.append('part_of_group', anyGroup?.label);
        data.append('own_smartphone', smartPhone?.label);
        data.append('latitude', Lattitude);
        data.append('longitude', Longitude);
        data.append('other_occupation', 1);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://createdinam.in/RBI-CBCD/public/api/create-survey-demographics',
            headers: {
                'Authorization': 'Bearer ' + userSendToken,
                "Content-Type": "multipart/form-data",
            },
            data: data,
        };
        console.warn('submitSurvey', JSON.stringify(config))
        Axios.request(config)
            .then((response) => {
                console.warn('submitSurvey response', JSON.stringify(response.data))
                if (response.data.status === true) {
                    setSubmitSurvey(false);
                    showMessage({
                        message: response.data.message + ', Submit By ' + response.data?.name,
                        description: response.data.message,
                        type: "success",
                    });
                    saveSurveryAndMoveToNext();
                } else {
                    showMessage({
                        message: "Something went wrong!",
                        description: response.data.message,
                        type: "danger",
                    });
                    setSubmitSurvey(false);
                }
            });

    }

    const saveSurveryAndMoveToNext = async () => {
        AsyncStorage.setItem(AsyncStorageContaints.surveyNextBlock, 'B');
        navigation.replace('BlockBSurveyScreen');
    }



    const uploadAudioFinal = async (file) => {
        setAudioUploading(true);
        let API_UPLOAD_MSG_FILE = `https://createdinam.in/RBI-CBCD/public/api/survey-audio-files`;
        const path = `file://${file}`;
        const formData = new FormData();
        formData.append('survey_token', name);
        formData.append('sec_no', 'A');
        formData.append('audio_file', {
            uri: path,
            name: 'test.wav',
            type: 'audio/wav',
        })
        console.log(JSON.stringify(formData));
        try {
            const res = await fetch(API_UPLOAD_MSG_FILE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + userSendToken,
                },
                body: formData,
            });
            const json = await res.json();
            setAudioUploading(false);
            showMessage({
                message: "Audio Upload",
                description: "Audio Upload Successfully!",
                type: "success",
            });
        } catch (err) {
            showMessage({
                message: "Audio Upload",
                description: "Audio Upload Successfully",
                type: "success",
            });
        }
    }

    const onSelectedItemsChange = (selectedItems) => {
        setSelectedAreas(selectedItems);
    }

    const onSelectedEducationChange = (selectedItems) => {
        setSelectedEducation(selectedItems);
    }

    const onSelectedOccupationsChange = (selectedItems) => {
        setSelectedOccupations(selectedItems);
    }

    const onSelectedIncomesChange = (selectedItems) => {
        setSelectedIncomes(selectedItems);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8FF' }}>
            {renderCustomHeader()}
            <Modal isVisible={isInstruction}>
                <View style={{ width: Dimensions.get('screen').width - 50, backgroundColor: '#fff', alignSelf: 'center', borderRadius: 5, padding: 20 }}>
                    <View style={{ alignItems: 'center', alignContent: 'center', marginTop: 15 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Survey Instructions</Text>
                        <Text style={{ textAlign: 'center', paddingVertical: 15 }}>Once your start the survey, this will track your location, and also record your audio, by click on start button all the featurs enable and track your location and record your audio.</Text>
                    </View>
                    <TouchableOpacity onPress={() => startRecording()} style={{ paddingVertical: 10, paddingHorizontal: 50, backgroundColor: '#000', borderRadius: 5, elevation: 5, zIndex: 999 }}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center', padding: 5 }}>Start</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Text style={{ fontWeight: 'bold', paddingLeft: 20, paddingTop: 10 }}>A. DEMOGRAPHIC DETAILS</Text>
            {isLoading === false ?
                <ScrollView>
                    <View style={{ padding: 10 }}>
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>1. Name</Text>
                            <TextInput style={{ backgroundColor: '#fff', paddingLeft: 15 }} placeholder='Not to be recorded' editable={false} />
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>2. Gender</Text>
                            <RadioButtonRN
                                data={data}
                                selectedBtn={(e) => setGender(e)}
                            />
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>3. Age</Text>
                            <TextInput onChangeText={(e) => setAgeNumber(e)} style={{ backgroundColor: '#fff', paddingLeft: 15 }} placeholder='Age' keyboardType={'number-pad'} maxLength={2} value={age} />
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>4. Occupation (In case of Overlap, report primary occupation)</Text>
                            <Dropdown
                                style={[styles.dropdown, is1Focus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                // iconStyle={styles.iconStyle}
                                data={occupations}
                                // search
                                maxHeight={300}
                                labelField="occupation_name"
                                valueField="id"
                                placeholder={!is1Focus ? 'Select Occupation' : selectedOccupations}
                                // searchPlaceholder="Search..."
                                value={selectedOccupations}
                                onFocus={() => setIs1Focus(true)}
                                onBlur={() => setIs1Focus(false)}
                                onChange={item => {
                                    console.log('______>', JSON.stringify(item))
                                    onSelectedOccupationsChange(item?.id);
                                    setIs1Focus(false);
                                }}
                            />
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>5. Education</Text>
                            <Dropdown
                                style={[styles.dropdown, is2Focus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                // iconStyle={styles.iconStyle}
                                data={educations}
                                // search
                                maxHeight={300}
                                labelField="education_title"
                                valueField="id"
                                placeholder={!is2Focus ? 'Select Education' : selectedEducation}
                                // searchPlaceholder="Search..."
                                value={selectedEducation}
                                onFocus={() => setIs2Focus(true)}
                                onBlur={() => setIs2Focus(false)}
                                onChange={item => {
                                    console.log('______>', JSON.stringify(item))
                                    onSelectedEducationChange(item?.id);
                                    setIs2Focus(false);
                                }}
                            />
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>6. Annual Income (For non-earning respondents, the income of parents or spouse can be reported)</Text>
                            <Dropdown
                                style={[styles.dropdown, is3Focus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                // iconStyle={styles.iconStyle}
                                data={incomes}
                                // search
                                maxHeight={300}
                                labelField="icomes_title"
                                valueField="id"
                                placeholder={!is3Focus ? 'Select Annual Income' : selectedIncomes}
                                // searchPlaceholder="Search..."
                                value={selectedIncomes}
                                onFocus={() => setIs3Focus(true)}
                                onBlur={() => setIs3Focus(false)}
                                onChange={item => {
                                    console.log('______>', JSON.stringify(item))
                                    onSelectedIncomesChange(item?.id);
                                    setIs3Focus(false);
                                }}
                            />
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>7. Location</Text>
                            <View>
                                <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>State</Text>
                                <Dropdown
                                    style={[styles.dropdown, is4Focus && { borderColor: 'blue' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    // iconStyle={styles.iconStyle}
                                    data={state}
                                    // search
                                    maxHeight={300}
                                    labelField="name"
                                    valueField="id"
                                    placeholder={!is4Focus ? 'Select State' : value}
                                    // searchPlaceholder="Search..."
                                    value={value}
                                    onFocus={() => setIs4Focus(true)}
                                    onBlur={() => setIs4Focus(false)}
                                    onChange={item => {
                                        console.log('______>', JSON.stringify(item))
                                        setValue(item?.id);
                                        loadDistrict(item.id);
                                        setIs4Focus(false);
                                    }}
                                />
                            </View>
                            <View>
                                <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>District</Text>
                                <Dropdown
                                    style={[styles.dropdown, is5Focus && { borderColor: 'blue' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    data={DistrictData}
                                    maxHeight={300}
                                    labelField="name"
                                    valueField="id"
                                    placeholder={!is5Focus ? 'Select District' : valueDistrict}
                                    value={selectedDistrict}
                                    onFocus={() => setIs5Focus(true)}
                                    onBlur={() => setIs5Focus(false)}
                                    onChange={item => {
                                        console.log('______>', JSON.stringify(item))
                                        setDistrictValue(item?.id);
                                        setIs5Focus(false);
                                    }}
                                />
                            </View>
                            <View>
                                <View style={{ padding: 10, }} />
                                <Dropdown
                                    style={[styles.dropdown, is6Focus && { borderColor: 'blue' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    // iconStyle={styles.iconStyle}
                                    data={areas}
                                    // search
                                    maxHeight={300}
                                    labelField="area_title"
                                    valueField="id"
                                    placeholder={!is6Focus ? 'Select Areas' : areasSelected}
                                    // searchPlaceholder="Search..."
                                    value={areasSelected}
                                    onFocus={() => setIs6Focus(true)}
                                    onBlur={() => setIs6Focus(false)}
                                    onChange={item => {
                                        console.log('______>', JSON.stringify(item))
                                        onSelectedItemsChange(item?.id);
                                        setIs6Focus(false);
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>8. Are you differently abled?</Text>
                            <RadioButtonRN
                                data={differently}
                                selectedBtn={(e) => setDifferently(e)}
                            />
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginBottom: 5, fontWeight: 'bold', flex: 1 }}>9. Size of Household</Text>
                                <Text style={{ marginBottom: 5, fontWeight: 'bold', marginRight: 10 }}>Total : {Number(adult) + Number(children)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Adults</Text>
                                    <SelectDropdown
                                        data={adults}
                                        onSelect={(selectedItem, index) => {
                                            console.log(selectedItem, index)
                                            setAdults(selectedItem);
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            // text represented after item is selected
                                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                                            return selectedItem
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            // text represented for each item in dropdown
                                            // if data array is an array of objects then return item.property to represent item in dropdown
                                            return item
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 5 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Children's</Text>
                                    <SelectDropdown
                                        data={childern}
                                        onSelect={(selectedItem, index) => {
                                            console.log(selectedItem, index);
                                            setChildren(selectedItem)
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            // text represented after item is selected
                                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                                            return selectedItem
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            // text represented for each item in dropdown
                                            // if data array is an array of objects then return item.property to represent item in dropdown
                                            return item
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>10. Number of earning members in the household</Text>
                            <TextInput onChangeText={(e) => setMember(e)} style={{ backgroundColor: '#fff', paddingLeft: 15 }} placeholder='Actual No.' keyboardType={'number-pad'} maxLength={2} value={member} />
                        </View>

                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>11. Are you part of any group (SHG/JLG or formal group) ?</Text>
                            <RadioButtonRN
                                data={dataGroup}
                                selectedBtn={(e) => setAnyGroup(e)}
                            />
                        </View>
                        <View style={{ padding: 10, }} />
                        <View style={{ padding: 5, elevation: 1, backgroundColor: '#fff' }}>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>12. Do you own a smartphone ?</Text>
                            <RadioButtonRN
                                data={smartphone}
                                selectedBtn={(e) => setSmartphone(e)}
                            />
                        </View>
                        <View style={{ padding: 10, }} />
                        <TouchableOpacity disabled={isSubmitSurvey} onPress={() => {
                            validationCheck()
                        }} style={{ paddingVertical: 20, paddingHorizontal: 10, backgroundColor: '#000', borderRadius: 10 }}>
                            {isAudioUploading !== true ? <Text style={{ color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>Next Block B</Text> : <ActivityIndicator color={'#fff'} style={{ alignItems: 'center', alignSelf: 'center' }} />}
                        </TouchableOpacity>
                    </View>
                </ScrollView> : <ActivityIndicator style={{ alignItems: 'center', marginTop: Dimensions.get('screen').width }} color={'#000'} />}
        </SafeAreaView >
    )
}
// 
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default AddSurveyScreen;