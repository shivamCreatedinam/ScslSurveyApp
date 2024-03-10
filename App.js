import React, { useState, useEffect, useRef } from 'react';
import FlashMessage from 'react-native-flash-message';
import Geolocation from '@react-native-community/geolocation';
import AppNavigation from './app/navigation/AppNavigation';
import {
  Text,
  Alert,
  Image,
  AppState,
  StatusBar,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
  Linking
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageContaints from './app/utility/AsyncStorageConstants';
import VersionCheck from 'react-native-version-check';
import data from './package.json';

const App = () => {

  console.disableYellowBox = true;

  const myLocalFlashMessage = useRef();
  const [isupdated, setisupdated] = React.useState(false);
  const appState = React.useRef(AppState.currentState);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  Geolocation.getCurrentPosition(
    (position) => {
      // console.log("position", position)
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

  React.useEffect(() => {
    checkAppVersion();
  }, []);

  const checkAppVersion = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion({
        packageName: 'com.createdinam.weconnect', // Replace with your app's package name
        ignoreErrors: true,
      });

      const currentVersion = VersionCheck.getCurrentVersion();

      if (latestVersion > currentVersion) {
        console.log(' App is up-to-date, proceed with the app');
        setisupdated(true);
        Alert.alert(
          'Update Required',
          `A new version of ${data?.name} app is available. Please update to continue using the app.`,
          [
            {
              text: 'Update Now',
              onPress: () => {
                Linking.openURL(
                  Platform.OS === 'ios'
                    ? VersionCheck.getAppStoreUrl({ appID: 'com.createdinam.weconnect' })
                    : 'https://play.google.com/store/apps/details?id=com.createdinam.weconnect&hl=en&gl=US'
                );
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // App is up-to-date, proceed with the app
        setisupdated(false);
        console.log(' App is up-to-date, proceed with the app');
      }
    } catch (error) {
      // Handle error while checking app version
      console.error('Error checking app version:', error);
    }
  };

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

  const forceUpdate = async () => {
    try {
      const PlayStoreUrl = await VersionCheck.getPlayStoreUrl();
      VersionCheck.needUpdate({
        currentVersion: VersionCheck.getCurrentVersion(),
        latestVersion: data.version
      }).then((res) => {
        if (res.isNeeded) {
          console.log('updateNeeded------------->' + PlayStoreUrl, JSON.stringify(res));
        }
      })
    }
    catch (err) {
      console.log(err);
    }
  }

  if (isupdated) {
    return <ImageBackground
      style={{ flex: 1 }}
      source={require('./app/assets/background_maps.jpeg')}
      resizeMode={'cover'}>
      <Image
        style={{ width: 300, height: 300, resizeMode: 'contain', alignSelf: 'center', marginTop: 150, tintColor: 'rgb(131,24,28)' }}
        source={require('./app/assets/updateImage.png')} />
      <TouchableOpacity
        style={{ alignSelf: 'center', top: -50, backgroundColor: 'rgb(131,24,28)', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10, elevation: 5 }}
        onPress={() => forceUpdate()}>
        <Text style={{ color: '#ffffff', textTransform: 'uppercase', fontWeight: 'bold' }}>Update Now {data?.version}</Text>
      </TouchableOpacity>
    </ImageBackground>
  } else {
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
  }
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