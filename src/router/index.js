import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Singerlist from '../components/Singerlist'
import Singer from '../components/SingerIndex'
import player from '../components/player'
import Playlist from '../components/Playlist'
import trp from '../components/trp'
import Favorite from '../components/Favorite'

Vue.use(Router)

export default new Router({
  routes:[
    {
      path:'/',
      name:'Home',
      components:{
        default:Home
      }
    },
    {
      path:'/singerlist',
      name:'Singerlist',
      components:{
        default:Singerlist
      }
    },
    {
      path:'/playlist',
      name:'Playlist',
      component:Playlist
    },
    {
      path:'/singer/:sn',
      name:"Singer",
      component:Singer
    },
    {
      path:'/singer',
      component:Singer
    },
    {
      path:'/player',
      name:"player",
      component:player
    },
    {
      path:'/trp',
      name:'trp',
      component:trp
    },
    {
      path:'/favorite',
      name:'Favorite',
      component:Favorite
    }
  ]
})
