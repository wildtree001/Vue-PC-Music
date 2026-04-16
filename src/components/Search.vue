<template>
    <div class="search_main" v-if="keyword">
      <div class="search_head">
        <h2 class="search_title">搜索 "{{keyword}}" 的结果</h2>
        <div class="search_tab">
          <a href="javascript:;" 
             v-for="(tab,index) in tabs" 
             :key="index"
             :class="{'search_tab_current': currentTab === tab.type}"
             @click="switchTab(tab.type)">
            {{tab.name}}
          </a>
        </div>
      </div>
      
      <div class="search_result">
        <div class="search_songs" v-if="currentTab === 'song'">
          <div class="song_list_wrap" v-if="searchSongs.length > 0">
            <ul class="song_list_head">
              <li class="song_list_head_name">歌曲</li>
              <li class="song_list_head_album">专辑</li>
              <li class="song_list_head_time">时长</li>
            </ul>
            <ul class="song_list_content">
              <li v-for="(item,index) of searchSongs" :key="index">
                <div class="song_list_item">
                  <div class="song_list_item_index song_list_col">
                    <span v-if="index < 3" class="hot_index">{{index+1}}</span>
                    <span v-else>{{index+1}}</span>
                  </div>
                  <div class="song_list_songname song_list_col">
                    <span class="song_list_songname_text">
                      <a href="javascript:;" @click="playSong(item)">{{item.name}}</a>
                    </span>
                    <div class="tool_nav_menu">
                      <a href="javascript:;" class="tool_menu_item tool_play" title="播放" @click="playSong(item)">
                        <i class="player_icon song_menu_icon"></i>
                      </a>
                      <a href="javascript:;" class="tool_menu_item tool_add" title="添加到歌单">
                        <i class="add_icon song_menu_icon"></i>
                      </a>
                    </div>
                  </div>
                  <div class="song_list_albumname song_list_col">
                    <a href="javascript:;">{{item.album}}</a>
                  </div>
                  <div class="song_list_songtime song_list_col">04:00</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="search_empty" v-else>
            <p class="empty_text">抱歉，没有找到相关的单曲</p>
          </div>
        </div>
        
        <div class="search_singers" v-if="currentTab === 'singer'">
          <div class="singer_list" v-if="searchSingers.length > 0">
            <ul class="singer_ul">
              <li class="singer_item" v-for="(singer,index) of searchSingers" :key="index">
                <div class="singer_item_inner">
                  <a href="javascript:;" @click="goSingerIndex(singer.singerName)" class="singer_apic">
                    <img class="singer_pic" :src="singer.photo || defaultSingerImg" :alt="singer.singerName"/>
                    <i class="singer_img_border"></i>
                  </a>
                  <h4 class="singer_name">
                    <a href="javascript:;" @click="goSingerIndex(singer.singerName)">{{singer.singerName}}</a>
                  </h4>
                </div>
              </li>
            </ul>
          </div>
          <div class="search_empty" v-else>
            <p class="empty_text">抱歉，没有找到相关的歌手</p>
          </div>
        </div>
        
        <div class="search_albums" v-if="currentTab === 'album'">
          <div class="album_list" v-if="searchAlbums.length > 0">
            <ul class="album_ul">
              <li class="album_item" v-for="(album,index) of searchAlbums" :key="index">
                <div class="album_item_inner">
                  <div class="album_top">
                    <a href="javascript:;" class="album_cover">
                      <img class="album_img" :src="album.photo || defaultAlbumImg" :alt="album.album"/>
                    </a>
                  </div>
                  <h4 class="album_title">
                    <a href="javascript:;" class="album_name">{{album.album}}</a>
                  </h4>
                  <p class="album_singer">
                    <a href="javascript:;" @click="goSingerIndex(album.singer)">{{album.singer}}</a>
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="search_empty" v-else>
            <p class="empty_text">抱歉，没有找到相关的专辑</p>
          </div>
        </div>
        
        <div class="search_playlists" v-if="currentTab === 'playlist'">
          <div class="playlist_list" v-if="searchPlaylists.length > 0">
            <ul class="mod_lists_ul">
              <li class="mod_lists_ul_li" v-for="(list,index) of searchPlaylists" :key="index">
                <div class="mod_lists_li_box">
                  <div class="mod_lists_li_top">
                    <a href="javascript:;">
                      <img :src="list.imgPath" class="mod_lists_li_img mod_lists_scale"/>
                      <i class="music_play_btn hot_play_btn"></i>
                    </a>
                  </div>
                  <h4 class="mod_lists_title">
                    <span class="mod_lists_text"><a href="javascript:;">{{list.title}}</a></span>
                  </h4>
                  <div class="mod_lists_author"><a href="javascript:;">{{list.author || '未知'}}</a></div>
                  <div class="mod_lists_num">播放量：{{list.num || list.number || '0'}}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="search_empty" v-else>
            <p class="empty_text">抱歉，没有找到相关的歌单</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {getMusicJson} from "../api/recommend";
  
  export default {
    name: "Search",
    data(){
      return {
        tabs: [
          { name: '单曲', type: 'song' },
          { name: '歌手', type: 'singer' },
          { name: '专辑', type: 'album' },
          { name: '歌单', type: 'playlist' }
        ],
        currentTab: 'song',
        searchSongs: [],
        searchSingers: [],
        searchAlbums: [],
        searchPlaylists: [],
        defaultSingerImg: require('../assets/images/singer/周杰伦.jpg'),
        defaultAlbumImg: require('../assets/images/album_cover_player.png')
      }
    },
    computed:{
      keyword(){
        return this.$route.query.keyword || '';
      }
    },
    watch:{
      '$route': 'performSearch'
    },
    methods:{
      switchTab(type){
        this.currentTab = type;
      },
      performSearch(){
        if(!this.keyword) return;
        
        this.searchSongs = [];
        this.searchSingers = [];
        this.searchAlbums = [];
        this.searchPlaylists = [];
        
        const keyword = this.keyword.toLowerCase();
        
        const Music = this.$store.state.Music || [];
        for(let item of Music){
          if(item.singerName.toLowerCase().indexOf(keyword) > -1){
            var singerPhoto = '';
            if(item.songName && item.songName.length > 0 && item.songName[0].photo){
              singerPhoto = item.songName[0].photo;
            }
            this.searchSingers.push({
              singerName: item.singerName,
              photo: singerPhoto
            });
          }
          
          for(let song of item.songName){
            if(song.name.toLowerCase().indexOf(keyword) > -1){
              this.searchSongs.push({
                name: song.name,
                album: song.album,
                photo: song.photo || '',
                songmid: song.songmid || '',
                singer: item.singerName
              });
            }
          }
          
          for(let album of item.Albums){
            if(album.toLowerCase().indexOf(keyword) > -1){
              var albumPhoto = '';
              var matchedSong = item.songName.find(function(s) { return s.album === album; });
              if(matchedSong && matchedSong.photo){
                albumPhoto = matchedSong.photo;
              }
              this.searchAlbums.push({
                album: album,
                singer: item.singerName,
                photo: albumPhoto
              });
            }
          }
        }
        
        const SongLists = this.$store.state.Lists || {};
        const allPlaylists = [];
        if(SongLists.Recommend && Array.isArray(SongLists.Recommend)){
          allPlaylists.push(...SongLists.Recommend);
        }
        if(SongLists.Starting && Array.isArray(SongLists.Starting)){
          allPlaylists.push(...SongLists.Starting);
        }
        for(let list of allPlaylists){
          if(list.title && list.title.toLowerCase().indexOf(keyword) > -1){
            this.searchPlaylists.push(list);
          }
        }
        
        this.searchSingers = this.uniqueArray(this.searchSingers, 'singerName');
        this.searchAlbums = this.uniqueArray(this.searchAlbums, 'album');
        this.searchPlaylists = this.uniqueArray(this.searchPlaylists, 'dissid');
      },
      uniqueArray(arr, key){
        let obj = {};
        return arr.reduce((prev, cur) => {
          if(!obj[cur[key]]){
            obj[cur[key]] = true;
            prev.push(cur);
          }
          return prev;
        }, []);
      },
      goSingerIndex(singerName){
        this.$router.push({name:'Singer',params:{sn:singerName}});
      },
      playSong(song){
        let info = {...song};
        
        getMusicJson(info.songmid)
          .then(res => {
            const domain = res.data.req.data.freeflowsip[0];
            const query = res.data.req_0.data.midurlinfo[0].purl;
            const url = domain + query;
            info.url = url;
            this.$store.dispatch('SetNowPlay',{song: info.name, singer: info.singer});
            this.$store.dispatch('AddSongToList', info);
            this.$router.push({name:'player'});
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    created() {
      this.performSearch();
      if(this.keyword){
        document.title = this.keyword + " - 搜索结果 - Music";
      }else{
        document.title = "搜索 - Music";
      }
    }
  }
</script>

<style>
.search_main{
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 40px;
}
.search_head{
  margin-bottom: 30px;
}
.search_title{
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 20px;
}
.search_tab{
  border-bottom: 1px solid #f2f2f2;
}
.search_tab a{
  display: inline-block;
  font-size: 15px;
  color: #333;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  position: relative;
}
.search_tab a:hover{
  color: #31c27c;
}
.search_tab_current{
  color: #31c27c !important;
}
.search_tab_current::after{
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #31c27c;
}

.search_result{
  min-height: 400px;
}

.song_list_wrap{
  position: relative;
}
.song_list_head{
  height: 50px;
  line-height: 50px;
  background-color: #fbfbfb;
  color: #999;
  padding-left: 46px;
  padding-right: 100px;
  position: relative;
}
.song_list_head_name{
  float: left;
  width: 47.685185%;
}
.song_list_head_album{
  float: left;
  width: 25.5%;
  padding-left: 20px;
}
.song_list_head_time{
  position: absolute;
  top: 0;
  right: 38px;
  width: 50px;
}
.song_list_content{
  overflow: hidden;
}
.song_list_item{
  overflow: hidden;
  position: relative;
  padding: 0 95px 0 46px;
}
.song_list_col{
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.song_list_item_index{
  position: absolute;
  top: 0;
  left: 10px;
  color: #999;
  width: 36px;
}
.hot_index{
  color: #ff4222;
}
.song_list_songname{
  float: left;
  width: 48%;
  position: relative;
}
.song_list_songname_text{
  float: left;
  max-width: 72%;
  margin-right: 8px;
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.song_list_songname_text a{
  color: #333;
}
.song_list_songname_text a:hover{
  color: #31c27c;
}
.song_list_albumname{
  float: left;
  padding-left: 15px;
  width: 26%;
  box-sizing: border-box;
}
.song_list_albumname a{
  color: #999;
}
.song_list_albumname a:hover{
  color: #31c27c;
}
.song_list_songtime{
  color: #999;
  position: absolute;
  top: 0;
  right: 38px;
  width: 50px;
}
.tool_nav_menu{
  position: absolute;
  right: -2px;
  top: 50%;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  height: 36px;
  margin-top: -18px;
}
.song_list_item:hover .tool_nav_menu{
  opacity: 1;
  pointer-events: inherit;
}
.tool_menu_item{
  margin-right: 5px;
  display: inline-block;
  width: 36px;
  vertical-align: top;
}
.song_menu_icon{
  width: 16px;
  height: 16px;
  display: block;
  margin: 10px 0 0 10px;
}
.singer_list{
  margin-right: -20px;
  overflow: hidden;
}
.singer_ul{
  overflow: hidden;
}
.singer_item{
  position: relative;
  display: inline-block;
  overflow: hidden;
  font-size: 14px;
  width: 16.6666%;
  margin-bottom: 25px;
  vertical-align: top;
}
.singer_item_inner{
  margin-right: 20px;
}
.singer_apic{
  position: relative;
  display: block;
  overflow: hidden;
  padding-top: 100%;
  margin-bottom: 15px;
}
.singer_pic{
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.singer_img_border{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: 0 0;
  background-image: url("../assets/images/cover_play.png");
  opacity: 0;
  transition: opacity .5s;
}
.singer_apic:hover .singer_img_border{
  opacity: 0.5;
}
.singer_name{
  overflow: hidden;
  text-align: center;
}
.singer_name a{
  color: #333;
  font-size: 14px;
}
.singer_name a:hover{
  color: #31c27c;
}

.album_list{
  margin-right: -20px;
  overflow: hidden;
}
.album_ul{
  overflow: hidden;
}
.album_item{
  position: relative;
  display: inline-block;
  overflow: hidden;
  font-size: 14px;
  width: 16.6666%;
  margin-bottom: 25px;
  vertical-align: top;
}
.album_item_inner{
  margin-right: 20px;
}
.album_top{
  position: relative;
  display: block;
  overflow: hidden;
  padding-top: 100%;
  margin-bottom: 15px;
}
.album_cover{
  display: block;
}
.album_img{
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.album_title{
  overflow: hidden;
}
.album_name{
  color: #333;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.album_name:hover{
  color: #31c27c;
}
.album_singer{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #999;
  font-size: 14px;
}
.album_singer a{
  color: #999;
}
.album_singer a:hover{
  color: #31c27c;
}

.playlist_list{
  overflow: hidden;
}
.mod_lists_ul{
  margin-right: -20px;
  overflow: hidden;
}
.mod_lists_ul_li{
  position: relative;
  display: inline-block;
  overflow: hidden;
  font-size: 14px;
  height: 100%;
  width: 20%;
  vertical-align: top;
  padding-bottom: 44px;
}
.mod_lists_li_box{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin-right: 20px;
}
.mod_lists_li_top{
  position: relative;
  display: block;
  overflow: hidden;
  padding-top: 100%;
  margin-bottom: 15px;
}
.mod_lists_li_img{
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.mod_lists_scale{
  transform: scale(1) translateZ(0);
  transition: transform .75s;
}
.mod_lists_li_top:hover .mod_lists_scale{
  transform: scale(1.07) translateZ(0);
  transition: transform .75s cubic-bezier(0,1,.75,1);
}
.music_play_btn{
  position: absolute;
  left: 50%;
  top: 50%;
  width: 70px;
  height: 70px;
  margin: -35px 0 0 -35px;
  opacity: 0;
  transform: scale(.7) translateZ(0);
  transition-property: opacity,transform;
  transition-duration: .5s;
  zoom: 1;
}
.hot_play_btn{
  background-image: url("../assets/images/cover_play.png");
}
.mod_lists_li_top:hover .music_play_btn{
  opacity: .9;
  transform: scale(1) translateZ(0);
  transition-property: opacity,transform;
  transition-duration: .5s;
  cursor: pointer;
}
.mod_lists_title{
  overflow: hidden;
}
.mod_lists_text{
  white-space: normal;
  float: left;
  max-width: 100%;
  line-height: 22px;
  max-height: 44px;
  font-weight: 400;
}
.mod_lists_text a{
  color: #333;
}
.mod_lists_text a:hover{
  color: #31c27c;
}
.mod_lists_author{
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  height: 22px;
}
.mod_lists_author a{
  color: #999;
}
.mod_lists_author a:hover{
  color: #31c27c;
}
.mod_lists_num{
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  height: 22px;
  font-size: 12px;
}

.search_empty{
  text-align: center;
  padding: 100px 0;
}
.empty_text{
  font-size: 16px;
  color: #999;
}

@media (max-width: 1240px) {
  .search_main{
    min-width: 900px;
    margin: 0 50px;
  }
  .singer_item{
    width: 20%;
  }
  .album_item{
    width: 20%;
  }
  .mod_lists_ul_li{
    width: 25%;
  }
}
</style>
