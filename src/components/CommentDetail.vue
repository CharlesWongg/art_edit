<template>
  <div class="m-precom-list" style="padding-top: 46px;">    
    <sticky scroll-box="vux_view_box_body" ref="sticky" :check-sticky-support="false" :offset="46" :disabled="disabled" style="background-color: #fff;">
      <div class='com-tab'>
        <span>标题</span>
        <span style="margin-left: 46px;">回复状态</span>
        <span>添加时间</span>
      </div>  
    </sticky>  
    <group> 
      <div>
        <cell title='文章' :value="selArtVal" is-link style="background-color: #fff;" class="vux-1px-b com-art-search" @click.native="artPopHandle"></cell>
      </div>     
      <swipeout class="m-article">
          <swipeout-item v-for="(item, i) in list" :key="i" transition-mode="follow" underlay-color="#fff" :auto-close-on-button-click="false" ref="swipeoutItem">
              <div slot="right-menu">
                  <swipeout-button @click.native="enable(i, 1)" background-color="#409EFF" v-if="item.status == 2">启用</swipeout-button>
                  <swipeout-button @click.native="enable(i, 2)" background-color="#F56C6C" v-if="item.status == 1">禁用</swipeout-button>
                  <swipeout-button @click.native="answerEve(i)" background-color="#E6A23C">回复</swipeout-button>
              </div>
              <div slot="content" class="demo-content vux-1px-tb">
                  <panel type="4">
                      <div slot="body" class="art-item comment">
                        <template>
                            <cell
                            :title="substrEve(item.content_name, 9)"
                            is-link
                            :border-intent="false"
                            :arrow-direction="showContent[i] ? 'up' : 'down'"
                            @click.native="openPre(i)">
                                <div class="cell-main">
                                    <span class="status">{{ item.over > 0 ? '已回复' : '未回复' }}</span>
                                    <span class="date">{{ item.input_time }}</span>
                                </div>        
                            </cell>

                            <template v-if="showContent[i]">
                                <cell-form-preview :border-intent="false" :list="item.label_list"></cell-form-preview>
                            </template>
                        </template>
                      </div>
                  </panel>
              </div>
          </swipeout-item>
      </swipeout>  
    </group>
    <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-if="!list.length && !isloading"></load-more>
    <load-more :show-loading="true" tip="加载中" background-color="#fbf9fe" v-if="isloading"></load-more>   
    <divider v-if="showEndLine && list.length">我是有底线的</divider>

    <!-- 回复 -->
    <div v-transfer-dom>
      <popup v-model="answerPop" position="bottom" height="100%">    
        <div class="m-ansPop">
          <group title="评论" class="answer-item">
              <div class="comment" v-if="selKey">{{ list[selKey].content }}</div>
          </group>
          <group title="回复" class="answer-item">
              <x-textarea :max="120" placeholder="请填回复内容" v-model="answer"></x-textarea>
          </group>
          
          <div style="padding: 15px;" class="rpk-footer">
            <x-button @click.native="sendAnswer" type="primary" :show-loading="ansLoading">回复</x-button>
            <x-button @click.native="answerPop = false" type="default">关闭</x-button>
          </div>        
        </div>
        <x-icon type="ios-close-empty" class="rpk-close" size="25" @click.native="answerPop = false"></x-icon>
      </popup>
    </div> 

    <div v-transfer-dom>
      <popup class="m-artPop" v-model="artPop" height="60%" @on-hide="artPopHideEve">
        <div>
          <load-more tip="正在加载" v-if="artloading"></load-more>
          <radio :options="artList" v-model="selArtKey" @on-change="artChange">
            <template slot-scope="props" slot="each-item">
              <flexbox :gutter="10">
                <flexbox-item :span="3/4"><span>{{ artList[props.index].value }}</span></flexbox-item>
                <flexbox-item :span="1/4"><span>{{ '转:' + artList[props.index].share }}</span></flexbox-item>
              </flexbox>                            
            </template>
          </radio>
        </div>
      </popup>
    </div>        
  </div>
</template>

<script>
import { TransferDom, Swipeout, SwipeoutItem, SwipeoutButton, Panel, LoadMore, Confirm, Divider, Scroller, Spinner, Tab, TabItem, Popup, XInput, XButton, XTextarea, Badge, Cell, CellFormPreview, Radio, Flexbox, FlexboxItem, Sticky } from 'vux'
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
    Badge,
    Cell,
    CellFormPreview,
    Radio,
    Flexbox,
    FlexboxItem,
    Sticky
  },
  data () {
    return {
      artloading: false,
      disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
      isChangeArt: false,
      selArtKey: 0,
      selArtVal: '全部',
      artList: [],
      artPop: false,
      isloading: false,
      showEndLine: false,
      answerPop: false,
      ansLoading: false,
      answer: '',
      selKey: '',
      stateStyle: {
        1: 'badge-enable',
        2: '',
        3: 'badge-check',
        4: 'badge-uncheck'
      },
      stateText: {
        0: '禁用',
        1: '首页展示',
        2: '审核中'
      },
      overText: {
        0: '已回复',
        1: '未回复'
      },
      list: [],
      page: 0,
      showContent: []
    }
  },
  filters: {
    mysubstr (str, len) {
      if (!str) return
      if (str.length > len) {
        str = str.substr(0, len) + '...'
      }
      return str
    }
  },
  mounted () {
    this.initData()
    window.addEventListener('scroll', this.loadMore, true)
  },
  methods: {
    ...mapActions([
      'removeToken'
    ]),
    // 文章列表
    initData () {
      let that = this
      let data = {
        page: this.page
      }
      if (this.selArtKey !== 0) data.art_id = this.selArtKey

      // 到底
      if (this.showEndLine) {
        return false
      }

      this.isloading = true

      this.$axios.post('/api/mobile.php?s=/comment/index', data)
      .then(res => {
        let data = res.data
        console.log(data)
        if (data.code === 1) {
          that.page++
          if (data.data.list === null) {
            that.showEndLine = true
            that.isloading = false
            return false
          }

          data.data.list.map((item, i) => {
            that.showContent.push(false)
            that.list.push({
              id: item.id,
              content_name: item.content_name,
              status: item.status,
              over: item.over,
              input_time: item.input_time.split(' ')[0],
              all_money: item.all_money,
              content: item.content,
              label_list: [{
                label: '标题',
                value: item.content_name
              }, {
                label: '发布者',
                value: item.nickname
              }, {
                label: '状态',
                value: that.stateText[item.status]
              }, {
                label: '评论',
                value: item.content
              }, {
                label: '回复',
                value: (item.answer && item.answer.content) || ''
              }]
            })
          })
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
      this.$axios.post('/api/mobile.php?s=/comment/del', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) { // 修改成功
          that.$vux.toast.text(data.msg)
          that.$set(that.list[key], 'status', status)
          // that.list[key].status_text = that.stateText[status]
          that.$set(that.list[key].label_list[2], 'value', that.stateText[status])
          that.$refs.swipeoutItem[key].close()
        } else if (data.code === 0) {
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
    // 回复
    answerEve (key) {
      console.log(key)
      this.selKey = key
      this.answerPop = true
    },
    // 预览
    openPre (key) {
      this.$set(this.showContent, key, !this.showContent[key])
    },
    // 加载更多
    loadMore () {
      let clientHeight = document.getElementById('vux_view_box_body').clientHeight
      let scrollTop = document.getElementById('vux_view_box_body').scrollTop
      let scrollHeight = document.getElementById('vux_view_box_body').scrollHeight
      if (!this.isloading && (clientHeight + scrollTop >= scrollHeight)) {
        this.initData()
      }
    },
    substrEve (str, len) {
      if (!str) return
      if (str.length > len) {
        str = str.substr(0, len) + '...'
      }
      return str
    },
    // 回复
    sendAnswer () {
      console.log('answer')
      console.log(this.list[this.selKey].id)
      console.log(this.answer)

      let that = this
      let data = {
        id: this.list[this.selKey].id,
        content: this.answer
      }
      this.$axios.post('/api/mobile.php?s=/comment/submit_answer', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) { // 回复成功
          that.answerPop = false
          that.$refs.swipeoutItem[that.selKey].close()
          that.$vux.toast.text(data.msg)
          that.$set(that.list[that.selKey], 'over', 1)
          that.$set(that.list[that.selKey].label_list[4], 'value', that.answer)
        } else if (data.code === 0) {
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
    // 选择文章
    artChange (val, label) {
      this.selArtVal = label
      this.selArtKey = val
      this.artPop = false
      this.isChangeArt = true
      this.page = 0
      this.list = []
      this.showContent = []
      this.showEndLine = false
      this.initData()
      document.getElementById('vux_view_box_body').removeEventListener('touchmove', this.unThrough, { passive: false })
    },
    artPopHandle () {
      document.getElementById('vux_view_box_body').addEventListener('touchmove', this.unThrough, { passive: false })
      if (this.artList.length === 0) this.artloading = true
      this.artPop = true
      let that = this
      let data = {}

      this.$axios.post('/api/mobile.php?s=/Exchange/get_art', data)
      .then(res => {
        that.artloading = false
        let data = res.data
        if (data.code === 1) {
          data = data.data
          that.artList = []
          for (let i in data) {
            that.artList.push({
              key: data[i].id,
              value: data[i].art,
              share: data[i].share
            })
          }
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
        that.artloading = false
      })
    },
    unThrough (e) {
      let eve = e || window.event
      eve.preventDefault()
    },
    artPopHideEve () {
      document.getElementById('vux_view_box_body').removeEventListener('touchmove', this.unThrough, { passive: false })
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
.com-tab {
    padding: 10px 14px;
    color: #999;
    display: flex;
    justify-content: space-between;
}
.m-precom-list{
    .vux-no-group-title {
      margin-top: .17em;
    }
    .group-title {
        display: flex;
        justify-content: space-between;
        span {
            &:last-child {
                margin-right: 14px;
            }
        }
    }
    .weui-cell__ft {
        width: 55%;
    }
    .cell-main {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        .headerimg {
            width: 24px;
            height: 24px;
            border-radius: 50%;
        }
        .status {
            margin: 0 14px;
        }
        .date {
            margin-right: 6px;
        }
    }
    .weui-cells__title {
        position: fixed;
        top: 46px;
        left: 0;
        width: 96%;
        z-index: 3;
        background-color: #fff;
        height: 32px;
        margin-top: 0 !important;
        padding-top: 0.77em;     
    }
    .weui-cells__title + .weui-cells {
        margin-top: 50px !important;
    }    
}
.art-item.comment {
    padding: 10px 14px 0px;
}
.m-article .vux-swipeout-item {
  margin-top: 0px;
}
.m-ansPop {
    margin: 0 14px;
    .answer-item {
      font-size: 14px;
      .weui-textarea {
        font-size: 14px;
      }
    }
    .comment {
      padding: 10px 15px;
      font-size: 14px;
    }
    .weui-cells__title {
      padding-left: 0 !important;
    }
}
.rpk-close {
  position: absolute;
  top: 0;
  right: 0;
} 
.demo-content {
  .weui-panel {
    margin: unset !important;
  }
}
.m-precom-list {
  .m-article {
    .vux-swipeout-item {
      margin-top: 0px;
    }
  }
  .com-art-search {
      .vux-label {
          width: 45px;
      }
      .weui-cell__ft {
          text-align: left;
          width: initial;
      }
  }
}
</style>
