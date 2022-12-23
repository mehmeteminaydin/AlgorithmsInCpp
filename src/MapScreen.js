import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker} from 'react-native-maps';
import LocationComponent from './LocationComponent';
import {useFocusEffect} from '@react-navigation/native';
import Openrouteservice from 'openrouteservice-js';
import DecodeGeo from './DecodeGeo';
import {Polyline} from 'react-native-maps';
import {storeDataMMKV, getDataMMKV, removeDataMMKV} from './MMKVStore';

const MapScreen = ({route, navigation}) => {
  const MyDirections = new Openrouteservice.Directions({
    api_key: '5b3ce3597851110001cf624820fdc5cae95f464d8c9e985179cccab9',
  });

  const [showButton, setShowButton] = React.useState(false);

  const [coordinates, setCoordinates] = useState([]);

  const [location, setLocation] = useState({
    latitude: 39.925533,
    longitude: 32.866287,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //set the maps location to current location
  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      setLocation({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    });
  }, []);

  const [markers, setMarkers] = useState([]);
  var para_index = 0;
  if (markers.length > 0) {
    para_index = markers.length;
  }

  useEffect(() => {
    async function store_and_get() {
      if (removeFlag && markers.length === 0) {
        await removeDataMMKV('markers');
        setRemoveFlag(false);
      }
      if (removeFlag && markers.length > 0) {
        await removeDataMMKV('markers');
        await storeDataMMKV('markers', markers);
        setRemoveFlag(false);
      }
      if (addFlag && markers.length > 0) {
        await removeDataMMKV('markers');
        await storeDataMMKV('markers', markers);
        setAddFlag(false);
      }
    }
    store_and_get();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  useEffect(() => {
    getDataMMKV('markers').then(data => {
      if (data != null) {
        if (data.length >= 0) {
          setMarkers(data);
        }
      }
    });
  }, []);

  const [removeFlag, setRemoveFlag] = useState(false);
  const [addFlag, setAddFlag] = useState(false);

  //useFocusEffect to re-render the MapScreen after going back from detailsScreen
  useFocusEffect(
    React.useCallback(() => {
      getDataMMKV('markers').then(data => {
        if (data != null) {
          if (data.length >= 0) {
            setMarkers(data);
          }
        }
      });
    }, []),
  );

  //write a function to add multiple markers on the map
  const addMarker = (index, title, description, lat, lon) => {
    setAddFlag(true);
    setMarkers([
      ...markers,
      {
        index: index,
        title: title,
        description: description,
        coordinate: {
          latitude: lat,
          longitude: lon,
        },
      },
    ]);
  };

  //write a function to remove the marker
  const removeMarker = index => {
    setRemoveFlag(true);
    //setMarkers(markers.filter((marker, i) => i !== index));
    markers.splice(index, 1);
    setMarkers(markers);
  };
  const renderMarkers = () => {
    return markers.map((marker, index) => (
      <Marker
        key={index}
        title={marker.title}
        description={marker.description}
        coordinate={marker.coordinate}
        draggable={true}
        onDragStart={e => {
          ToastAndroid.show('Sürüklemek için bırakın', ToastAndroid.SHORT);
        }}
        onDragEnd={e => {
          removeMarker(index);
          addMarker(
            index,
            marker.title,
            marker.description,
            e.nativeEvent.coordinate.latitude,
            e.nativeEvent.coordinate.longitude,
          );
          navigation.navigate('DetailsScreen', {
            index: index,
            title: marker.title?.toString(),
            ds: marker.description?.toString(),
          });
        }}
        onPress={() =>
          navigation.navigate('DetailsScreen', {
            index: index,
            title: marker.title?.toString(),
            ds: marker.description?.toString(),
          })
        }
      />
    ));
  };

  // calculate the directions by using openrouteservice-js Directions
  const calculateMyDirections = points => {
    return MyDirections.calculate({
      coordinates: points,
      profile: 'driving-car',
      extra_info: ['waytype', 'steepness'],
      format: 'json',
      api_version: 'v2',
    })
      .then(function (json) {
        // Add your own result handling here
        let response = JSON.stringify(json, null, '\t');
        return response;
      })
      .catch(function (err) {
        let response = JSON.stringify(err, null, '\t');
        console.error(response);
        return -1;
      });
  };

  let PointstoCalculate = markers.map(marker => [
    marker.coordinate.longitude,
    marker.coordinate.latitude,
  ]);
  PointstoCalculate.push([location.longitude, location.latitude]);
  // add the current location to end of the points array
  PointstoCalculate.unshift([location.longitude, location.latitude]);

  const renderPolyline = () => {
    if (coordinates) {
      return (
        <Polyline
          coordinates={coordinates}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={[
            '#7F0000',
            '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
            '#B24112',
            '#E5845C',
            '#238C23',
            '#7F0000',
          ]}
          strokeWidth={6}
        />
      );
    }
  };

  // zoom the map to the marker position when the button is pressed
  const zoom = (lat, lon) => {
    if (lat && lon) {
      //eslint-disable-next-line no-undef
      _mapView.animateToRegion(
        {
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000,
      );
    }
  };
  //write a function to render the mapview
  const renderMap = () => {
    return (
      <MapView
        ref={mapView => {
          //eslint-disable-next-line no-undef
          _mapView = mapView;
        }}
        style={styles.map}
        region={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={true}
        showsIndoors={true}
        showsBuildings={true}
        showsPointsOfInterest={true}
        showsIndoorLevelPicker={true}
        onLongPress={e =>
          addMarker(
            para_index,
            null,
            null,
            e.nativeEvent.coordinate.latitude,
            e.nativeEvent.coordinate.longitude,
          )
        }>
        {
          // set the markers coordinates to the pressed location
          markers.length > 0 ? renderMarkers() : null
        }
        {renderPolyline()}
      </MapView>
    );
  };

  const renderLocationComponent = ({marker, header, index, title, ds}) => {
    // return mulptiple location components with different index
    return (
      <LocationComponent
        location={location}
        zoom={zoom}
        key={index}
        header={title}
        index={index}
        title={title}
        ds={ds}
        removeMarker={removeMarker}
        navigation={navigation}
      />
    );
  };

  // render locationComponent inside a FlatList onto the map
  const renderLocationList = () => {
    return (
      <FlatList
        data={markers}
        renderItem={({item, index}) =>
          renderLocationComponent({
            item,
            header: item.title,
            index: index,
            title: item.title,
            ds: item.description,
          })
        }
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        style={styles.locationList}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.location}>
        {renderLocationList()}
        {!showButton && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowButton(true);
              // Toast message to show the user that Rota hesaplanıyor
              ToastAndroid.show('Rota hesaplanıyor', ToastAndroid.SHORT);
              calculateMyDirections(PointstoCalculate).then(response => {
                if (response !== -1) {
                  const parsedRoute = JSON.parse(response);
                  let my_coordinates = DecodeGeo(
                    parsedRoute.routes[0].geometry,
                    false,
                  );
                  my_coordinates = my_coordinates.map(coordinate => ({
                    latitude: coordinate[0],
                    longitude: coordinate[1],
                  }));

                  console.log(my_coordinates);
                  setCoordinates(my_coordinates);
                } else {
                  console.log('error');
                }
              });
            }}>
            <Text style={styles.headerStyle}>Yol Tarifi</Text>
          </TouchableOpacity>
        )}
        {showButton && (
          <TouchableOpacity
            style={styles.buttonRed}
            onPress={() => {
              setShowButton(false);
              // Toast message to show the user that Rota hesaplanıyor
              ToastAndroid.show('Rota silindi!', ToastAndroid.SHORT);
              setCoordinates([]);
            }}>
            <Text style={styles.headerStyleRed}>Rotayı Sil</Text>
          </TouchableOpacity>
        )}
      </View>
      {renderMap()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  location: {
    top: 15,
    left: 0,
    position: 'absolute',
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationList: {
    // use dimension bak
    height: Dimensions.get('window').height / 3.5,
  },
  button: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 10,
    opacity: 0.83,
  },
  headerStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRed: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    opacity: 0.65,
  },
  headerStyleRed: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapScreen;
