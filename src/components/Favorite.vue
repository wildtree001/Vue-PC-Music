<template>
    <div class="favorite_main">
      <div class="favorite_content">
        <div class="favorite_header">
          <h1 class="favorite_title">我的收藏</h1>
          <div class="favorite_tabs">
            <a href="javascript:;" 
               @click="currentTab = 'songs'" 
               :class="{'tab_active': currentTab === 'songs'}"
               class="tab_item">
              收藏歌曲 <span class="tab_count">({{favoriteSongs.length}})</span>
            </a>
            <a href="javascript:;" 
               @click="currentTab = 'singers'" 
               :class="{'tab_active': currentTab === 'singers'}"
               class="tab_item">
              收藏歌手 <span class="tab_count">({{favoriteSingers.length}})</span>
            </a>
            <a href="javascript:;" 
               @click="currentTab = 'playlists'" 
               :class="{'tab_active': currentTab === 'playlists'}"
               class="tab_item">
              收藏歌单 <span class="tab_count">({{favoritePlaylists.length}})</span>
            </a>
            <a href="javascript:;" 
               @click="currentTab = 'folders'" 
               :class="{'tab_active': currentTab === 'folders'}"
               class="tab_item">
              收藏夹 <span class="tab_count">({{userFolders.length}})</span>
            </a>
          </div>
        </div>

        <div class="favorite_body" v-show="currentTab === 'songs'">
          <div class="empty_state" v-if="favoriteSongs.length === 0">
            <div class="empty_icon"></div>
            <p class="empty_text">暂无收藏的歌曲</p>
            <p class="empty_hint">去发现页面找找喜欢的歌曲吧</p>
          </div>
          <div class="song_list" v-else>
            <ul class="song_list_head">
              <li class="song_list_head_index"></li>
              <li class="song_list_head_name">歌曲</li>
              <li class="song_list_head_singer">歌手</li>
              <li class="song_list_head_album">专辑</li>
              <li class="song_list_head_action">操作</li>
            </ul>
            <ul class="song_list_content">
              <li v-for="(song, index) in favoriteSongs" :key="song.songmid">
                <div class="song_list_item">
                  <div class="song_list_index song_list_col">{{index + 1}}</div>
                  <div class="song_list_songname song_list_col">
                    <span class="song_list_songname_text">
                      <a href="javascript:;">{{song.name}}</a>
                    </span>
                    <div class="tool_nav_menu">
                      <a href="javascript:;" class="tool_menu_item tool_play" title="播放" @click="playSong(song)">
                        <i class="player_icon song_menu_icon"></i>
                      </a>
                      <a href="javascript:;" class="tool_menu_item tool_add" title="添加到歌单">
                        <i class="add_icon song_menu_icon"></i>
                      </a>
                    </div>
                  </div>
                  <div class="song_list_singername song_list_col">
                    <a href="javascript:;">{{song.singer}}</a>
                  </div>
                  <div class="song_list_albumname song_list_col">
                    <a href="javascript:;">{{song.album}}</a>
                  </div>
                  <div class="song_list_action song_list_col">
                    <a href="javascript:;" title="取消收藏" @click="removeSong(song.songmid, song.name)">
                      <i class="music_icon favorite_remove_icon"></i>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="favorite_body" v-show="currentTab === 'singers'">
          <div class="empty_state" v-if="favoriteSingers.length === 0">
            <div class="empty_icon"></div>
            <p class="empty_text">暂无收藏的歌手</p>
            <p class="empty_hint">去歌手页面关注喜欢的歌手吧</p>
          </div>
          <div class="singer_grid" v-else>
            <div class="singer_item" v-for="singer in favoriteSingers" :key="singer.name">
              <div class="singer_avatar" @click="goToSinger(singer.name)">
                <img :src="singer.photo" :alt="singer.name" class="singer_img">
                <div class="singer_hover_mask">
                  <i class="music_icon play_icon_small"></i>
                </div>
              </div>
              <div class="singer_info">
                <h4 class="singer_name">{{singer.name}}</h4>
                <p class="singer_fans">{{singer.fans}} 粉丝</p>
              </div>
              <a href="javascript:;" class="remove_btn" @click="removeSinger(singer.name)">取消关注</a>
            </div>
          </div>
        </div>

        <div class="favorite_body" v-show="currentTab === 'playlists'">
          <div class="empty_state" v-if="favoritePlaylists.length === 0">
            <div class="empty_icon"></div>
            <p class="empty_text">暂无收藏的歌单</p>
            <p class="empty_hint">去分类歌单页面收藏喜欢的歌单吧</p>
          </div>
          <div class="playlist_grid" v-else>
            <div class="playlist_item" v-for="playlist in favoritePlaylists" :key="playlist.dissid">
              <div class="playlist_cover">
                <img :src="playlist.imgPath" :alt="playlist.title" class="playlist_img">
                <div class="playlist_hover_mask">
                  <a href="javascript:;" @click="playPlaylist(playlist)" class="play_all_btn">
                    <i class="music_icon play_icon_small"></i>
                  </a>
                </div>
              </div>
              <div class="playlist_info">
                <h4 class="playlist_title">{{playlist.title}}</h4>
                <p class="playlist_playcount">播放量：{{playlist.number}}</p>
              </div>
              <a href="javascript:;" class="remove_btn" @click="removePlaylist(playlist.dissid, playlist.title)">取消收藏</a>
            </div>
          </div>
        </div>

        <div class="favorite_body" v-show="currentTab === 'folders'">
          <div class="folder_toolbar">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="showCreateDialog = true">
              新建收藏夹
            </el-button>
          </div>
          <div class="folder_list">
            <div class="folder_item" v-for="folder in userFolders" :key="folder.id">
              <div class="folder_header">
                <div class="folder_icon">
                  <i class="music_icon folder_icon_img"></i>
                </div>
                <div class="folder_info">
                  <h4 class="folder_name">
                    <span v-if="!isEditing(folder.id)">{{folder.name}}</span>
                    <el-input v-else v-model="editFolderName" size="small" @blur="saveFolderName(folder.id)" @keyup.enter.native="saveFolderName(folder.id)"></el-input>
                  </h4>
                  <p class="folder_songcount">{{folder.songs.length}} 首歌曲</p>
                  <p class="folder_createtime">创建于 {{formatDate(folder.createTime)}}</p>
                </div>
                <div class="folder_actions">
                  <a href="javascript:;" class="action_btn" title="重命名" @click="startEdit(folder.id, folder.name)" v-if="folder.id !== 1">
                    <i class="el-icon-edit"></i>
                  </a>
                  <a href="javascript:;" class="action_btn" title="删除" @click="deleteFolder(folder.id, folder.name)" v-if="folder.id !== 1">
                    <i class="el-icon-delete"></i>
                  </a>
                </div>
              </div>
              <div class="folder_songs" v-if="folder.songs.length > 0">
                <ul class="song_list_content">
                  <li v-for="(song, index) in folder.songs.slice(0, 5)" :key="song.songmid">
                    <div class="song_list_item">
                      <div class="song_list_index song_list_col">{{index + 1}}</div>
                      <div class="song_list_songname song_list_col">
                        <span class="song_list_songname_text">
                          <a href="javascript:;">{{song.name}}</a>
                        </span>
                      </div>
                      <div class="song_list_singername song_list_col">
                        <a href="javascript:;">{{song.singer}}</a>
                      </div>
                      <div class="song_list_action song_list_col">
                        <a href="javascript:;" title="从收藏夹移除" @click="removeSongFromFolder(folder.id, song.songmid)">
                          <i class="music_icon favorite_remove_icon"></i>
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
                <a href="javascript:;" class="view_all_btn" v-if="folder.songs.length > 5">查看全部 {{folder.songs.length}} 首歌曲</a>
              </div>
              <div class="empty_folder" v-else>
                <p>该收藏夹暂无歌曲</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-dialog title="新建收藏夹" :visible.sync="showCreateDialog" width="400px">
        <el-form :model="newFolderForm" label-width="80px">
          <el-form-item label="收藏夹名称">
            <el-input v-model="newFolderForm.name" placeholder="请输入收藏夹名称" maxlength="20"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="createFolder">创建</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import {getMusicJson, getSongListInfo} from "../api/recommend";
  import {getRightStructure} from "../api/methods";

  export default {
    name: "Favorite",
    data() {
      return {
        currentTab: 'songs',
        showCreateDialog: false,
        newFolderForm: {
          name: ''
        },
        editingFolderId: null,
        editFolderName: ''
      }
    },
    computed: {
      favoriteSongs() {
        return this.$store.getters.FavoriteSongs;
      },
      favoriteSingers() {
        return this.$store.getters.FavoriteSingers;
      },
      favoritePlaylists() {
        return this.$store.getters.FavoritePlaylists;
      },
      userFolders() {
        return this.$store.getters.UserFolders;
      }
    },
    methods: {
      playSong(song) {
        getMusicJson(song.songmid)
          .then(res => {
            const domain = res.data.req.data.freeflowsip[0];
            const query = res.data.req_0.data.midurlinfo[0].purl;
            const url = domain + query;
            song.url = url;
            this.$store.dispatch('SetNowPlay', {song: song.name, singer: song.singer});
            this.$store.dispatch('AddSongToList', song);
            this.$router.push({name: 'player'});
          })
      },
      removeSong(songmid, songName) {
        this.$confirm(`确定要取消收藏歌曲"${songName}"吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('RemoveFavoriteSong', songmid);
          this.$message({
            type: 'success',
            message: '已取消收藏'
          });
        }).catch(() => {});
      },
      goToSinger(singerName) {
        this.$router.push({name: 'Singer', params: {sn: singerName}});
      },
      removeSinger(singerName) {
        this.$confirm(`确定要取消关注歌手"${singerName}"吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('RemoveFavoriteSinger', singerName);
          this.$message({
            type: 'success',
            message: '已取消关注'
          });
        }).catch(() => {});
      },
      playPlaylist(playlist) {
        let self = this;
        getSongListInfo(playlist.dissid).then(data => {
          let songlist = data.data.cdlist[0].songlist;
          let a = getRightStructure(songlist);
          self.$store.dispatch('EvalSongListForNew', a);
          this.$router.push({name: 'player'});
        })
      },
      removePlaylist(dissid, title) {
        this.$confirm(`确定要取消收藏歌单"${title}"吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('RemoveFavoritePlaylist', dissid);
          this.$message({
            type: 'success',
            message: '已取消收藏'
          });
        }).catch(() => {});
      },
      createFolder() {
        if (!this.newFolderForm.name.trim()) {
          this.$message.warning('请输入收藏夹名称');
          return;
        }
        this.$store.dispatch('CreateFolder', this.newFolderForm.name.trim());
        this.$message.success('收藏夹创建成功');
        this.showCreateDialog = false;
        this.newFolderForm.name = '';
      },
      startEdit(folderId, folderName) {
        this.editingFolderId = folderId;
        this.editFolderName = folderName;
      },
      saveFolderName(folderId) {
        if (!this.editFolderName.trim()) {
          this.$message.warning('收藏夹名称不能为空');
          return;
        }
        this.$store.dispatch('RenameFolder', {
          folderId: folderId,
          newName: this.editFolderName.trim()
        });
        this.editingFolderId = null;
        this.$message.success('修改成功');
      },
      isEditing(folderId) {
        return this.editingFolderId === folderId;
      },
      deleteFolder(folderId, folderName) {
        this.$confirm(`确定要删除收藏夹"${folderName}"吗？该操作不可恢复。`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('DeleteFolder', folderId);
          this.$message({
            type: 'success',
            message: '收藏夹已删除'
          });
        }).catch(() => {});
      },
      removeSongFromFolder(folderId, songmid) {
        this.$store.dispatch('RemoveSongFromFolder', {
          folderId: folderId,
          songmid: songmid
        });
        this.$message.success('已从收藏夹移除');
      },
      formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    },
    created() {
      document.title = "我的收藏 - Music-千万正版音乐海量无损曲库新歌热歌天天畅听的高品质音乐平台！";
    }
  }
</script>

<style scoped>
.favorite_main {
  padding: 40px 0;
  background-color: #fafafa;
  min-height: calc(100vh - 140px);
}

.favorite_content {
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  min-height: 600px;
}

.favorite_header {
  padding: 30px;
  border-bottom: 1px solid #e5e5e5;
}

.favorite_title {
  font-size: 24px;
  font-weight: 400;
  color: #000;
  margin-bottom: 20px;
}

.favorite_tabs {
  display: flex;
  gap: 30px;
}

.tab_item {
  font-size: 15px;
  color: #666;
  cursor: pointer;
  position: relative;
  padding-bottom: 10px;
  transition: color 0.3s;
}

.tab_item:hover {
  color: #31c27c;
}

.tab_item.tab_active {
  color: #31c27c;
}

.tab_item.tab_active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #31c27c;
}

.tab_count {
  color: #999;
  font-size: 13px;
  margin-left: 4px;
}

.favorite_body {
  padding: 20px 30px;
}

.empty_state {
  text-align: center;
  padding: 100px 0;
}

.empty_icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  background: url('../assets/images/icon_sprite.png') no-repeat -140px -180px;
  opacity: 0.5;
}

.empty_text {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.empty_hint {
  font-size: 14px;
  color: #999;
}

.song_list_head {
  display: flex;
  padding: 0 10px;
  height: 50px;
  line-height: 50px;
  background-color: #fbfbfd;
  color: #999;
  font-size: 14px;
}

.song_list_head li {
  text-align: left;
}

.song_list_head_index {
  width: 50px;
}

.song_list_head_name {
  width: 40%;
}

.song_list_head_singer {
  width: 20%;
}

.song_list_head_album {
  width: 20%;
}

.song_list_head_action {
  flex: 1;
  text-align: right;
}

.song_list_item {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.song_list_item:hover {
  background-color: #fafafa;
}

.song_list_col {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.song_list_index {
  width: 50px;
  color: #999;
}

.song_list_songname {
  width: 40%;
  display: flex;
  align-items: center;
  position: relative;
}

.song_list_songname_text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song_list_songname_text a {
  color: #000;
}

.song_list_songname_text a:hover {
  color: #31c27c;
}

.tool_nav_menu {
  position: absolute;
  right: 10px;
  display: none;
}

.song_list_item:hover .tool_nav_menu {
  display: flex;
}

.tool_menu_item {
  display: inline-block;
  margin-left: 5px;
}

.song_list_singername {
  width: 20%;
  color: #333;
}

.song_list_singername a,
.song_list_albumname a {
  color: #666;
}

.song_list_singername a:hover,
.song_list_albumname a:hover {
  color: #31c27c;
}

.song_list_albumname {
  width: 20%;
  color: #666;
}

.song_list_action {
  flex: 1;
  text-align: right;
}

.favorite_remove_icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-position: -60px -240px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.favorite_remove_icon:hover {
  opacity: 1;
}

.singer_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.singer_item {
  text-align: center;
  position: relative;
}

.singer_avatar {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.singer_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.singer_avatar:hover .singer_img {
  transform: scale(1.05);
}

.singer_hover_mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.singer_avatar:hover .singer_hover_mask {
  opacity: 1;
}

.play_icon_small {
  width: 40px;
  height: 40px;
  background-position: 0 -120px;
}

.singer_info {
  margin-bottom: 10px;
}

.singer_name {
  font-size: 14px;
  color: #000;
  margin-bottom: 5px;
}

.singer_name:hover {
  color: #31c27c;
}

.singer_fans {
  font-size: 12px;
  color: #999;
}

.remove_btn {
  display: inline-block;
  padding: 6px 20px;
  border: 1px solid #c9c9c9;
  border-radius: 2px;
  font-size: 13px;
  color: #000;
  cursor: pointer;
  transition: all 0.2s;
}

.remove_btn:hover {
  border-color: #31c27c;
  color: #31c27c;
}

.playlist_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.playlist_item {
  position: relative;
}

.playlist_cover {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 15px;
  overflow: hidden;
  cursor: pointer;
}

.playlist_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.playlist_cover:hover .playlist_img {
  transform: scale(1.05);
}

.playlist_hover_mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.playlist_cover:hover .playlist_hover_mask {
  opacity: 1;
}

.play_all_btn {
  width: 50px;
  height: 50px;
  background: rgba(49, 194, 124, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play_all_btn:hover {
  background: rgba(49, 194, 124, 1);
}

.playlist_info {
  margin-bottom: 10px;
}

.playlist_title {
  font-size: 14px;
  color: #000;
  margin-bottom: 5px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.playlist_title:hover {
  color: #31c27c;
}

.playlist_playcount {
  font-size: 12px;
  color: #999;
}

.folder_toolbar {
  margin-bottom: 20px;
}

.folder_list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.folder_item {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
}

.folder_header {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fbfbfd;
  border-bottom: 1px solid #f0f0f0;
}

.folder_icon {
  margin-right: 15px;
}

.folder_icon_img {
  width: 60px;
  height: 60px;
  background-position: 0 -240px;
}

.folder_info {
  flex: 1;
}

.folder_name {
  font-size: 16px;
  color: #000;
  margin-bottom: 5px;
}

.folder_name:hover {
  color: #31c27c;
}

.folder_songcount {
  font-size: 13px;
  color: #666;
  margin-bottom: 3px;
}

.folder_createtime {
  font-size: 12px;
  color: #999;
}

.folder_actions {
  display: flex;
  gap: 15px;
}

.action_btn {
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.action_btn:hover {
  color: #31c27c;
}

.folder_songs {
  padding: 10px 20px;
}

.view_all_btn {
  display: block;
  text-align: center;
  padding: 10px;
  color: #31c27c;
  font-size: 13px;
  cursor: pointer;
}

.view_all_btn:hover {
  text-decoration: underline;
}

.empty_folder {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>