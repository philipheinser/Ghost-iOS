// @flow

import { AsyncStorage } from 'react-native';
import { observable, action, runInAction, autorun } from 'mobx';

import PostStore from './stores/PostStore';
import UiStore from './stores/UiStore';

export class Store {
  postStore: PostStore;
  uiStore: UiStore;

  constructor() {
    this.postStore = new PostStore();
    this.uiStore = new UiStore();
  }
}

const store = new Store();

export default store;
