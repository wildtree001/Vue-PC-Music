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
          <a class="white_btn p_btn" href="javascript:;" @click="toggleFavorite">
            <i class="music_icon icon_size" :class="{'follow_icon':isFavorite,'unfollow_icon':!isFavorite}"></i>{{isFavorite ? `已收藏${fans}` : `收藏${fans}`}}
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
        isFavorite(){
          return this.$store.getters.FavoriteSingers.some(s => s.id === this.Info.singer_inf.id);
        }
      },
      methods:{
        toggleFavorite(){
          if(this.isFavorite){
            this.$store.dispatch('RemoveFavoriteSinger', this.Info.singer_inf.id);
            this.$message({
              message:'已取消收藏',
              type:'success'
            });
          }else{
            this.$store.dispatch('AddFavoriteSinger', this.Info.singer_inf);
            this.$message({
              message:'收藏成功',
              type:'success'
            });
          }
        }
      }
    }
</script>

<style scoped>

</style>
