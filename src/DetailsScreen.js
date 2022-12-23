import React from 'react';
import {StyleSheet, SafeAreaView, TextInput, Text, Button} from 'react-native';
import {useState} from 'react';
import {getDataMMKV, storeDataMMKV} from './MMKVStore';
const DetailsScreen = ({route, navigation: {goBack}}) => {
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const {index, title, ds} = route.params;
  var myPlaceholderTitle = 'Konum Başlığı';
  var myPlaceholderDescription = 'Konum Açıklaması';
  var Flag;

  if (!title && !ds) {
    Flag = true;
  }

  if (title && ds) {
    myPlaceholderTitle = title;
    myPlaceholderDescription = ds;
    Flag = false;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Konum Detayı</Text>
      <TextInput
        placeholder={myPlaceholderTitle}
        value={address}
        onChangeText={text => setAddress(text)}
        keyboardType="address"
        style={styles.input}
      />
      <TextInput
        placeholder={myPlaceholderDescription}
        value={description}
        onChangeText={text => setDescription(text)}
        keyboardType="description"
        style={styles.input}
      />
      <Button
        style={styles.button}
        visible={Flag}
        color="darkgray"
        title="Kaydet"
        onPress={() => {
          getDataMMKV('markers').then(data => {
            if (data != null) {
              if (data.length >= 0) {
                data[index].title = address;
                data[index].description = description;
                storeDataMMKV('markers', data);
                goBack('MapScreen', {address, description});
              }
            }
          });
        }}
      />
      <Button
        style={styles.button}
        visible={Flag}
        color="darkgray"
        title="Sil"
        onPress={() => {
          getDataMMKV('markers').then(data => {
            if (data != null) {
              if (data.length >= 0) {
                data.splice(index, 1);
                storeDataMMKV('markers', data);
                goBack('MapScreen');
              }
            }
          });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b5998',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    width: '80%',
    marginTop: 10,
    color: '#000',
    marginBottom: 15,
  },
  // style for button
});

export default DetailsScreen;
