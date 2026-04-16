<template>
    <div class="history_main">
      <div class="history_head">
        <h2 class="history_title">搜索历史管理</h2>
        <div class="history_toolbar">
          <a href="javascript:;" 
             class="p_btn white_btn clear_all_btn" 
             v-if="searchHistory.length > 0"
             @click="handleClearAll">
            <i class="clear_all_icon music_icon"></i>清空所有
          </a>
        </div>
      </div>
      
      <div class="history_content">
        <div class="history_empty" v-if="searchHistory.length === 0">
          <i class="empty_icon music_icon"></i>
          <p class="empty_text">暂无搜索历史</p>
        </div>
        
        <div class="history_list" v-else>
          <div class="history_list_head">
            <span class="history_col_rank">排名</span>
            <span class="history_col_keyword">搜索内容</span>
            <span class="history_col_count">搜索次数</span>
            <span class="history_col_time">最后搜索</span>
            <span class="history_col_action">操作</span>
          </div>
          <div class="history_list_body">
            <div class="history_item" 
                 v-for="(item,index) of searchHistory" 
                 :key="item.keyword">
              <span class="history_col_rank">
                <span class="rank_num" :class="{'rank_top': index < 3}">{{index+1}}</span>
              </span>
              <span class="history_col_keyword">
                <a href="javascript:;" class="keyword_link" @click="searchKeyword(item.keyword)">{{item.keyword}}</a>
              </span>
              <span class="history_col_count">
                <span class="count_badge">{{item.count}}次</span>
              </span>
              <span class="history_col_time">{{formatTime(item.lastSearchTime)}}</span>
              <span class="history_col_action">
                <a href="javascript:;" class="action_delete" @click="handleDelete(item.keyword)">
                  <i class="delete_icon music_icon"></i>删除
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <el-dialog
        title="确认清空"
        :visible.sync="clearDialogVisible"
        width="400px"
        center>
        <div class="dialog_content">
          <i class="warning_icon music_icon"></i>
          <p>确定要清空所有搜索历史吗？此操作不可恢复。</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmClearAll">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import { getSearchHistorySortedByCount, removeSearchHistory, clearSearchHistory, addSearchHistory } from '../utils/searchHistory';
  
  export default {
    name: "SearchHistory",
    data(){
      return {
        searchHistory: [],
        clearDialogVisible: false
      }
    },
    methods:{
      loadHistory(){
        this.searchHistory = getSearchHistorySortedByCount();
      },
      formatTime(timestamp){
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
      },
      searchKeyword(keyword){
        addSearchHistory(keyword);
        this.$router.push({
          name: 'Search',
          query: { keyword: keyword }
        });
      },
      handleDelete(keyword){
        var self = this;
        this.$confirm('确定要删除该搜索历史吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          removeSearchHistory(keyword);
          self.loadHistory();
          self.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(function(){});
      },
      handleClearAll(){
        this.clearDialogVisible = true;
      },
      confirmClearAll(){
        clearSearchHistory();
        this.loadHistory();
        this.clearDialogVisible = false;
        this.$message({
          type: 'success',
          message: '已清空所有搜索历史!'
        });
      }
    },
    created() {
      this.loadHistory();
      document.title = "搜索历史管理 - Music";
    }
  }
</script>

<style>
.history_main{
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 40px;
}
.history_head{
  margin-bottom: 30px;
  overflow: hidden;
}
.history_title{
  font-size: 24px;
  font-weight: 400;
  float: left;
}
.history_toolbar{
  float: right;
}
.clear_all_btn{
  height: 38px;
  line-height: 38px;
  padding: 0 20px;
}
.clear_all_icon{
  width: 14px;
  height: 14px;
  background-position: -100px 0;
  display: inline-block;
  margin-right: 6px;
  vertical-align: -1px;
}

.history_content{
  min-height: 400px;
}

.history_empty{
  text-align: center;
  padding: 100px 0;
}
.empty_icon{
  width: 100px;
  height: 100px;
  background-position: -240px -200px;
  display: block;
  margin: 0 auto 20px;
  opacity: 0.5;
}
.empty_text{
  font-size: 16px;
  color: #999;
}

.history_list{
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.history_list_head{
  display: flex;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  background-color: #fbfbfb;
  border-bottom: 1px solid #f2f2f2;
  font-size: 14px;
  color: #999;
}
.history_list_body{
  border-bottom: 1px solid #f2f2f2;
}
.history_item{
  display: flex;
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #f2f2f2;
  font-size: 14px;
  transition: background-color 0.2s;
}
.history_item:last-child{
  border-bottom: none;
}
.history_item:hover{
  background-color: #fbfbfb;
}

.history_col_rank{
  width: 80px;
  flex-shrink: 0;
}
.rank_num{
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 4px;
  background-color: #f2f2f2;
  color: #999;
  font-size: 12px;
}
.rank_top{
  background-color: #31c27c;
  color: #fff;
}

.history_col_keyword{
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 20px;
}
.keyword_link{
  color: #333;
}
.keyword_link:hover{
  color: #31c27c;
}

.history_col_count{
  width: 120px;
  flex-shrink: 0;
}
.count_badge{
  display: inline-block;
  padding: 2px 10px;
  background-color: #e8f5e9;
  color: #31c27c;
  border-radius: 10px;
  font-size: 12px;
}

.history_col_time{
  width: 160px;
  flex-shrink: 0;
  color: #999;
}

.history_col_action{
  width: 100px;
  flex-shrink: 0;
}
.action_delete{
  color: #999;
  cursor: pointer;
}
.action_delete:hover{
  color: #ff4222;
}
.action_delete .delete_icon{
  width: 12px;
  height: 12px;
  background-position: -100px 0;
  display: inline-block;
  margin-right: 4px;
  vertical-align: 0;
}
.action_delete:hover .delete_icon{
  background-position: -20px -60px;
}

.dialog_content{
  text-align: center;
  padding: 20px 0;
}
.warning_icon{
  width: 48px;
  height: 48px;
  background-position: -200px 0;
  display: block;
  margin: 0 auto 16px;
}
.dialog_content p{
  font-size: 14px;
  color: #333;
}

@media (max-width: 1240px) {
  .history_main{
    min-width: 900px;
    margin: 0 50px;
  }
}
</style>
