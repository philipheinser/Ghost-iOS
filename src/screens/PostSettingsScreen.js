// @flow
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
  TouchableOpacity,
  ScrollView,
  WebView,
  Linking,
  Keyboard,
  Animated,
} from 'react-native';
import { ImagePicker } from 'expo';
import { observer, inject } from 'mobx-react/native';
import { FontAwesome } from '@expo/vector-icons';

import { LightGrey, GhostBlue, MidGrey, White, DarkGrey } from '../Colors';

@inject('store')
@observer
class PostSettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Post Settings',
  };

  constructor(props) {
    super(props);

    const { params } = props.navigation.state;
    const markdown = params.mobiledoc;
  }

  render() {
    const {
      showShortcuts,
      darkEditor,
      markdownShortcuts,
    } = this.props.store.uiStore;

    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightGrey,
  },
});

export default PostSettingsScreen;
