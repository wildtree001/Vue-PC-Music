// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'
import {Carousel,CarouselItem,Dialog,Button,Input,Loading,Message,MessageBox} from "element-ui";
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Carousel);
Vue.use(Input);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Loading);
Vue.use(CarouselItem);
Vue.use(Vuex);

Vue.prototype.$message = Message;
Vue.prototype.$MessageBox = MessageBox;
Vue.prototype.myWindow = window;
/* eslint-disable no-new */
var songList={}
var singers=[]
var music=[]
axios.get("../static/data.json")
  .then((response)=>{
    // 将歌单数据保存到songList
    console.log("给劲嗷，铁汁");
    songList=response.data.SongLists;
    singers=response.data.Singer.map(singer=>{
      return {
        name:singer.name,
        id:singer.id,
        photo:require("./assets/images/singer/"+singer.name+".jpg"),
        photo1:require("./assets/images/SingerInfoImg/"+singer.name+".jpg"),
        introduce:singer.introduce,
        fans:singer.fans
      }
    });
    music=response.data.Music;
    const state={
      showHeader:true,
      Lists:songList,
      Singers:singers,
      Music:music,
      Login:false,
      user:JSON.parse(window.sessionStorage.getItem('user')),
      nowPlay:null,
      playListSong:[],
      favoriteSongs:JSON.parse(window.localStorage.getItem('favoriteSongs')) || [],
      favoriteSingers:JSON.parse(window.localStorage.getItem('favoriteSingers')) || [],
      favoritePlaylists:JSON.parse(window.localStorage.getItem('favoritePlaylists')) || [],
      favoriteFolders:JSON.parse(window.localStorage.getItem('favoriteFolders')) || [
        { id: 1, name: '默认收藏夹', songs: [], singers: [], playlists: [], createTime: new Date().toISOString() }
      ]
    }
    const getters={
      isShow(state) {
        return state.showHeader;
      },
      isLogin(state){
        return state.Login;
      },
      User(state){
        return state.user;
      },
      NowPlay(state){
        return state.nowPlay;
      },
      ListSong(state){
        return state.playListSong;
      },
      FavoriteSongs(state){
        return state.favoriteSongs;
      },
      FavoriteSingers(state){
        return state.favoriteSingers;
      },
      FavoritePlaylists(state){
        return state.favoritePlaylists;
      },
      FavoriteFolders(state){
        return state.favoriteFolders;
      }
    }
    const mutations={
      hide(state){
        state.showHeader=false;
      },
      show(state){
        state.showHeader=true;
      },
      loginIn(state){
        state.Login = true;
      },
      loginOut(state){
        state.Login = false;
      },
      setUser(state,user){
        state.user=user;
        window.sessionStorage.setItem('user',JSON.stringify(user));
      },
      setNowPlay(state,songinfo){
        state.nowPlay=songinfo;
      },
      AddSong(state,songinfo){
        state.playListSong.push(songinfo);
      },
      EvalSongList(state,lists){
        state.playListSong = lists;
      },
      addFavoriteSong(state, song){
        const exists = state.favoriteSongs.find(s => s.songmid === song.songmid);
        if (!exists) {
          state.favoriteSongs.push(song);
          window.localStorage.setItem('favoriteSongs', JSON.stringify(state.favoriteSongs));
        }
      },
      removeFavoriteSong(state, songmid){
        state.favoriteSongs = state.favoriteSongs.filter(s => s.songmid !== songmid);
        window.localStorage.setItem('favoriteSongs', JSON.stringify(state.favoriteSongs));
      },
      addFavoriteSinger(state, singer){
        const exists = state.favoriteSingers.find(s => s.id === singer.id);
        if (!exists) {
          state.favoriteSingers.push(singer);
          window.localStorage.setItem('favoriteSingers', JSON.stringify(state.favoriteSingers));
        }
      },
      removeFavoriteSinger(state, singerId){
        state.favoriteSingers = state.favoriteSingers.filter(s => s.id !== singerId);
        window.localStorage.setItem('favoriteSingers', JSON.stringify(state.favoriteSingers));
      },
      addFavoritePlaylist(state, playlist){
        const exists = state.favoritePlaylists.find(p => p.dissid === playlist.dissid);
        if (!exists) {
          state.favoritePlaylists.push(playlist);
          window.localStorage.setItem('favoritePlaylists', JSON.stringify(state.favoritePlaylists));
        }
      },
      removeFavoritePlaylist(state, dissid){
        state.favoritePlaylists = state.favoritePlaylists.filter(p => p.dissid !== dissid);
        window.localStorage.setItem('favoritePlaylists', JSON.stringify(state.favoritePlaylists));
      },
      addFavoriteFolder(state, folder){
        const newFolder = {
          id: Date.now(),
          name: folder.name,
          songs: [],
          singers: [],
          playlists: [],
          createTime: new Date().toISOString()
        };
        state.favoriteFolders.push(newFolder);
        window.localStorage.setItem('favoriteFolders', JSON.stringify(state.favoriteFolders));
      },
      removeFavoriteFolder(state, folderId){
        state.favoriteFolders = state.favoriteFolders.filter(f => f.id !== folderId);
        window.localStorage.setItem('favoriteFolders', JSON.stringify(state.favoriteFolders));
      },
      updateFavoriteFolder(state, { folderId, name }){
        const folder = state.favoriteFolders.find(f => f.id === folderId);
        if (folder) {
          folder.name = name;
          window.localStorage.setItem('favoriteFolders', JSON.stringify(state.favoriteFolders));
        }
      },
      addSongToFolder(state, { folderId, song }){
        const folder = state.favoriteFolders.find(f => f.id === folderId);
        if (folder) {
          const exists = folder.songs.find(s => s.songmid === song.songmid);
          if (!exists) {
            folder.songs.push(song);
            window.localStorage.setItem('favoriteFolders', JSON.stringify(state.favoriteFolders));
          }
        }
      },
      removeSongFromFolder(state, { folderId, songmid }){
        const folder = state.favoriteFolders.find(f => f.id === folderId);
        if (folder) {
          folder.songs = folder.songs.filter(s => s.songmid !== songmid);
          window.localStorage.setItem('favoriteFolders', JSON.stringify(state.favoriteFolders));
        }
      }
    }
    const actions={
      hideHeader(context){
        context.commit('hide');
      },
      showHeader(context){
        context.commit('show');
      },
      loginInMusic(context){
        context.commit('loginIn');
      },
      loginOutMusic(context){
        context.commit('loginOut');
      },
      SetUser(context,user){
        context.commit('setUser',user)
      },
      SetNowPlay(context,songinfo){
        context.commit('setNowPlay',songinfo);
      },
      AddSongToList(context,songinfo){
        context.commit('AddSong',songinfo);
      },
      EvalSongListForNew(context,lists){
        context.commit('EvalSongList',lists);
      },
      AddFavoriteSong(context, song){
        context.commit('addFavoriteSong', song);
      },
      RemoveFavoriteSong(context, songmid){
        context.commit('removeFavoriteSong', songmid);
      },
      AddFavoriteSinger(context, singer){
        context.commit('addFavoriteSinger', singer);
      },
      RemoveFavoriteSinger(context, singerId){
        context.commit('removeFavoriteSinger', singerId);
      },
      AddFavoritePlaylist(context, playlist){
        context.commit('addFavoritePlaylist', playlist);
      },
      RemoveFavoritePlaylist(context, dissid){
        context.commit('removeFavoritePlaylist', dissid);
      },
      AddFavoriteFolder(context, folder){
        context.commit('addFavoriteFolder', folder);
      },
      RemoveFavoriteFolder(context, folderId){
        context.commit('removeFavoriteFolder', folderId);
      },
      UpdateFavoriteFolder(context, data){
        context.commit('updateFavoriteFolder', data);
      },
      AddSongToFolder(context, data){
        context.commit('addSongToFolder', data);
      },
      RemoveSongFromFolder(context, data){
        context.commit('removeSongFromFolder', data);
      }
    }
    const store=new Vuex.Store({
      state,
      getters,
      mutations,
      actions
    })
    new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>',
    });
  })
  .catch((error)=>{
    console.log(error);
  })



