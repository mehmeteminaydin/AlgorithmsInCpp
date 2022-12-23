import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';
import {getDataMMKV} from './MMKVStore';

const LocationComponent = ({navigation, header, zoom, index, title, ds}) => {
  const [showButton, setShowButton] = React.useState(false);

  return (
    <View style={showButton ? styles.container : styles.containerClosed}>
      <TouchableOpacity onPress={() => setShowButton(!showButton)}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerStyle}>{header}</Text>
        </View>
      </TouchableOpacity>

      {/*if show button is true, visible, else not visible*/}
      {showButton && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Detay"
            onPress={() =>
              navigation.navigate('DetailsScreen', {index, title, ds})
            }
          />
          <CustomButton
            title="Konum"
            // set the initial region to the marker's coordinates using setLocation function

            onPress={() =>
              getDataMMKV('markers').then(data => {
                if (data != null) {
                  if (data.length >= 0) {
                    zoom(
                      data[index].coordinate.latitude,
                      data[index].coordinate.longitude,
                    );
                  }
                }
              })
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width / 2.4,
    height: Dimensions.get('window').height / 11.5,
    borderRadius: 10,
    backgroundColor: 'white',
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    marginBottom: 10,
  },
  containerClosed: {
    width: Dimensions.get('window').width / 2.4,
    height: Dimensions.get('window').height / 18,
    borderRadius: 10,
    backgroundColor: 'white',
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    marginBottom: 10,
  },
  headerStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  headerContainer: {
    height: Dimensions.get('window').height / 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '86%',
    marginBottom: 10,
  },
});

export default LocationComponent;
