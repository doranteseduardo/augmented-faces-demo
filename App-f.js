import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, PermissionsAndroid, FlatList, TouchableOpacity } from 'react-native';
import { AugmentedFacesView } from '@sceneview/react-native-sceneform';

const ExampleSet = [
  {title: 'Mesh',       model:  'models/face.glb',    texture:  'textures/face.png'},
  {title: 'Fox',        model:  'models/fox.glb',     texture:  'textures/freckles.png'},
  {title: 'Mario hat',  model:  'models/mario-hat.glb'}
];

const MyAugmentedFacesView = () => {
  const [augmentedFaceIndex,      setAugmentedFaceIndex]  = useState(-1);
  const [augmentedFaces,          setAugmentedFaces]      = useState([]);
  const [cameraPermissionGranted, setCameraPermission]    = useState(false);
  const augmentedFacesView                                = useRef(null);

  const checkPermissions = async () => {
    const actual = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if(actual){
      setCameraPermission(true);
    }
    else{
      const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if(permission == 'granted'){
        setCameraPermission(true);
      }
    }
  }

  const loadAssets = () => {
    ExampleSet.forEach((item) => {
      augmentedFacesView.current.addAugmentedFace(item)
      .then((index) => {
        setAugmentedFaces(prevFaces => [...prevFaces, {...item, index}]);
      })
    })
  }

  useEffect(() => {
    if(!cameraPermissionGranted){
      checkPermissions();
    }
    else{
      loadAssets();
    }
  }, [cameraPermissionGranted]);

  return(
    <SafeAreaView style={styles.container}>
      {cameraPermissionGranted &&
        <View style={styles.container}>
          <AugmentedFacesView
            style={styles.camera}
            setAugmentedFace={augmentedFaceIndex}
            ref={augmentedFacesView}
            />
            <View style={styles.overlay}>
              <FlatList
                horizontal={true}
                data={augmentedFaces}
                renderItem={({item}) => {
                  return(
                    <TouchableOpacity style={styles.touchable} onPress={() => { setAugmentedFaceIndex(item.index)}}>
                      <View style={styles.touchable_body}>
                        <Text style={styles.text}>{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                style={styles.flatlist}
                contentContainerStyle={styles.flatlist_container}
              />
            </View>
        </View>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  camera: {
    flex: 1
  },
  overlay: {
    zIndex: 2,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
  },
  flatlist: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  flatlist_container:{
    alignItems: 'center'
  },
  touchable: {
    width: 100,
    height: 50,
    padding: 5
  },
  touchable_body: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

export default MyAugmentedFacesView;