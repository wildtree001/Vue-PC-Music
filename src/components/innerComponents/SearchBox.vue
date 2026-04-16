<template>
    <div class="search_wrap">
      <div class="search_input_wrapper">
        <input type="text"
               class="search_input"
               aria-label="请输入搜索内容" 
               @focus="handleFocus"
               @blur="handleBlur"
               @keyup.enter="handleSearch"
               v-model="keywords" 
               placeholder="搜索音乐、MV、歌单、用户">
        <button class="search_btn" @click="handleSearch">
          <i class="search_icon music_icon"></i>
        </button>
      </div>
      <div class="search_list_wrapper">
        <div class="recommend_area" :class="{'drop':isDrop && !keywords.trim()}">
          <div class="search_history" v-if="searchHistory.length > 0">
            <dl class="search_history_list">
              <dt class="search_history_title">
                搜索历史
                <a href="javascript:;" class="search_history_clear" @mousedown="handleClearAllHistory">
                  <i class="clear_icon music_icon"></i>
                </a>
              </dt>
              <dd>
                <a href="javascript:;" 
                   v-for="(item,index) in topSearchHistory" 
                   :key="index"
                   class="search_history_link"
                   @mousedown="selectHistory(item.keyword)">
                  <span class="search_history_icon music_icon"></span>
                  <span class="search_history_text">{{item.keyword}}</span>
                  <span class="search_history_delete" @mousedown.stop="handleDeleteHistory(item.keyword)">
                    <i class="delete_icon music_icon"></i>
                  </span>
                </a>
              </dd>
              <dd v-if="searchHistory.length > 5" class="show_all_history">
                <a href="javascript:;" @mousedown="goToHistoryPage">
                  查看全部搜索历史
                  <i class="more_arrow_icon music_icon"></i>
                </a>
              </dd>
            </dl>
          </div>
          <div class="search_hot">
            <dl class="search_hot_list">
              <dt class="search_hot_title">热门搜索</dt>
              <dd>
                <a href="javascript:;" 
                   v-for="item in HotMusic" 
                   :key="item.index"
                   class="search_hot_link"
                   @mousedown="selectHotSearch(item.songName)">
                  <span class="search_hot_index">{{item.index}}</span>
                  <span class="search_hot_name">{{item.songName}}</span>
                  <span class="search_hot_num">{{item.Number}}</span>
                </a>
              </dd>
            </dl>
          </div>
        </div>
        <div class="result_area" :class="{'drop':isDroped}">
          <div class="search_result_item" v-if="FilterMusic.songName.length > 0">
            <h4 class="search_result_item_title">
              <i class="music_icon song_icon ab_icon"></i>单曲
            </h4>
            <ul class="search_result_item_list">
              <li v-for="(item,index) in FilterMusic.songName.slice(0,5)" :key="index">
                <a class="search_result_link" href="javascript:;" @mousedown="searchKeyword(keywords)">
                  <span class="search_result_name" v-html="insertKeywordsStyle(item.song,keywords)"></span>-
                  <span class="search_result_singername" v-html="insertKeywordsStyle(item.singer,keywords)"></span>
                </a>
              </li>
            </ul>
          </div>
          <div class="search_result_item" v-if="FilterMusic.singerName.size > 0">
            <h4 class="search_result_item_title">
              <i class="music_icon singer_icon ab_icon"></i>歌手
            </h4>
            <ul class="search_result_item_list">
              <li v-for="(item,index) in Array.from(FilterMusic.singerName).slice(0,3)" :key="index">
                <a class="search_result_link" href="javascript:;" 
                   @mousedown="intoSingerIndex(item)" 
                   v-html="insertKeywordsStyle(item,keywords)"></a>
              </li>
            </ul>
          </div>
          <div class="search_result_item" v-if="FilterMusic.Albums.length > 0">
            <h4 class="search_result_item_title">
              <i class="music_icon album_icon ab_icon"></i>专辑
            </h4>
            <ul class="search_result_item_list">
              <li v-for="(item,index) in FilterMusic.Albums.slice(0,3)" :key="index">
                <a class="search_result_link" href="javascript:;" @mousedown="searchKeyword(keywords)">
                  <span class="search_result_name" v-html="insertKeywordsStyle(item.album,keywords)"></span>-
                  <span class="search_result_singername" v-html="insertKeywordsStyle(item.singer,keywords)"></span>
                </a>
              </li>
            </ul>
          </div>
          <div class="search_result_item" v-if="FilterMusic.Playlists.length > 0">
            <h4 class="search_result_item_title">
              <i class="music_icon playlist_icon ab_icon"></i>歌单
            </h4>
            <ul class="search_result_item_list">
              <li v-for="(item,index) in FilterMusic.Playlists.slice(0,3)" :key="index">
                <a class="search_result_link" href="javascript:;" @mousedown="searchKeyword(keywords)">
                  <span class="search_result_name" v-html="insertKeywordsStyle(item.title,keywords)"></span>
                </a>
              </li>
            </ul>
          </div>
          <div class="search_more" v-if="hasSearchResult" @mousedown="searchKeyword(keywords)">
            <a href="javascript:;">搜索 "{{keywords}}" <i class="more_arrow_icon music_icon"></i></a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import { 
    getSearchHistory, 
    addSearchHistory, 
    removeSearchHistory, 
    clearSearchHistory,
    getTopSearchHistory
  } from '../../utils/searchHistory';

  export default {
    name: "SearchBox",
    data:function () {
      return {
        _self:this,
        isDrop:false,
        keywords:'',
        Musics:[],
        SongLists:[],
        HotMusic:[],
        searchHistory: [],
        FilterMusic:{
          singerName: new Set(),
          songName: [],
          Albums: [],
          Playlists: []
        }
      }
    },
    computed:{
      isDroped:function () {
        return this.isDrop && !!(this.keywords.trim());
      },
      topSearchHistory() {
        return getTopSearchHistory(5);
      },
      hasSearchResult() {
        return this.FilterMusic.songName.length > 0 || 
               this.FilterMusic.singerName.size > 0 || 
               this.FilterMusic.Albums.length > 0 ||
               this.FilterMusic.Playlists.length > 0;
      }
    },
    methods:{
      handleFocus() {
        this.isDrop = true;
        this.loadSearchHistory();
      },
      handleBlur() {
        var self = this;
        setTimeout(function() {
          self.isDrop = false;
        }, 200);
      },
      loadSearchHistory() {
        this.searchHistory = getSearchHistory();
      },
      selectHistory(keyword) {
        this.keywords = keyword;
        this.searchKeyword(keyword);
      },
      selectHotSearch(keyword) {
        this.keywords = keyword;
        this.searchKeyword(keyword);
      },
      handleDeleteHistory(keyword) {
        removeSearchHistory(keyword);
        this.loadSearchHistory();
      },
      handleClearAllHistory() {
        clearSearchHistory();
        this.loadSearchHistory();
      },
      goToHistoryPage() {
        this.isDrop = false;
        this.$router.push({ name: 'SearchHistory' });
      },
      handleSearch() {
        if (this.keywords.trim()) {
          this.searchKeyword(this.keywords.trim());
        }
      },
      searchKeyword(keyword) {
        if (!keyword || !keyword.trim()) return;
        
        addSearchHistory(keyword.trim());
        this.$router.push({
          name: 'Search',
          query: { keyword: keyword.trim() }
        });
        this.isDrop = false;
      },
      clearMusic(){
        this.FilterMusic.songName = [];
        this.FilterMusic.singerName.clear();
        this.FilterMusic.Albums = [];
        this.FilterMusic.Playlists = [];
      },
      ReduceArray(arr, key){
        var obj={},
          result=[];
        result=arr.reduce(function (item,next) {
          obj[next[key]] ? "" : obj[next[key]]=true && item.push(next);
          return item;
        },[]);
        return result;
      },
      intoSingerIndex(name){
        addSearchHistory(name);
        this.$router.push({name:'Singer',params:{sn:name}});
        this.isDrop = false;
      },
      insertKeywordsStyle(text,keyword){
        text = text +'';
        if(!!~text.indexOf(keyword) && !!keyword){
          return text.replace(keyword,'<span class="search_result__keywords">'+keyword+'</span>');
        }else{
          return text;
        }
      }
    },
    watch:{
      keywords:function (key) {
        let _self=this;
        if(!!key.trim()){
          this.clearMusic();
          
          for (var item of _self.Musics){
            if(item.singerName.indexOf(key) > -1){
              _self.FilterMusic.singerName.add(item.singerName);
            }
            
            for(var m = 0; m < item.songName.length; m++){
              var song = item.songName[m];
              if(!!~song.name.indexOf(key)){
                _self.FilterMusic.songName.push({"song":song.name,"singer":item.singerName});
                _self.FilterMusic.songName = _self.ReduceArray(_self.FilterMusic.songName, 'song');
              }
            }
            
            for(var n = 0; n < item.Albums.length; n++){
              var album = item.Albums[n];
              if(!!~album.indexOf(key)){
                _self.FilterMusic.Albums.push({"singer":item.singerName,"album":album});
                _self.FilterMusic.Albums = _self.ReduceArray(_self.FilterMusic.Albums, 'album');
              }
            }
          }
          
          var allPlaylists = [];
          if(_self.SongLists.Recommend && Array.isArray(_self.SongLists.Recommend)){
            allPlaylists.push.apply(allPlaylists, _self.SongLists.Recommend);
          }
          if(_self.SongLists.Starting && Array.isArray(_self.SongLists.Starting)){
            allPlaylists.push.apply(allPlaylists, _self.SongLists.Starting);
          }
          for(var p = 0; p < allPlaylists.length; p++){
            var list = allPlaylists[p];
            if(list.title && !!~list.title.indexOf(key)){
              _self.FilterMusic.Playlists.push(list);
              _self.FilterMusic.Playlists = _self.ReduceArray(_self.FilterMusic.Playlists, 'dissid');
            }
          }
        }else {
          _self.clearMusic();
          _self.loadSearchHistory();
        }
      }
    },
    mounted() {
      let _self=this;
      this.loadSearchHistory();
      axios.get("../../../static/data.json")
        .then((response)=>{
          _self.Musics=response.data.Music;
          _self.SongLists=response.data.SongLists || {};
          _self.HotMusic=response.data.Recommend;
        })
        .catch((error)=>{
          console.log(error);
        })
    }
  }

</script>

<style scoped>
.search_history_link{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 11px;
  line-height: 36px;
  cursor: pointer;
}
.search_history_link:hover{
  background-color: #fbfbfb;
}
.search_history_icon{
  width: 14px;
  height: 14px;
  background-position: -160px -240px;
  margin-right: 8px;
  flex-shrink: 0;
}
.search_history_text{
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #333;
}
.search_history_delete{
  display: none;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
}
.search_history_link:hover .search_history_delete{
  display: block;
}
.delete_icon{
  width: 12px;
  height: 12px;
  background-position: -100px 0;
  display: block;
  margin-top: 2px;
}
.delete_icon:hover{
  background-position: -20px -60px;
}
.show_all_history{
  text-align: center;
  border-top: 1px solid #f2f2f2;
}
.show_all_history a{
  display: inline-block;
  color: #31c27c;
  font-size: 12px;
  line-height: 36px;
}
.show_all_history a:hover{
  color: #2caf6f;
}
.playlist_icon{
  background-position: -160px -200px;
}
.search_more{
  padding: 10px 11px;
  border-top: 1px solid #f2f2f2;
  text-align: center;
}
.search_more a{
  color: #31c27c;
  font-size: 14px;
}
.search_more a:hover{
  color: #2caf6f;
}
.more_arrow_icon{
  width: 8px;
  height: 14px;
  background-position: -160px -60px;
  display: inline-block;
  margin-left: 4px;
  vertical-align: -2px;
}
</style>
