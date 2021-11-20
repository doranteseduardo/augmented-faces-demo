import React, { Component } from 'react';
import { SafeAreaView, View, Text, StyleSheet, PermissionsAndroid, FlatList, TouchableOpacity } from 'react-native';
import { AugmentedFacesView } from '@sceneview/react-native-sceneform';

const ExampleSet = [
  {title: 'Mesh',       model:  'models/face.glb',    texture:  'textures/face.png'},
  {title: 'Fox',        model:  'models/fox.glb',     texture:  'textures/freckles.png'},
  {title: 'Mario hat',  model: 'models/mario-hat.glb'}
];

class MyAugmentedFacesView extends Component {
  constructor(props){
    super(props);
    this.state = {
      cameraPermissionGranted:  false,
      augmentedFaceIndex:       -1,
      augmentedFaces:           []
    }
    this.checkPermissions   = this.checkPermissions.bind(this);
    this.loadAssets         = this.loadAssets.bind(this);
    this.augmentedFacesView = null;
  }

  componentDidMount(){
    this.checkPermissions();
  }

  checkPermissions = async () => {
    const actual = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if(actual){
      this.setState({cameraPermissionGranted: true}, this.loadAssets);
    }
    else{
      const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if(permission == 'granted'){
        this.setState({cameraPermissionGranted: true}, this.loadAssets);
      }
    }
  }

  loadAssets = () => {
    ExampleSet.forEach((item) => {
      this.augmentedFacesView.addAugmentedFace(item)
      .then((index) => {
        const faces = [...this.state.augmentedFaces, {...item, index}];
        this.setState({augmentedFaces: faces});
      })
    })
  }

  render(){
    return(
      <SafeAreaView style={styles.container}>
        {this.state.cameraPermissionGranted &&
          <View style={styles.container}>
            <AugmentedFacesView
              style={styles.camera}
              setAugmentedFace={this.state.augmentedFaceIndex}
              ref={(c) => this.augmentedFacesView = c}
              />
              <View style={styles.overlay}>
                <FlatList
                  horizontal={true}
                  data={this.state.augmentedFaces}
                  renderItem={({item}) => {
                    return(
                      <TouchableOpacity style={styles.touchable} onPress={() => { this.setState({augmentedFaceIndex: item.index})}}>
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