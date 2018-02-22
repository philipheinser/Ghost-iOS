import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  AsyncStorage,
  FlatList,
  ActivityIndicator,
  Image,
  Switch,
  TouchableHighlight,
} from 'react-native';
import Unsplash from 'unsplash-js';
import { White, LightGrey } from '../Colors';

const unsplash = new Unsplash({
  applicationId:
    '8672af113b0a8573edae3aa3713886265d9bb741d707f6c01a486cde8c278980',
});

export default class UnsplashScreen extends React.Component {
  static navigationOptions = {
    title: 'Unsplash',
  };

  constructor() {
    super();

    this.state = {
      images: [],
      searchTerm: '',
      loading: false,
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.loadImages(false);
  }

  loadImages = append => {
    this.setState(
      {
        loading: true,
        currentPage: append === true ? this.state.currentPage + 1 : 1,
      },
      () => {
        if (this.state.searchTerm.trim() === '') {
          unsplash.photos
            .listCuratedPhotos(this.state.currentPage)
            .then(res => res.json())
            .then(images => {
              this.setState({
                images:
                  append === true ? this.state.images.concat(images) : images,
                loading: false,
              });
            });
        } else {
          unsplash.search
            .photos(this.state.searchTerm, this.state.currentPage)
            .then(res => res.json())
            .then(json => {
              this.setState({
                images:
                  append === true
                    ? this.state.images.concat(json.results)
                    : json.results,
                loading: false,
              });
            });
        }
      }
    );
  };

  renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.navigation.goBack();
          this.props.navigation.state.params.selectedImage(item);
        }}
        style={{ padding: 8, flex: 1 }}
      >
        <Image
          style={{ width: '100%', aspectRatio: item.width / item.height }}
          source={{ uri: item.urls.small }}
        />
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: White, padding: 8 }}>
          <TextInput
            style={{
              height: 50,
              backgroundColor: LightGrey,
              borderRadius: 25,
              padding: 8,
            }}
            clearButtonMode="always"
            clearTextOnFocus={true}
            onChangeText={searchTerm => this.setState({ searchTerm })}
            value={this.state.searchTerm}
            returnKeyType="search"
            placeholder="Beautiful, free photos."
            onSubmitEditing={() => {
              this.loadImages(false);
            }}
          />
        </View>
        <FlatList
          refreshing={this.state.loading}
          onRefresh={this.loadImages}
          style={{ backgroundColor: LightGrey }}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          data={this.state.images}
          onEndReached={() => {
            this.loadImages(true);
          }}
        />
      </View>
    );
  }
}
