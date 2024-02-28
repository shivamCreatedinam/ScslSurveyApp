import React, { useState, useEffect, useRef } from 'react';
import FlashMessage from 'react-native-flash-message';
import Geolocation from '@react-native-community/geolocation';
import AppNavigation from './app/navigation/AppNavigation';
import {
  StatusBar,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageContaints from './app/utility/AsyncStorageConstants';

const App = () => {

  console.disableYellowBox = true;

  const myLocalFlashMessage = useRef();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  Geolocation.getCurrentPosition(
    (position) => {
      console.log("position", position)
      //getting the Longitude from the location json
      const currentLongitude = JSON.stringify(position.coords.longitude);
      //getting the Latitude from the location json
      const currentLatitude = JSON.stringify(position.coords.latitude);
      //Setting the state
      saveLocationForFutureUse(currentLatitude, currentLongitude);
    },
    (error) => {
      // See error code and message
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
  );


  const saveLocationForFutureUse = async (latitude, longitude) => {
    console.log(latitude, "latitude", longitude, "longitude")
    try {
      await AsyncStorage.setItem(AsyncStorageContaints.surveyLatitude, latitude);
      await AsyncStorage.setItem(AsyncStorageContaints.surveyLongitude, longitude);
      console.log('Latitude and longitude saved successfully!', latitude, longitude);
    } catch (error) {
      console.log('Error saving latitude and longitude:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <StatusBar translucent={true} backgroundColor="transparent" />
      <AppNavigation />
      <FlashMessage style={{ marginBottom: 0 }} position={'bottom'} ref={myLocalFlashMessage} />
    </SafeAreaView>
  );
};

const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  }, buttonXStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  }
  ,
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
    flex: 1
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
export default App;