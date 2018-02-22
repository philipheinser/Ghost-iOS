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
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { observer, inject } from 'mobx-react/native';
import shotcuts from '../Shortcuts';

import { LightGrey, DarkGrey, GhostBlue } from '../Colors';

@inject('store')
@observer
class ShortcutsScreen extends React.Component {
  static navigationOptions = {
    title: 'Shotcuts',
  };

  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    var {
      showShortcuts,
      allShortcuts,
      disabledShortcuts,
    } = this.props.store.uiStore;

    return (
      <View style={styles.container}>
        <View style={{}}>
          <Text style={{ color: '#738a94', padding: 8 }}>FULL</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Switch
            style={{ margin: 8 }}
            value={showShortcuts}
            onValueChange={() =>
              (this.props.store.uiStore.showShortcuts = !showShortcuts)
            }
          />
          <Text
            style={{
              flex: 1,
              fontSize: 22,
              color: '#15171a',
              fontWeight: '300',
              padding: 8,
            }}
          >
            Show Shortcut Bar
          </Text>
        </View>
        <View style={{}}>
          <Text style={{ color: '#738a94', padding: 8 }}>SELECTION</Text>
        </View>
        <FlatList
          data={allShortcuts}
          keyExtractor={item => item.name}
          renderItem={({ item }) => {
            return (
              <TouchableHighlight
                onPress={() => {
                  if (item.enabled) {
                    disabledShortcuts.push(item.name);
                  } else {
                    const i = disabledShortcuts.indexOf(item.name);
                    if (i != -1) {
                      disabledShortcuts.splice(i, 1);
                    }
                  }
                }}
              >
                <View
                  style={{
                    padding: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    height: 50,
                  }}
                >
                  <FontAwesome
                    style={{ width: 30 }}
                    name={item.icon}
                    size={24}
                    color={DarkGrey}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 22,
                      color: '#15171a',
                      fontWeight: '300',
                      padding: 8,
                    }}
                  >
                    {item.name}
                  </Text>
                  {item.enabled && (
                    <Ionicons
                      name="ios-checkmark"
                      size={44}
                      color={GhostBlue}
                    />
                  )}
                </View>
              </TouchableHighlight>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightGrey,
  },
});

export default ShortcutsScreen;
