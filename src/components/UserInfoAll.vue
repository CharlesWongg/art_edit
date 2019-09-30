<template>
  <div style="padding-top: 46px;">    
    <tab active-color="#91a8f6" bar-active-color="#91a8f6">
      <tab-item selected @on-item-click="onItemClick">默认</tab-item>
      <tab-item @on-item-click="onItemClick">转发</tab-item>
      <tab-item @on-item-click="onItemClick">停留</tab-item>
      <tab-item @on-item-click="onItemClick">筛选</tab-item>
    </tab>  
    <swipeout class="userinfo">
        <swipeout-item v-for="(item, i) in list" :key="i" transition-mode="follow" underlay-color="#fff" :auto-close-on-button-click="false" ref="swipeoutItem">
            <div slot="right-menu">
                <swipeout-button @click.native="mark(i)" background-color="#409EFF">编辑备注</swipeout-button>
                <swipeout-button @click.native="redPackage(i)" background-color="#F56C6C">发红包</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-tb">
            <panel :list="item" type="5"></panel>
            </div>
        </swipeout-item>
        <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-if="!list.length && !isloading"></load-more>
        <load-more :show-loading="true" tip="加载中" background-color="#fbf9fe" v-if="isloading"></load-more>   
        <divider v-if="showEndLine && list.length">我是有底线的</divider>
    </swipeout>


    <confirm v-model="confirmShow"
    show-input
    ref="confirmMark"
    title="编辑备注"
    @on-confirm="onConfirmMark"
    @on-show="confOnShow"
    @on-hide="confOnHide">
    </confirm>  

    <!-- 筛选、搜索 -->
    <div v-transfer-dom>
      <popup v-model="filterPop" @on-hide="filterEve('hide')" height="100%" @on-show="filterEve('show')" style="background-color: #fff;">
        <div>
          <group title="用户搜索">
            <selector ref="filterSel" title="条件" :options="selList" v-model="filterMethod"></selector>          
            <x-input key="uid" v-if="filterMethod === 'uid'" label-width="6em" title="UID:" :clickFocus="true" placeholder="请填写UID" v-model="filterOpt.uid" :show-clear="true" placeholder-align="right"></x-input>
            <x-input key="nickname" v-if="filterMethod === 'nickname'" label-width="6em" title="昵称:" :clickFocus="true" placeholder="请填写昵称" v-model="filterOpt.nickname" :show-clear="true" placeholder-align="right"></x-input>
            <x-input key="remark" v-if="filterMethod === 'remark'" label-width="6em" title="备注:" :clickFocus="true" placeholder="请填写备注" v-model="filterOpt.remark" :show-clear="true" placeholder-align="right"></x-input>
          </group>
        </div>
        <div class="pop-footer">
            <x-button @click.native="search" type="primary">搜索</x-button>
            <x-button @click.native="filterPop = false" type="default">关闭</x-button>
        </div>
      </popup>
    </div>

    <!-- 红包 -->
    <div v-transfer-dom>
      <popup v-model="rpkPop" position="bottom" height="100%">
        <group :title="`账户余额：${balance/100}元`" class="rpk-item">
            <x-input label-width="6em" :clickFocus="true" title="红包金额" @on-blur="rpkMoneyBlur" :debounce="200" novalidate placeholder="请填写金额" v-model.number="rpkOpt.money" :show-clear="false" placeholder-align="right" text-align="right">
                <span slot="right" style="margin-left: 10px;">元</span>
            </x-input>
        </group>      
        <group class="rpk-item">
            <x-input label-width="6em" :clickFocus="true" title="红包发布人" placeholder="" v-model="rpkOpt.from" :show-clear="true" placeholder-align="right"></x-input>
        </group>
        <group class="rpk-item">
            <x-textarea :max="40" placeholder="请填写红包描述语" v-model="rpkOpt.desc"></x-textarea>
        </group>
        
        <div style="padding: 15px;" class="rpk-footer">
          <span class="money">&yen;{{ rpkOpt.money||0 }}</span>
          <div style="width: 175px; margin: 0 auto;">
            <x-button @click.native="sendRpk" type="primary" :show-loading="rpkLoading">立即发红包</x-button>
            <x-button @click.native="rpkPop = false" type="default">取消</x-button>
          </div>
          <span class="tips">24小时内未领取，红包将返回你的余额</span>
        </div>        
        <x-icon type="ios-close-empty" class="rpk-close" size="25" @click.native="rpkPop = false"></x-icon>
      </popup>
    </div>

  </div>
</template>

<script>
import { Tab, TabItem, TransferDom, Swipeout, SwipeoutItem, SwipeoutButton, Panel, LoadMore, Confirm, Divider, Scroller, Spinner, Popup, XInput, XButton, XTextarea, Selector } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Panel,
    LoadMore,
    Confirm,
    Divider,
    Scroller,
    Spinner,
    Popup,
    XInput,
    XButton,
    XTextarea,
    Selector
  },
  data () {
    return {
      isloading: false,
      showEndLine: false,
      confirmShow: false,
      rpkPop: false,
      selKey: '',
      filterPop: false,
      loadMoreOption: {
        isMore: true,
        len: 10
      },
      filterOpt: {
        uid: '',
        nickname: ''
      },
      rpkOpt: {
        money: '',
        from: '',
        desc: ''
      },
      list: [],
      page: 0,
      rpkLoading: false,
      balance: 0,
      onItemIdx: 0,
      selList: [{key: 'uid', value: 'UID'}, {key: 'nickname', value: '昵称'}, {key: 'remark', value: '备注'}],
      filterMethod: 'uid'
    }
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      route: state => state.route,
      fullPath: state => state.route.fullPath
    })
  },
  watch: {
    fullPath (fullPath) {
      this.onItemIdx = 0
      this.showEndLine = false
      this.page = 0 // 重置页数
      this.resetTab()
      this.userInfoData()
    }
  },
  mounted () {
    this.userInfoData()
    window.addEventListener('scroll', this.loadMore, true)
    // document.getElementById('vux_view_box_body').addEventListener('scroll', this.loadMore, true)
  },
  methods: {
    ...mapActions([
      'removeToken'
    ]),
    userInfoData () {
      let query = this.$route.query
      let that = this
      let data = {
        page: this.page
      }

      // 到底
      if (this.showEndLine) {
        return false
      }

      this.isloading = true

      // 筛选条件
      if (this.filterOpt && this.filterOpt[this.filterMethod]) {
        data[this.filterMethod] = this.filterOpt[this.filterMethod]
      }

      let url
      if (query && query.aid) {
        url = '/api/mobile.php?s=/user_info/index' // 根据文章搜索用户信息
        data.cid = query.aid
      } else {
        url = '/api/mobile.php?s=/user_info/my_list'  // 总用户信息
      }

      // 非筛选的内容读缓存
      if ((this.onItemIdx === 0) && window.sessionStorage) {
        let saveKey
        if (query && query.aid) {
          saveKey = this.createSaveKey(query.aid, that.page) // 根据文章ID显示用户信息
        } else {
          saveKey = this.createSaveKey(false, that.page) // 总用户信息
        }
        let data = JSON.parse(window.sessionStorage.getItem(saveKey))
        if (data) {
          that.page++
          data.data.map((item, i) => {
            that.list.push([
              {
                uid: item.uid,
                src: item.headimgurl,
                title: item.nickname,
                desc: `总转发：${item.zhuan}次` + '&nbsp;'.repeat(4) + `停留时间：${item.stop}s`,
                url: '',
                meta: {
                  source: that.formatID(item.uid),
                  date: that.formatGender(item.sex),
                  other: that.formatRemark(item.remark)
                }
              }
            ])
          })
          that.isloading = false
          return false
        }
      }

      this.$axios.post(url, data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.page++
          if (data.data.list === null) {
            that.showEndLine = true
            that.isloading = false
            return false
          }

          data.data.list.map((item, i) => {
            that.list.push([
              {
                uid: item.uid,
                src: item.headimgurl,
                title: item.nickname,
                desc: `总转发：${item.zhuan}次` + '&nbsp;'.repeat(4) + `停留时间：${item.stop}s`,
                url: '',
                meta: {
                  source: that.formatID(item.uid),
                  date: that.formatGender(item.sex),
                  other: that.formatRemark(item.remark)
                }
              }
            ])
          })

          // 写入缓存
          if ((this.onItemIdx === 0) && window.sessionStorage) {
            let saveKey
            if (query && query.aid) {
              saveKey = that.createSaveKey(query.aid, that.page - 1) // 根据文章ID显示用户信息
            } else {
              saveKey = that.createSaveKey(false, that.page - 1) // 总用户信息
            }
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
        console.log(err.status)
        console.log(err.statusText)
        console.log('request fail')
      })
    },
    createSaveKey (cid, page, range = false) {
      let type
      if (cid) {
        type = `art_${cid}` // 根据文章ID显示用户信息
      } else {
        type = 'all' // 总用户信息
      }
      if (range) {
        return `user_range_${type}_${page}`
      }
      return `user_${type}_${page}`
    },
    // 格式化ID
    formatID (val) {
      return `UID：${val}`
    },
    // 格式化性别
    formatGender (val) {
      let v
      switch (parseInt(val)) {
        case 0:
          v = '女'
          break
        case 1:
          v = '男'
          break
        default:
          v = '未知'
          break
      }
      return `性别：${v}`
    },
    formatRemark (val) {
      let v = val || '无'
      return `备注：${v}`
    },
    redPackage (key) {
      this.selKey = key
      this.rpkPop = true

      // 获取账户余额
      let that = this
      this.$axios.post('/api/mobile.php?s=/index/get_balance', {})
      .then(res => {
        let data = res.data
        if (data.code === 1) { // 修改成功
          that.balance = data.data.balance
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    // 编辑备注
    mark (key) {
      this.selKey = key
      this.confirmShow = true
    //   this.$refs.swipeoutItem[key].close()
    },
    confOnShow () {
      let re = new RegExp(/备注：暂无备注/)
      let val = this.list[this.selKey][0].meta.other
      val = re.test(val) ? '' : val

      if (val.length > 0) {
        val = val.substr(3, val.length)
      }
      this.$refs.confirmMark.setInputValue(val)
    },
    onConfirmMark (val) {
      val = val || '无'
      let pval = val

      let that = this
      let data = {
        uid: that.list[that.selKey][0].uid,
        remark: pval
      }
      this.$axios.post('/api/mobile.php?s=/user_info/remark', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) { // 修改成功
          that.$set(that.list[that.selKey][0].meta, 'other', `备注：${val}`)
          that.$vux.toast.text(data.msg)
        } else if (data.code === 0) { // 修改失败
          that.$vux.toast.show({
            text: data.msg,
            type: 'warn'
          })
        }
      })
      .catch(err => {
        console.log(err)
        console.log(err.status)
        console.log(err.statusText)
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
        if (this.onItemIdx === 0 || this.onItemIdx === 3) {
          this.userInfoData()
        } else if (this.onItemIdx === 1) {
          this.forwardUser()
        }
      }
    },
    // 分页导航切换
    onItemClick (index) {
      // console.log(index)
      this.showEndLine = false
      this.page = 0 // 重置页数
      this.onItemIdx = parseInt(index)
      switch (parseInt(index)) {
        case 0:
          this.resetTab()
          this.userInfoData()
          break
        case 1: // 转发排行
          this.resetTab()
          this.forwardUser()
          break
        case 2:
          this.$vux.toast.text('开发中~')
          break
        case 3: // 筛选
          this.filterPop = true
          break
      }
    },
    resetTab () {
      this.filterOpt.nickname = ''
      this.filterOpt.uid = ''
      this.filterOpt.remark = ''
      this.list = []
      document.getElementById('vux_view_box_body').scrollTop = 0
    },
    // 转发排行
    forwardUser () {
      let query = this.$route.query
      let that = this
      let data = {
        page: this.page
      }

      // 到底
      if (this.showEndLine) {
        return false
      }

      this.isloading = true

      // 非筛选的内容读缓存
      if ((this.onItemIdx === 1) && window.sessionStorage) {
        let saveKey
        if (query && query.aid) {
          saveKey = this.createSaveKey(query.aid, that.page, true) // 根据文章ID显示用户信息
        } else {
          saveKey = this.createSaveKey(false, that.page, true) // 总用户信息
        }
        let data = JSON.parse(window.sessionStorage.getItem(saveKey))
        if (data) {
          that.page++
          data.data.map((item, i) => {
            that.list.push([
              {
                uid: item.uid,
                src: item.headimgurl,
                title: item.nickname,
                desc: `总转发：${item.zhuan}次` + '&nbsp;'.repeat(4) + `停留时间：${item.stop}s`,
                url: '',
                meta: {
                  source: that.formatID(item.uid),
                  date: that.formatGender(item.sex),
                  other: that.formatRemark(item.remark)
                }
              }
            ])
          })
          that.isloading = false
          return false
        }
      }

      let url
      if (query && query.aid) {
        data.cid = query.aid
      }
      url = '/api/mobile.php?s=/user_info/forward_user'  // 总用户信息

      this.$axios.post(url, data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.page++
          if (data.data.list === null) {
            that.showEndLine = true
            that.isloading = false
            return false
          }

          data.data.list.map((item, i) => {
            that.list.push([
              {
                uid: item.uid,
                src: item.headimgurl,
                title: item.nickname,
                desc: `总转发：${item.zhuan}次` + '&nbsp;'.repeat(4) + `停留时间：${item.stop}s`,
                url: '',
                meta: {
                  source: that.formatID(item.uid),
                  date: that.formatGender(item.sex),
                  other: that.formatRemark(item.remark)
                }
              }
            ])
          })

          // 写入缓存
          if (window.sessionStorage) {
            let saveKey
            if (query && query.aid) {
              saveKey = that.createSaveKey(query.aid, that.page - 1, true) // 根据文章ID显示用户信息(排行)
            } else {
              saveKey = that.createSaveKey(false, that.page - 1, true) // 总用户信息(排行)
            }
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
    filterEve (val) {
      if (val === 'show') {
        // 禁止滚动
        document.body.addEventListener('touchmove', this.tmhandle, { passive: false })
      } else if (val === 'hide') {
        document.body.removeEventListener('touchmove', this.tmhandle, { passive: false })
      }
    },
    // 搜索
    search () {
      this.list = []
      this.userInfoData()
      this.filterPop = false
    },
    // 立即发红包
    sendRpk () {
    //   this.rpkPop = false
      if (this.rpkOpt.money.length <= 0 || this.rpkOpt.money < 0.3) {
        this.$vux.toast.show({
          text: '金额不能小于0.3',
          type: 'warn'
        })
        return false
      }
      let that = this
      let data = {}
      data.money = this.rpkOpt.money
      data.shop = this.rpkOpt.from
      data.content = this.rpkOpt.desc
      data.uid = this.list[this.selKey][0].uid

      this.rpkLoading = true
      this.$axios.post('/api/mobile.php?s=user_info/red', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.$vux.toast.text(data.msg)
        } else if (data.code === 0) {
          this.$vux.toast.show({
            text: data.msg,
            type: 'warn'
          })
        } else if (data.code === -100) { // 重新登录
          that.removeToken()
          that.$router.push('/Login')
        }
        that.rpkLoading = false
        that.rpkPop = false
        that.$refs.swipeoutItem[that.selKey].close()
      })
      .catch(err => {
        that.rpkLoading = false
        that.rpkPop = false
        that.$refs.swipeoutItem[that.selKey].close()
        console.log(err)
        console.log(err.status)
        console.log(err.statusText)
        console.log('request fail')
      })
    },
    rpkMoneyBlur (val) {
      this.rpkOpt.money = parseFloat(val) || 0
    },
    tmhandle (e) {
      let eve = e || window.event
      eve.preventDefault()
    }
  },
  destroyed () {
    // 销毁Scroll事件
    window.removeEventListener('scroll', this.loadMore, true)
  }
}
</script>

<style lang="less" scoped>
@import '../styles/reset.less';
@import '../styles/1px.less';
.userinfo {
    padding-top: 44px;
    .weui-panel {
        margin-top: 0px !important;
    }
}
.weui-media-box__desc {
    line-height: 1.4 !important;
}
.pop-footer {
    padding: 20px 14px;
}
.rpk-item {
    padding: 0 14px;
}
.rpk-close {
    position: absolute;
    top: 0;
    right: 0;
}
.rpk-footer {
    text-align: center;
    .money {
        font-size: 30px;
        margin: 10px 0;
        display: inline-block;
    }    
    .tips {
        font-size: 12px;
        color: #999;
    }
    button.weui-btn {
        width: 100%;
    }
}
.vux-tab-wrap {
    position: fixed !important;
    top: 46px;
    left: 0;
    width: 100%;
    z-index: 1;
}
.vux-loadmore.weui-loadmore {
    width: 100%;
}
</style>
