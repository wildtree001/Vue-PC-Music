<template>
    <div class="main favorite_main">
      <div class="favorite_header">
        <h2 class="favorite_title">我的收藏</h2>
        <div class="favorite_toolbar">
          <el-button type="primary" size="small" @click="showCreateFolderDialog">
            <i class="el-icon-plus"></i> 新建收藏夹
          </el-button>
        </div>
      </div>
      
      <div class="favorite_tabs">
        <div class="tab_item" :class="{'tab_active': currentTab === 'songs'}" @click="currentTab = 'songs'">
          收藏的歌曲 <span class="tab_count">({{ favoriteSongs.length }})</span>
        </div>
        <div class="tab_item" :class="{'tab_active': currentTab === 'singers'}" @click="currentTab = 'singers'">
          收藏的歌手 <span class="tab_count">({{ favoriteSingers.length }})</span>
        </div>
        <div class="tab_item" :class="{'tab_active': currentTab === 'playlists'}" @click="currentTab = 'playlists'">
          收藏的歌单 <span class="tab_count">({{ favoritePlaylists.length }})</span>
        </div>
        <div class="tab_item" :class="{'tab_active': currentTab === 'folders'}" @click="currentTab = 'folders'">
          我的收藏夹 <span class="tab_count">({{ favoriteFolders.length }})</span>
        </div>
      </div>

      <div class="favorite_content">
        <div v-if="currentTab === 'songs'" class="songs_list">
          <div v-if="favoriteSongs.length === 0" class="empty_state">
            <div class="empty_icon">🎵</div>
            <div class="empty_text">暂无收藏的歌曲</div>
            <div class="empty_hint">去发现喜欢的歌曲吧</div>
          </div>
          <div v-else class="song_table">
            <div class="song_table_header">
              <div class="song_col_index"></div>
              <div class="song_col_name">歌曲</div>
              <div class="song_col_singer">歌手</div>
              <div class="song_col_album">专辑</div>
              <div class="song_col_action">操作</div>
            </div>
            <div class="song_table_body">
              <div class="song_row" v-for="(song, index) in favoriteSongs" :key="song.songmid">
                <div class="song_col_index">{{ index + 1 }}</div>
                <div class="song_col_name">
                  <div class="song_name_wrap">
                    <span class="song_name">{{ song.name }}</span>
                    <div class="song_menu">
                      <a title="播放" href="javascript:;" @click="playSong(song, index)">
                        <i class="song_menu_icon player_icon"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="song_col_singer">{{ song.singer }}</div>
                <div class="song_col_album">{{ song.album }}</div>
                <div class="song_col_action">
                  <el-button type="text" size="small" @click="removeFavoriteSong(song)">
                    取消收藏
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentTab === 'singers'" class="singers_list">
          <div v-if="favoriteSingers.length === 0" class="empty_state">
            <div class="empty_icon">🎤</div>
            <div class="empty_text">暂无收藏的歌手</div>
            <div class="empty_hint">去关注喜欢的歌手吧</div>
          </div>
          <div v-else class="singers_grid">
            <div class="singer_card" v-for="singer in favoriteSingers" :key="singer.id">
              <div class="singer_avatar_wrap">
                <img :src="singer.photo" class="singer_avatar" :alt="singer.name"/>
                <div class="singer_cover"></div>
              </div>
              <div class="singer_info">
                <div class="singer_name">{{ singer.name }}</div>
                <div class="singer_fans">粉丝: {{ singer.fans }}</div>
              </div>
              <div class="singer_action">
                <el-button type="text" size="small" @click="removeFavoriteSinger(singer)">
                  取消收藏
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentTab === 'playlists'" class="playlists_list">
          <div v-if="favoritePlaylists.length === 0" class="empty_state">
            <div class="empty_icon">📋</div>
            <div class="empty_text">暂无收藏的歌单</div>
            <div class="empty_hint">去发现喜欢的歌单吧</div>
          </div>
          <div v-else class="playlists_grid">
            <div class="playlist_card" v-for="playlist in favoritePlaylists" :key="playlist.dissid">
              <div class="playlist_cover_wrap" @click="playPlaylist(playlist)">
                <img :src="playlist.imgPath" class="playlist_cover" :alt="playlist.title"/>
                <div class="playlist_cover_mask"></div>
                <i class="music_play_btn hot_play_btn"></i>
              </div>
              <div class="playlist_info">
                <div class="playlist_title">{{ playlist.title }}</div>
                <div class="playlist_num">播放量: {{ playlist.number }}</div>
              </div>
              <div class="playlist_action">
                <el-button type="text" size="small" @click="removeFavoritePlaylist(playlist)">
                  取消收藏
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentTab === 'folders'" class="folders_list">
          <div class="folders_grid">
            <div class="folder_card" v-for="folder in favoriteFolders" :key="folder.id">
              <div class="folder_icon_wrap">
                <div class="folder_icon">📁</div>
              </div>
              <div class="folder_info">
                <div class="folder_name">{{ folder.name }}</div>
                <div class="folder_count">
                  歌曲: {{ folder.songs.length }} | 歌手: {{ folder.singers.length }} | 歌单: {{ folder.playlists.length }}
                </div>
              </div>
              <div class="folder_action">
                <el-button type="text" size="small" @click="editFolder(folder)">
                  编辑
                </el-button>
                <el-button type="text" size="small" @click="deleteFolder(folder)" v-if="folder.id !== 1">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-dialog title="新建收藏夹" :visible.sync="createFolderVisible" width="400px">
        <el-form :model="newFolderForm" label-width="80px">
          <el-form-item label="收藏夹名称">
            <el-input v-model="newFolderForm.name" placeholder="请输入收藏夹名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createFolderVisible = false">取 消</el-button>
          <el-button type="primary" @click="createFolder">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="编辑收藏夹" :visible.sync="editFolderVisible" width="400px">
        <el-form :model="editFolderForm" label-width="80px">
          <el-form-item label="收藏夹名称">
            <el-input v-model="editFolderForm.name" placeholder="请输入收藏夹名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editFolderVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateFolder">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { getSongListInfo } from '../api/recommend'
import { getRightStructure } from '../api/methods'

export default {
  name: 'Favorite',
  data() {
    return {
      currentTab: 'songs',
      createFolderVisible: false,
      editFolderVisible: false,
      newFolderForm: {
        name: ''
      },
      editFolderForm: {
        id: null,
        name: ''
      }
    }
  },
  computed: {
    favoriteSongs() {
      return this.$store.getters.FavoriteSongs
    },
    favoriteSingers() {
      return this.$store.getters.FavoriteSingers
    },
    favoritePlaylists() {
      return this.$store.getters.FavoritePlaylists
    },
    favoriteFolders() {
      return this.$store.getters.FavoriteFolders
    }
  },
  methods: {
    showCreateFolderDialog() {
      this.newFolderForm.name = ''
      this.createFolderVisible = true
    },
    createFolder() {
      if (!this.newFolderForm.name.trim()) {
        this.$message({
          message: '请输入收藏夹名称',
          type: 'warning'
        })
        return
      }
      this.$store.dispatch('AddFavoriteFolder', { name: this.newFolderForm.name })
      this.$message({
        message: '收藏夹创建成功',
        type: 'success'
      })
      this.createFolderVisible = false
    },
    editFolder(folder) {
      this.editFolderForm = {
        id: folder.id,
        name: folder.name
      }
      this.editFolderVisible = true
    },
    updateFolder() {
      if (!this.editFolderForm.name.trim()) {
        this.$message({
          message: '请输入收藏夹名称',
          type: 'warning'
        })
        return
      }
      this.$store.dispatch('UpdateFavoriteFolder', {
        folderId: this.editFolderForm.id,
        name: this.editFolderForm.name
      })
      this.$message({
        message: '收藏夹更新成功',
        type: 'success'
      })
      this.editFolderVisible = false
    },
    deleteFolder(folder) {
      this.$MessageBox.confirm('确定要删除该收藏夹吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('RemoveFavoriteFolder', folder.id)
        this.$message({
          message: '收藏夹删除成功',
          type: 'success'
        })
      }).catch(() => {})
    },
    playSong(song, index) {
      if (song.singer === '周杰伦') {
        this.$message({
          type: 'info',
          message: '很遗憾！周董的歌无法获取到播放源地址，换一首试试 ┑(￣Д ￣)┍',
          duration: 4000
        })
        return
      }
      this.$store.dispatch('EvalSongListForNew', this.favoriteSongs)
      this.$router.push({ name: 'player' })
    },
    removeFavoriteSong(song) {
      this.$MessageBox.confirm('确定要取消收藏该歌曲吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('RemoveFavoriteSong', song.songmid)
        this.$message({
          message: '已取消收藏',
          type: 'success'
        })
      }).catch(() => {})
    },
    removeFavoriteSinger(singer) {
      this.$MessageBox.confirm('确定要取消收藏该歌手吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('RemoveFavoriteSinger', singer.id)
        this.$message({
          message: '已取消收藏',
          type: 'success'
        })
      }).catch(() => {})
    },
    removeFavoritePlaylist(playlist) {
      this.$MessageBox.confirm('确定要取消收藏该歌单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('RemoveFavoritePlaylist', playlist.dissid)
        this.$message({
          message: '已取消收藏',
          type: 'success'
        })
      }).catch(() => {})
    },
    playPlaylist(playlist) {
      let self = this
      getSongListInfo(playlist.dissid).then(data => {
        let songlist = data.data.cdlist[0].songlist
        let a = getRightStructure(songlist)
        self.$store.dispatch('EvalSongListForNew', a)
        this.$router.push({ name: 'player' })
      })
    }
  },
  created() {
    document.title = '我的收藏 - Music-千万正版音乐海量无损曲库新歌热歌天天畅听的高品质音乐平台！'
  }
}
</script>

<style scoped>
.favorite_main {
  padding: 30px 0;
}

.favorite_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.favorite_title {
  font-size: 24px;
  font-weight: 400;
  color: #333;
}

.favorite_tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid #f2f2f2;
}

.tab_item {
  padding: 0 30px 15px;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  position: relative;
}

.tab_item:hover {
  color: #31c27c;
}

.tab_active {
  color: #31c27c;
}

.tab_active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #31c27c;
}

.tab_count {
  color: #999;
  font-size: 12px;
}

.favorite_content {
  min-height: 400px;
}

.empty_state {
  text-align: center;
  padding: 100px 0;
}

.empty_icon {
  font-size: 80px;
  margin-bottom: 20px;
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

.song_table {
  width: 100%;
}

.song_table_header {
  display: flex;
  background-color: #fbfbfb;
  padding: 12px 0;
  color: #999;
  font-size: 14px;
}

.song_col_index {
  width: 50px;
  text-align: center;
}

.song_col_name {
  flex: 2;
  padding-left: 20px;
}

.song_col_singer {
  flex: 1;
}

.song_col_album {
  flex: 1;
}

.song_col_action {
  width: 100px;
  text-align: center;
}

.song_table_body {
  width: 100%;
}

.song_row {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f2f2f2;
  font-size: 14px;
}

.song_row:hover {
  background-color: #fbfbfb;
}

.song_name_wrap {
  position: relative;
}

.song_name {
  color: #333;
  cursor: pointer;
}

.song_name:hover {
  color: #31c27c;
}

.song_menu {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: none;
}

.song_row:hover .song_menu {
  display: block;
}

.singers_grid {
  display: flex;
  flex-wrap: wrap;
  margin-right: -20px;
}

.singer_card {
  width: 20%;
  padding-right: 20px;
  margin-bottom: 30px;
  box-sizing: border-box;
}

.singer_avatar_wrap {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 50%;
  margin-bottom: 15px;
}

.singer_avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.singer_cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0;
  transition: opacity 0.3s;
}

.singer_avatar_wrap:hover .singer_cover {
  opacity: 0.2;
}

.singer_info {
  text-align: center;
}

.singer_name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  cursor: pointer;
}

.singer_name:hover {
  color: #31c27c;
}

.singer_fans {
  font-size: 12px;
  color: #999;
}

.singer_action {
  text-align: center;
  margin-top: 10px;
}

.playlists_grid {
  display: flex;
  flex-wrap: wrap;
  margin-right: -20px;
}

.playlist_card {
  width: 20%;
  padding-right: 20px;
  margin-bottom: 30px;
  box-sizing: border-box;
}

.playlist_cover_wrap {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
  margin-bottom: 15px;
  cursor: pointer;
}

.playlist_cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.75s;
}

.playlist_cover_wrap:hover .playlist_cover {
  transform: scale(1.07);
}

.playlist_cover_mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0;
  transition: opacity 0.5s;
}

.playlist_cover_wrap:hover .playlist_cover_mask {
  opacity: 0.2;
}

.playlist_cover_wrap:hover .music_play_btn {
  opacity: 0.9;
  transform: scale(1);
}

.playlist_info {
  text-align: left;
}

.playlist_title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.playlist_title:hover {
  color: #31c27c;
}

.playlist_num {
  font-size: 12px;
  color: #999;
}

.playlist_action {
  margin-top: 10px;
}

.folders_grid {
  display: flex;
  flex-wrap: wrap;
  margin-right: -20px;
}

.folder_card {
  width: 25%;
  padding-right: 20px;
  margin-bottom: 30px;
  box-sizing: border-box;
}

.folder_icon_wrap {
  background-color: #fbfbfb;
  padding: 40px 0;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.folder_icon_wrap:hover {
  background-color: #f2f2f2;
}

.folder_icon {
  font-size: 60px;
}

.folder_info {
  text-align: left;
}

.folder_name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  cursor: pointer;
}

.folder_name:hover {
  color: #31c27c;
}

.folder_count {
  font-size: 12px;
  color: #999;
}

.folder_action {
  margin-top: 10px;
}

@media (max-width: 1240px) {
  .singer_card,
  .playlist_card {
    width: 25%;
  }
  
  .folder_card {
    width: 33.33%;
  }
}
</style>
