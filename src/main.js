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
      userFolders:JSON.parse(window.localStorage.getItem('userFolders')) || [
        { id: 1, name: '默认收藏夹', songs: [], createTime: new Date().toISOString() }
      ],
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
      UserFolders(state){
        return state.userFolders;
      },
      isSongFavorite: (state) => (songmid) => {
        return state.favoriteSongs.some(song => song.songmid === songmid);
      },
      isSingerFavorite: (state) => (singerName) => {
        return state.favoriteSingers.some(singer => singer.name === singerName);
      },
      isPlaylistFavorite: (state) => (dissid) => {
        return state.favoritePlaylists.some(playlist => playlist.dissid === dissid);
      },
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
        // 将用户信息保存到当前回话
        window.sessionStorage.setItem('user',JSON.stringify(user));
      },
      setNowPlay(state,songinfo){
        state.nowPlay=songinfo;
      },
      AddSong(state,songinfo){
        state.playListSong.push(songinfo);
      },
      // 直接将歌单中所有的歌曲赋值
      EvalSongList(state,lists){
        state.playListSong = lists;
      },
      addFavoriteSong(state,song){
        if(!state.favoriteSongs.some(s => s.songmid === song.songmid)){
          state.favoriteSongs.push(song);
          window.localStorage.setItem('favoriteSongs',JSON.stringify(state.favoriteSongs));
        }
      },
      removeFavoriteSong(state,songmid){
        state.favoriteSongs = state.favoriteSongs.filter(s => s.songmid !== songmid);
        window.localStorage.setItem('favoriteSongs',JSON.stringify(state.favoriteSongs));
      },
      addFavoriteSinger(state,singer){
        if(!state.favoriteSingers.some(s => s.name === singer.name)){
          state.favoriteSingers.push(singer);
          window.localStorage.setItem('favoriteSingers',JSON.stringify(state.favoriteSingers));
        }
      },
      removeFavoriteSinger(state,singerName){
        state.favoriteSingers = state.favoriteSingers.filter(s => s.name !== singerName);
        window.localStorage.setItem('favoriteSingers',JSON.stringify(state.favoriteSingers));
      },
      addFavoritePlaylist(state,playlist){
        if(!state.favoritePlaylists.some(p => p.dissid === playlist.dissid)){
          state.favoritePlaylists.push(playlist);
          window.localStorage.setItem('favoritePlaylists',JSON.stringify(state.favoritePlaylists));
        }
      },
      removeFavoritePlaylist(state,dissid){
        state.favoritePlaylists = state.favoritePlaylists.filter(p => p.dissid !== dissid);
        window.localStorage.setItem('favoritePlaylists',JSON.stringify(state.favoritePlaylists));
      },
      createFolder(state,folderName){
        const newFolder = {
          id: Date.now(),
          name: folderName,
          songs: [],
          createTime: new Date().toISOString()
        };
        state.userFolders.push(newFolder);
        window.localStorage.setItem('userFolders',JSON.stringify(state.userFolders));
      },
      deleteFolder(state,folderId){
        // 不允许删除默认收藏夹
        if(folderId !== 1){
          state.userFolders = state.userFolders.filter(f => f.id !== folderId);
          window.localStorage.setItem('userFolders',JSON.stringify(state.userFolders));
        }
      },
      renameFolder(state,{folderId,newName}){
        const folder = state.userFolders.find(f => f.id === folderId);
        if(folder){
          folder.name = newName;
          window.localStorage.setItem('userFolders',JSON.stringify(state.userFolders));
        }
      },
      addSongToFolder(state,{folderId,song}){
        const folder = state.userFolders.find(f => f.id === folderId);
        if(folder && !folder.songs.some(s => s.songmid === song.songmid)){
          folder.songs.push(song);
          window.localStorage.setItem('userFolders',JSON.stringify(state.userFolders));
        }
      },
      removeSongFromFolder(state,{folderId,songmid}){
        const folder = state.userFolders.find(f => f.id === folderId);
        if(folder){
          folder.songs = folder.songs.filter(s => s.songmid !== songmid);
          window.localStorage.setItem('userFolders',JSON.stringify(state.userFolders));
        }
      },
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
      AddFavoriteSong(context,song){
        context.commit('addFavoriteSong',song);
      },
      RemoveFavoriteSong(context,songmid){
        context.commit('removeFavoriteSong',songmid);
      },
      AddFavoriteSinger(context,singer){
        context.commit('addFavoriteSinger',singer);
      },
      RemoveFavoriteSinger(context,singerName){
        context.commit('removeFavoriteSinger',singerName);
      },
      AddFavoritePlaylist(context,playlist){
        context.commit('addFavoritePlaylist',playlist);
      },
      RemoveFavoritePlaylist(context,dissid){
        context.commit('removeFavoritePlaylist',dissid);
      },
      CreateFolder(context,folderName){
        context.commit('createFolder',folderName);
      },
      DeleteFolder(context,folderId){
        context.commit('deleteFolder',folderId);
      },
      RenameFolder(context,{folderId,newName}){
        context.commit('renameFolder',{folderId,newName});
      },
      AddSongToFolder(context,{folderId,song}){
        context.commit('addSongToFolder',{folderId,song});
      },
      RemoveSongFromFolder(context,{folderId,songmid}){
        context.commit('removeSongFromFolder',{folderId,songmid});
      },
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



