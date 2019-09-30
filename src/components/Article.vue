<template>
  <div style="padding-top: 46px;">
    <swipeout class="m-article">
        <swipeout-item v-for="(item, i) in list" :key="i" transition-mode="follow" underlay-color="#fff" :auto-close-on-button-click="false" ref="swipeoutItem">
            <div slot="right-menu">
                <swipeout-button @click.native="toEdit(item.id)" background-color="#09bb07">编辑</swipeout-button>
                <swipeout-button @click.native="enable(i, 1)" background-color="#409EFF" v-if="item.status == 2">启用</swipeout-button>
                <swipeout-button @click.native="enable(i, 2)" background-color="#F56C6C" v-if="item.status == 1">禁用</swipeout-button>
                <swipeout-button @click.native="remark(i)" background-color="#E6A23C">备注</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-tb">
                <panel type="4">
                    <div slot="body" class="art-item">
                        <a style="color: initial;" :href="item.status !== 1 ? 'javascript:;' : item.art_url" class="item-header">
                            <span class="art-id vux-1px-r">文章ID：{{ item.id }}</span>
                            <span class="title" :class="{'unable':item.status !== 1}">{{ item.title }}</span>
                            <badge :text="item.status_text" :class="stateStyle[item.status]"></badge>
                            <span class="reason" v-if="item.status === 4">原因：{{ item.remark }}</span>
                            <span class="reason" style="color: #F70968;" v-if="item.meta.mark">备注：{{ item.meta.mark }}</span>
                        </a>                     
                        <div class="item-footer">
                            <span>总金额：&yen;{{ item.meta.amount }}</span>
                            <span>已领取：&yen;{{ item.meta.get }}</span>
                            <span>{{ item.meta.date }}</span>
                        </div>
                        <x-icon type="ios-arrow-left" class="icon-arrow-left" size="16"></x-icon>
                    </div>
                </panel>
            </div>
        </swipeout-item>
    </swipeout>  
    <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-if="!list.length && !isloading"></load-more>
    <load-more :show-loading="true" tip="加载中" background-color="#fbf9fe" v-if="isloading"></load-more>   
    <divider v-if="showEndLine && list.length">我是有底线的</divider>

    <confirm v-model="confirmShow"
    show-input
    ref="confirmMark"
    title="编辑备注"
    @on-confirm="onConfirmMark"
    @on-show="confOnShow"
    @on-hide="confOnHide">
    </confirm>    
  </div>
</template>

<script>
import { TransferDom, Swipeout, SwipeoutItem, SwipeoutButton, Panel, LoadMore, Confirm, Divider, Scroller, Spinner, Tab, TabItem, Popup, XInput, XButton, XTextarea, Badge } from 'vux'
import { mapActions } from 'vuex'

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
      confirmShow: false,
      stateStyle: {
        1: 'badge-enable',
        2: '',
        3: 'badge-check',
        4: 'badge-uncheck'
      },
      stateText: {
        1: '启用',
        2: '禁用',
        3: '审核中',
        4: '审核不通过'
      },
      list: [],
      page: 0,
      selKey: ''
    }
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
        let saveKey = `artList_${that.page}`
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
              status: parseInt(item.status),
              status_text: item.status_text,
              remark: item.remark,
              art_url: item.art_url,
              meta: {
                amount: item.max_money,
                get: item.surplus_money,
                date: item.input_time.split(' ')[0],
                mark: item.mark
              },
              page: that.page - 1
            })
          })
          that.isloading = false
          return false
        }
      }

      this.$axios.post('/api/mobile.php?s=/article/index', data)
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
              status: parseInt(item.status),
              status_text: item.status_text,
              remark: item.remark,
              art_url: item.art_url,
              meta: {
                amount: item.max_money,
                get: item.surplus_money,
                date: item.input_time.split(' ')[0],
                mark: item.mark
              },
              page: that.page - 1
            })
          })
          // 写入缓存
          if (window.sessionStorage) {
            let saveKey = `artList_${that.page - 1}`
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
      let page = this.list[key].page
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

          // 更新缓存
          let saveKey = `artList_${page}`
          let listData = JSON.parse(window.sessionStorage.getItem(saveKey))
          listData.data.map(function (item, i) {
            if (parseInt(item.id) === parseInt(that.list[key].id)) {
              listData.data[i].status = status
              listData.data[i].status_text = that.stateText[status]
              let saveVal = listData
              window.sessionStorage.setItem(saveKey, JSON.stringify(saveVal))
            }
          })
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    formatRemark (val) {
      let v = val || '无'
      return `${v}`
    },
    // 备注
    remark (key) {
      this.selKey = key
      this.confirmShow = true
    },
    confOnShow () {
      let re = new RegExp(/备注：/)
      let val = this.list[this.selKey].meta.mark || ''
      val = re.test(val) ? '' : val

      if (val.length > 0) {
        val = val.substr(3, val.length)
      }
      this.$refs.confirmMark.setInputValue(val)
    },
    onConfirmMark (val) {
      val = val || ''
      let pval = val

      let that = this
      let page = this.list[that.selKey].page
      let data = {
        id: that.list[that.selKey].id,
        remark: pval
      }
      this.$axios.post('/api/mobile.php?s=/Article/remark', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) { // 修改成功
          that.$set(that.list[that.selKey].meta, 'mark', `${val}`)
          that.$vux.toast.text(data.msg)

          // 更新缓存
          let saveKey = `artList_${page}`
          let listData = JSON.parse(window.sessionStorage.getItem(saveKey))
          listData.data.map(function (item, i) {
            if (parseInt(item.id) === parseInt(that.list[that.selKey].id)) {
              listData.data[i].mark = val
              let saveVal = listData
              window.sessionStorage.setItem(saveKey, JSON.stringify(saveVal))
            }
          })
        } else if (data.code === 0) { // 修改失败
          that.$vux.toast.show({
            text: data.msg,
            type: 'warn'
          })
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    confOnHide () {
      this.$refs.swipeoutItem[this.selKey].close()
    },
    // 加载更多
    loadMore () {
      let clientHeight = document.getElementById('vux_view_box_body').clientHeight
      let scrollTop = document.getElementById('vux_view_box_body').scrollTop
      let scrollHeight = document.getElementById('vux_view_box_body').scrollHeight
      if (!this.isloading && (clientHeight + scrollTop >= scrollHeight)) {
        this.artData()
      }
    },
    jump (url) {
      console.log(url)
      window.location.href = url
    },
    // 编辑文章
    toEdit (id) {
      this.$router.push('/articleedit?id=' + id + '&from=artList')
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
.art-item {
  position: relative;
}
.icon-arrow-left {
  color: #999;
  position: absolute;
  top: 45%;
  right: 0;
}
</style>
