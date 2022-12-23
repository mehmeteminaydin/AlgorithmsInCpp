import 'react-native-gesture-handler';

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MapScreen from './MapScreen';
import DetailsScreen from './DetailsScreen';
import {storeData, getData} from './AsyncStore';
import CalendarModule from './CalendarModule';
import RNFS from 'react-native-fs';

const rootDir = RNFS.DocumentDirectoryPath;
// in order to detect the first launch of the app,
// we need to store a value in the async storage
const HAS_LAUNCHED = 'HAS_LAUNCHED';

async function toinitMMKV() {
  var a = await CalendarModule.initMMKV(rootDir);
  console.log('a', a);
}
const Stack = createStackNavigator();
const App = () => {
  /*
  useEffect(() => {
    // check if the app has launched before
    // if not, set the value in the async storage
    // and set the state to true
    const checkIfFirstLaunch = async () => {
      const flag = await getData(HAS_LAUNCHED);
      if (flag === null) {
        console.log('first launch');
        toinitMMKV();
        await storeData(HAS_LAUNCHED, 'true');
      } else {
        console.log('not first launch');
      }
    };
    checkIfFirstLaunch().catch(e => console.log(e));
  }, []);
  */
  toinitMMKV();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{header: () => null}}
        />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
