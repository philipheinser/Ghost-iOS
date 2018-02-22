// @flow

import { AsyncStorage, Dimensions } from 'react-native';
import { observable, action, runInAction, autorun, computed } from 'mobx';
import shortcuts from '../Shortcuts';
import { create, persist } from 'mobx-persist';

class UiStore {
  @persist
  @observable
  darkEditor = false;
  @persist
  @observable
  showShortcuts = true;
  @persist('list')
  @observable
  disabledShortcuts = [];
  @observable
  orientation = Dimensions.get('window').height > Dimensions.get('window').width
    ? 'PORTRAIT'
    : 'LANDSCAPE';

  constructor() {
    Dimensions.addEventListener('change', () => {
      this.orientation =
        Dimensions.get('window').height > Dimensions.get('window').width
          ? 'PORTRAIT'
          : 'LANDSCAPE';
    });
  }

  @computed
  get markdownShortcuts() {
    return shortcuts.filter(
      shortcut => this.disabledShortcuts.indexOf(shortcut.name) === -1
    );
  }

  @computed
  get allShortcuts() {
    return shortcuts.map(shortcut => {
      return {
        ...shortcut,
        enabled: this.disabledShortcuts.indexOf(shortcut.name) === -1,
      };
    });
  }
}

export default UiStore;
