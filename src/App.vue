<template>
  <div id="app" style="height:100%;">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus" @on-click-menu="tranClick"></actionsheet>
    </div>

    <!-- main content -->
    <view-box ref="viewBox" :body-padding-bottom="showTabbar ? '55px' : ''">

      <x-header
        v-if="isShowNav"
        slot="header"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;background-color:#fff;"
        :left-options="leftOptions"
        :right-options="rightOptions"
        :title="title"
        :transition="headerTransition"
        @on-click-more="showMenus = true">
        <span v-if="isShowBack" slot="overwrite-left" @click="drawerVisibility = !drawerVisibility">
        <!--
          <x-icon type="navicon" size="35" style="fill:#000;position:relative;top:-8px;left:-3px;"></x-icon>
        -->
        </span>
      </x-header>           

      <!-- remember to import BusPlugin in main.js if you use components: x-img and sticky -->
      <transition
      @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
      :name="viewTransition" :css="!!direction">
        <router-view class="router-view"></router-view>
      </transition>       
    </view-box>
    <div v-if="showTabbar">
      <tabbar>
        <tabbar-item link="/articlelist" :selected="route.path === '/articlelist'">
          <img slot="icon" src="./assets/icon/home.png">
          <img slot="icon-active" src="./assets/icon/home_sel.png">
          <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item link="/UserInfoAll" :selected="route.path === '/UserInfoAll'">
          <img slot="icon" src="./assets/icon/user.png">
          <img slot="icon-active" src="./assets/icon/user_sel.png">
          <span slot="label">用户信息</span>
        </tabbar-item>
        <tabbar-item link="/Analyse" :selected="route.path === '/Analyse'">
          <img slot="icon" src="./assets/icon/data.png">
          <img slot="icon-active" src="./assets/icon/data_sel.png">
          <span slot="label">数据统计</span>
        </tabbar-item>
        <tabbar-item link="/Home" :selected="selHome">
          <img slot="icon" src="./assets/icon/my.png">
          <img slot="icon-active" src="./assets/icon/my_sel.png">
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>    
    </div>
  </div>
</template>

<script>
import { Radio, Group, Cell, Badge, Drawer, Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDom } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
  directives: {
    TransferDom
  },
  components: {
    Radio,
    Group,
    Cell,
    Badge,
    Drawer,
    ButtonTab,
    ButtonTabItem,
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Loading,
    Actionsheet
  },
  name: 'app',
  mounted () {
    // this.checkLogin(this.route.path) // 检测登录
    document.title = '微文酷'
  },
  methods: {
    checkLogin (path) {
      document.title = '微文酷'
      if (/Login|Register|Forget|ServiceTerm|PayTerm/.test(path)) {
        return false
      } else {
        if (this.token.length <= 0) {
          this.$router.push('Login')
        }
      }
    },
    tranClick (key) {
      switch (key) {
        case 'edit_userinfo':
          console.log(this.menus[key])
          this.$router.push('/UserEdit')
          break
        case 'logout': // 退出登录
          this.removeToken()
          let data = {}
          this.$axios.post('/api/mobile.php?s=/public/logout', data)
          .then(res => {
            let data = res.data
            console.log(data)
            this.$router.push('/Login')
          })
          .catch(err => {
            console.log(err)
            console.log('request fail')
          })
          break
      }
    },
    tabbarSec () {
      let rt = this.route.path
      switch (rt) {
        case '/':
          return 3
        case '/Home':
          return 3
        case '/UserInfoAll':
          return 1
        case '/ShareArticle':
          return 2
        default:
          return 3
      }
    },
    ...mapActions([
      'updateDemoPosition',
      'removeToken'
    ])
  },
  watch: {
    path (path) {
      // this.checkLogin(path) // 检测登录
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      deviceready: state => state.app.deviceready,
      demoTop: state => state.vux.demoScrollTop,
      isLoading: state => state.vux.isLoading,
      direction: state => state.vux.direction,
      token: state => state.vux.token
    }),
    isShowBack () {      
      if (/Register|Forget|Login|UserEdit|articledetail|articleedit|articletpltext|articletplimg|articletplvideo|ServiceTerm|PayTerm|Pay|ShareArticle|Transaction|Envelope|Article|CommentDetail|Account/.test(this.route.path)) {
        return false
      }
      let re = new RegExp(/\/UserInfoAll\?aid=/)
      return !re.test(this.route.fullPath)
    },
    isShowNav () {
      if (this.entryUrl.indexOf('hide-nav') > -1) {
        return false
      }
      if (/Home|Analyse|articlelist/.test(this.route.path)) {
        return false
      }
      return true
    },
    leftOptions () {
      if (this.route.path === '/Login') {
        return {
          showBack: false
        }
      }
      return {
        showBack: this.route.path !== '/'
      }
    },
    rightOptions () {
      return {
        showMore: false
      }
      if (/Register|Forget|Login|ServiceTerm|PayTerm/.test(this.route.path)) {
        return {
          showMore: false
        }
      } else {
        return {
          showMore: true
        }
      }
    },
    headerTransition () {
      if (!this.direction) return ''
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    },
    componentName () {
      if (this.route.path) {
        const parts = this.route.path.split('/')
        return parts[1]
      }
    },
    title () {
      return this.route.name ? this.route.name : ''
    },
    selHome () {
      return !/Analyse|articlelist|UserInfoAll/.test(this.route.path)
    },
    viewTransition () {
      if (!this.direction) return ''
      return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
    },
    showTabbar () {
      if (/Login|Register|Forget|ServiceTerm|PayTerm|articleedit/.test(this.route.path)) {
        return false
      } else {
        return true
      }
    }
  },
  data () {
    return {
      entryUrl: document.location.href,
      showMenu: false,
      menus: {
        'edit_userinfo': '修改信息',
        'logout': '退出登录'
      },
      drawerVisibility: false,
      showMode: 'push',
      showModeValue: 'push',
      showPlacement: 'left',
      showPlacementValue: 'left',
      showMenus: false
    }
  }
}
</script>

<style lang="less" scope>
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';
@import '~vux/src/styles/close.less';
body {
  background-color: #fafafa;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
.demo-icon-22 {
  font-family: 'vux-demo';
  font-size: 22px;
  color: #888;
}
.weui-tabbar.vux-demo-tabbar {
  /** backdrop-filter: blur(10px);
  background-color: none;
  background: rgba(247, 247, 250, 0.5);**/
}
.vux-demo-tabbar .weui-bar__item_on .demo-icon-22 {
  color: #F70968;
}
.vux-demo-tabbar .weui-tabbar_item.weui-bar__item_on .vux-demo-tabbar-icon-home {
  color: rgb(53, 73, 94);
}
.demo-icon-22:before {
  content: attr(icon);
}
.vux-demo-tabbar-component {
  background-color: #F70968;
  color: #fff;
  border-radius: 7px;
  padding: 0 4px;
  line-height: 14px;
}
.weui-tabbar__icon + .weui-tabbar__label {
  margin-top: 0!important;
}
.vux-demo-header-box {
  z-index: 100;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}
@font-face {
  font-family: 'vux-demo';  /* project id 70323 */
  src: url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.eot');
  src: url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.woff') format('woff'),
  url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.svg#iconfont') format('svg');
}
.demo-icon {
  font-family: 'vux-demo';
  font-size: 20px;
  color: #04BE02;
}
.demo-icon-big {
  font-size: 28px;
}
.demo-icon:before {
  content: attr(icon);
}
.router-view {
  width: 100%;
  // top: 46px;
}
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.menu-title {
  color: #888;
}
.vux-drawer-content.drawer-left.vux-drawer-active {
  overflow-y: auto;
}
.vux-header .vux-header-title {
  color: #000 !important;
}
.vux-header .vux-header-left, .vux-header .vux-header-right {
  color: #000 !important;
}
.vux-header .vux-header-left a, .vux-header .vux-header-left button, .vux-header .vux-header-right a, .vux-header .vux-header-right button {
  color: #000 !important;
}
.vux-header .vux-header-left .left-arrow::before {
  border: 1px solid #000;
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #91a8f6 !important;
}

.m-drawer {
  .weui-cells__title {
    color: #BFD3FF;
  }
  .weui-cells {
    color: #BFD3FF;
    background-color: #4565ae;
  }
  .weui-cells::before, .weui-cell::before {
    border-top: 1px solid #BFD3FF;
    color: #BFD3FF;    
  }
  .weui-cell_access .weui-cell__ft::after {
    color: #BFD3FF;
  }
}
.vux-pop-out-enter-active, .vux-pop-out-leave-active, .vux-pop-in-enter-active, .vux-pop-in-leave-active {
  top: 0 !important;
}
</style>