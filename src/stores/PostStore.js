// @flow

import { AsyncStorage } from 'react-native';
import { observable, action, runInAction, reaction, computed } from 'mobx';
import { create, persist } from 'mobx-persist';

class PostStore {
  @observable posts = [];
  @observable page = 1;
  @observable nextPage = null;
  @observable fetchingPosts = false;
  @observable
  filter = {
    status: 'all',
  };
  @persist
  @observable
  order = '';

  constructor() {
    reaction(
      () => {
        return { status: this.filter.status, order: this.order };
      },
      () => {
        console.log(this);
        this.fetchPosts(false);
      },
      {
        context: this,
      }
    );
  }

  @action.bound
  async fetchPosts(loadmore: ?boolean) {
    if (this.fetchingPosts || (loadmore && !this.nextPage)) {
      return false;
    }

    this.fetchingPosts = true;
    this.page = loadmore ? this.nextPage : 1;

    try {
      const data = await AsyncStorage.getItem('userInfo');
      const clientInfo = JSON.parse(data);
      const { posts, meta: { pagination: { next } } } = await fetch(
        `${clientInfo.url}/ghost/api/v0.1/posts/?status=${this.filter.status}${
          this.filter.status === 'all' ? '&staticPages=all' : ''
        }&include=author,tags&formats=plaintext,mobiledoc${
          this.order ? '&order=' + this.order : ''
        }&limit=15&page=${this.page}`,
        {
          headers: {
            Authorization: `Bearer ${clientInfo.access_token}`,
            'App-Pragma': 'no-cache',
          },
        }
      ).then(res => res.json());
      runInAction(() => {
        const newPosts = posts.map(post => {
          const newPost = new Post();
          newPost.updateFromJson(post);
          return newPost;
        });
        if (this.page !== 1) {
          this.posts.replace(this.posts.concat(newPosts));
        } else {
          this.posts.replace(newPosts);
        }
        this.nextPage = next;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.fetchingPosts = false;
    }
  }

  @action
  clearPosts() {
    this.page = 1;
    this.nextPage = null;
    this.fetchingPosts = false;
    this.posts = [];
  }
}

export class Author {
  id: ?String = null;

  @observable name = '';

  constructor(json) {
    this.id = json.id;
    this.name = json.name;
  }
}

export class Post {
  id: ?string = null;
  uuid: ?string = null;

  @observable title = '(Untitled)';
  @observable slug = '';
  @observable mobiledoc = '';
  @observable plaintext = '';
  @observable amp = '';
  @observable feature_image = '';
  @observable featured = false;
  @observable page = false;
  @observable status = '';
  @observable visibility = '';
  @observable meta_title: ?string = null;
  @observable meta_description: ?string = null;
  @observable author_id = '';
  @observable created_at = new Date();
  @observable created_by = '';
  @observable updated_at = new Date();
  @observable updated_by = '';
  @observable published_at: ?Date = null;
  @observable published_by: ?string = null;
  @observable codeinjection_head: ?string = null;
  @observable codeinjection_foot: ?string = null;
  @observable og_image: ?string = null;
  @observable og_title: ?string = null;
  @observable og_description: ?string = null;
  @observable twitter_image: ?string = null;
  @observable twitter_title: ?string = null;
  @observable twitter_description: ?string = null;

  @observable author: ?Author = null;

  @observable saving = false;
  @observable scratch: ?String = null;
  @observable titleScratch: ?String = null;

  @computed
  get asJson() {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      mobiledoc: this.mobiledoc,
      amp: this.amp,
      feature_image: this.feature_image,
      featured: this.featured,
      page: this.page,
      status: this.status,
      visibility: this.visibility,
      meta_title: this.meta_title,
      meta_description: this.meta_description,
      author_id: this.author_id,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
      published_at: this.published_at,
      published_by: this.published_by,
      codeinjection_head: this.codeinjection_head,
      codeinjection_foot: this.codeinjection_foot,
      og_image: this.og_image,
      og_title: this.og_title,
      og_description: this.og_description,
      twitter_image: this.twitter_image,
      twitter_title: this.twitter_title,
      twitter_description: this.twitter_description,
    };
  }

  updateFromJson(json) {
    // make sure our changes aren't send back to the server
    this.autoSave = false;
    this.id = json.id;
    this.uuid = json.uuid;
    this.title = json.title;
    this.slug = json.slug;
    this.mobiledoc = json.mobiledoc;
    this.plaintext = json.plaintext;
    this.amp = json.amp;
    this.feature_image = json.feature_image;
    this.featured = json.featured;
    this.page = json.page;
    this.status = json.status;
    this.visibility = json.visibility;
    this.meta_title = json.meta_title;
    this.meta_description = json.meta_description;
    this.author_id = json.author_id;
    this.created_at = json.created_at;
    this.created_by = json.created_by;
    this.updated_at = json.updated_at;
    this.updated_by = json.updated_by;
    this.published_at = json.published_at;
    this.published_by = json.published_by;
    this.codeinjection_head = json.codeinjection_head;
    this.codeinjection_foot = json.codeinjection_foot;
    this.og_image = json.og_image;
    this.og_title = json.og_title;
    this.og_description = json.og_description;
    this.twitter_image = json.twitter_image;
    this.twitter_title = json.twitter_title;
    this.twitter_description = json.twitter_description;

    this.author = new Author(json.author);
    this.autoSave = true;
  }

  async updatePost() {
    this.saving = true;
    try {
      const data = await AsyncStorage.getItem('userInfo');
      const clientInfo = JSON.parse(data);

      if (this.id) {
        const json = await fetch(
          `${clientInfo.url}/ghost/api/v0.1/posts/${
            this.id
          }?include=author,tags&formats=plaintext,mobiledoc`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${clientInfo.access_token}`,
              'App-Pragma': 'no-cache',
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
              posts: [
                {
                  id: this.id,
                  status: this.status,
                  title: this.titleScratch || this.title,
                  mobiledoc: this.scratch
                    ? JSON.stringify({
                        version: '0.3.1',
                        markups: [],
                        atoms: [],
                        cards: [
                          [
                            'card-markdown',
                            {
                              cardName: 'card-markdown',
                              markdown: this.scratch,
                            },
                          ],
                        ],
                        sections: [[10, 0]],
                      })
                    : this.mobiledoc,
                },
              ],
            }),
          }
        ).then(res => res.json());
      } else {
        const json = await fetch(
          `${
            clientInfo.url
          }/ghost/api/v0.1/posts/?include=author,tags&formats=plaintext,mobiledoc`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${clientInfo.access_token}`,
              'App-Pragma': 'no-cache',
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
              posts: [
                {
                  title: this.titleScratch,
                  mobiledoc: JSON.stringify({
                    version: '0.3.1',
                    markups: [],
                    atoms: [],
                    cards: [
                      [
                        'card-markdown',
                        { cardName: 'card-markdown', markdown: this.scratch },
                      ],
                    ],
                    sections: [[10, 0]],
                  }),
                },
              ],
            }),
          }
        ).then(res => res.json());
        this.id = json.posts[0].id;
      }

      const post = await fetch(
        `${clientInfo.url}/ghost/api/v0.1/posts/${
          this.id
        }/?include=author,tags&status=all&staticPages=all&formats=plaintext,mobiledoc`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${clientInfo.access_token}`,
            'App-Pragma': 'no-cache',
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      ).then(res => res.json());

      this.updateFromJson(post.posts[0]);
    } catch (error) {
      console.error(error);
    } finally {
      this.saving = false;
    }
  }

  async deletePost() {
    try {
      const data = await AsyncStorage.getItem('userInfo');
      const clientInfo = JSON.parse(data);

      const post = await fetch(
        `${clientInfo.url}/ghost/api/v0.1/posts/${this.id}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${clientInfo.access_token}`,
            'App-Pragma': 'no-cache',
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}

export default PostStore;
