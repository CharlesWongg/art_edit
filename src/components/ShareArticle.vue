<template>
  <div style="padding-top: 46px;">
    <swipeout class="m-article">
        <swipeout-item v-for="(item, i) in list" :key="i" transition-mode="follow" underlay-color="#fff" :auto-close-on-button-click="false" ref="swipeoutItem">
            <div slot="right-menu">
                <swipeout-button @click.native="userinfo(i)" background-color="#409EFF">用户信息</swipeout-button>
                <!--
                <swipeout-button @click.native="atlas(i)" background-color="#F56C6C">图谱</swipeout-button>
                -->
            </div>
            <div slot="content" class="demo-content vux-1px-tb">
                <panel type="4">
                    <div slot="body" class="art-item">
                        <a style="color: initial;" :href="item.art_url" class="item-header">                        
                            <span class="art-id vux-1px-r">文章ID：{{ item.id }}</span>
                            <span class="title">{{ item.title }}</span>                        
                        </a>
                        <div class="item-footer">
                            <span>平均访问：{{ item.meta.stop }}s</span>
                            <span>访问：{{ item.meta.uv }}</span>
                            <span>分享：{{ item.meta.zhuan }}</span>
                        </div>
                    </div>
                </panel>
            </div>
        </swipeout-item>
    </swipeout>  
    <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" style="margin-bottom: 50px;" v-if="!list.length && !isloading"></load-more>
    <load-more :show-loading="true" tip="加载中" background-color="#fbf9fe" style="margin-bottom: 50px;" v-if="isloading"></load-more>   
    <divider v-if="showEndLine && list.length">我是有底线的</divider>
  </div>
</template>

<script>
import { TransferDom, Swipeout, SwipeoutItem, SwipeoutButton, Panel, LoadMore, Confirm, Divider, Scroller, Spinner, Tab, TabItem, Popup, XInput, XButton, XTextarea, Badge, base64 } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
  directives: {
    TransferDom
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Panel,
    LoadMore,
    Confirm,
    Divider,
    Scroller,
    Spinner,
    Tab,
    TabItem,
    Popup,
    XInput,
    XButton,
    XTextarea,
    Badge
  },
  data () {
    return {
      isloading: false,
      showEndLine: false,
      list: [],
      page: 0
    }
  },
  computed: {
    ...mapState({
      token: state => state.vux.token
    })
  },
  mounted () {
    this.artData()
    window.addEventListener('scroll', this.loadMore, true)
  },
  methods: {
    ...mapActions([
      'removeToken'
    ]),
    // 文章列表
    artData () {
      let that = this
      let data = {
        page: this.page
      }

      // 到底
      if (this.showEndLine) {
        return false
      }

      this.isloading = true

      // 读缓存
      if (window.sessionStorage) {
        let saveKey = `shareArt_${that.page}`
        let listData = JSON.parse(window.sessionStorage.getItem(saveKey))
        if (listData && listData.data) {
          if (listData.data === null) {
            that.showEndLine = true
            that.isloading = false
            return false
          }
          that.page++
          listData.data.map((item, i) => {
            that.list.push({
              id: item.id,
              title: item.name,
              remark: item.remark,
              meta: {
                stop: item.stop,
                uv: item.uv,
                zhuan: item.zhuan
              },
              art_url: item.art_url
            })
          })
          that.isloading = false
          return false
        }
      }

      this.$axios.post('/api/mobile.php?s=/article/share', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) { // 修改成功
          that.page++
          if (data.data.list === null) {
            that.showEndLine = true
            that.isloading = false
            return false
          }

          data.data.list.map((item, i) => {
            that.list.push({
              id: item.id,
              title: item.name,
              remark: item.remark,
              meta: {
                stop: item.stop,
                uv: item.uv,
                zhuan: item.zhuan
              },
              art_url: item.art_url
            })
          })
          // 写入缓存
          if (window.sessionStorage) {
            let saveKey = `shareArt_${that.page - 1}`
            let saveVal = {
              data: data.data.list,
              expire: new Date().getTime() + (30 * 60 * 1000)
            }
            window.sessionStorage.setItem(saveKey, JSON.stringify(saveVal))
          }
        }
        that.isloading = false
      })
      .catch(err => {
        that.isloading = false
        console.log(err)
        console.log('request fail')
      })
    },
    // 启用
    enable (key, status) {
      let that = this
      let data = {
        id: [this.list[key].id],
        status: parseInt(status)
      }
      this.$axios.post('/api/mobile.php?s=/article/del', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) { // 修改成功
          that.$vux.toast.text(data.msg)
          that.list[key].status = status
          that.list[key].status_text = that.stateText[status]
          this.$refs.swipeoutItem[key].close()
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    // 用户信息
    userinfo (key) {
      let aid = this.list[key].id
      let url = `/UserInfoAll?aid=${aid}`
      this.$router.push(url)
    },
    // 图谱
    atlas (key) {
      let aid = this.list[key].id
      let url = `http://zf.lanseemy.com/mobile.php?s=/chart/coll_art/token/${this.token}/cid/${aid}/type/1`
      url = base64.encode(url)
      this.$router.push('/MapTree?u=' + url)
    },
    // 加载更多
    loadMore () {
      let clientHeight = document.getElementById('vux_view_box_body').clientHeight
      let scrollTop = document.getElementById('vux_view_box_body').scrollTop
      let scrollHeight = document.getElementById('vux_view_box_body').scrollHeight
      if (!this.isloading && (clientHeight + scrollTop >= scrollHeight)) {
        this.artData()
      }
    }
  },
  destroyed () {
    // 销毁Scroll事件
    window.removeEventListener('scroll', this.loadMore, true)
  }
}
</script>

<style lang="less" scope>
@import '../styles/reset.less';
@import '../styles/1px.less';
@import '../styles/article.less';
</style>
