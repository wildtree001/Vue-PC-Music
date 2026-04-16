<template>
    <div class="singer_info">
      <span class="singer_img_wrap">
        <img class="singer_big_img" :src="this.Info.singer_inf.photo1"/>
      </span>
      <div class="singer_introduce">
        <div class="singer_intro_name"><h1 class="singer_intro_h">{{this.Info.singer_inf.name}}</h1></div>
        <div class="singer_intro_main">
          <div class="singer_intro_main_des_text">
            {{this.Info.singer_inf.introduce}}
          </div>
        </div>
        <ul class="singer_static_list">
          <li class="singer_static_list_item" v-for="item of staticTab">
            <a href="javascript:;">
              <span>{{item.name}}</span>
              <strong class="singer_static_data_nums">{{item.nums}}</strong>
            </a>
          </li>
        </ul>
        <div class="singer_static_toolbar">
          <a class="green_btn p_btn" href="javascript:;"><i class="green_btn_icon music_icon icon_size"></i>播放歌手热门歌曲</a>
          <a class="white_btn p_btn" href="javascript:;" @click="toggleState">
            <i class="music_icon icon_size" :class="{'follow_icon':follow,'unfollow_icon':!follow}"></i>{{follow ? `已关注${fans}` : `关注${fans}`}}
          </a>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "SingerInfo",
      props:['Info'],
      data(){
        return {
          staticTab:[{name:"单曲",nums:this.Info.music_inf.songName.length}],
        }
      },
      computed:{
        fans(){
          let fans = this.Info.singer_inf.fans;
          return fans > 10000 ? Number(fans/10000).toFixed(1)+'万' : fans;
        },
        follow(){
          if(!this.Info || !this.Info.singer_inf || !this.Info.singer_inf.name) return false;
          return this.$store.getters.isSingerFavorite(this.Info.singer_inf.name);
        }
      },
      methods:{
        toggleState(){
          if(!this.Info || !this.Info.singer_inf) return;
          if(this.follow){
            this.$store.dispatch('RemoveFavoriteSinger', this.Info.singer_inf.name);
            this.$message.success('已取消关注');
          }else{
            this.$store.dispatch('AddFavoriteSinger', this.Info.singer_inf);
            this.$message.success('已关注');
          }
        }
      }
    }
</script>

<style scoped>

</style>
