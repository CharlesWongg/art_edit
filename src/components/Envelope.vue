<template>
  <div class="m-envelope m-pre-list" style="padding-top: 46px;">
    <div style="height:44px;">
        <sticky scroll-box="vux_view_box_body" ref="sticky" :check-sticky-support="false" :offset="46" :disabled="disabled" style="background-color: #fff;">
            <cell title="筛选" is-link @click.native="showScreen = true" class="vux-1px-tb"></cell>
        </sticky>
    </div>    
    <div>
      <group :title="groupTitle">
          <template v-for="(item, i) in list">
              <cell
              style="font-size: 14px;"
              :key="i"
              :title="item.uid"
              is-link
              :border-intent="false"
              :arrow-direction="showContent[i] ? 'up' : 'down'"
              @click.native="openPre(i)">
                  <flexbox :gutter="5" class="cell-main">
                      <flexbox-item :span="1/6" :order="4">
                          <img :src="item.headimgurl" class="headerimg" alt="" />
                      </flexbox-item>
                      <flexbox-item :span="1/3" :order="4">
                          <span>{{ item.nickname|mysubstr(4) }}</span>
                      </flexbox-item>
                      <flexbox-item :span="1/4" :order="4">
                          <span>{{ item.money }}</span>
                      </flexbox-item>
                      <flexbox-item :span="1/4" :order="4">
                          <span class="status" v-if="item.status === '发送失败'">失败</span>
                          <span class="status" v-else>{{ item.status }}</span>
                      </flexbox-item>
                  </flexbox>
              </cell>

              <template v-if="showContent[i]">
                  <cell-form-preview :border-intent="false" :list="item.label_list"></cell-form-preview>
              </template>
          </template>
      </group>
      <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-if="!list.length && !isloading"></load-more>
      <load-more :show-loading="true" tip="加载中" background-color="#fbf9fe" v-if="isloading"></load-more>   
      <divider v-if="showEndLine && list.length">我是有底线的</divider>     
    </div>

    <div v-transfer-dom class="tran-filter">
      <popup v-model="showScreen" @on-hide="screenHide" @on-show="screenShow" height="100%">
        <div class="popup">
          <group title="筛选">
            <x-input :clickFocus="true" label-width="120px" title="红包编号:" placeholder="" v-model="filterOpt.eid" :show-clear="true" placeholder-align="right"></x-input>
            <x-input :clickFocus="true" label-width="120px" title="文章ID:" placeholder="" v-model="filterOpt.aid" :show-clear="true" placeholder-align="right"></x-input>            
            <x-input :clickFocus="true" label-width="120px" title="用户UID:" placeholder="" v-model="filterOpt.uid" :show-clear="true" placeholder-align="right"></x-input>
            <x-input :clickFocus="true" label-width="120px" title="昵称:" placeholder="" v-model="filterOpt.nickname" :show-clear="true" placeholder-align="right"></x-input>
            <popup-radio title="交易状态" :options="statusText" v-model="filterOpt.status" @on-show="hideScreenEve" @on-hide="showScreenEve" placeholder=""></popup-radio>
            <datetime v-model="filterOpt.start" start-date="2019-01-01" format="YYYY-MM-DD HH:mm" title="开始日期"></datetime>
            <datetime v-model="filterOpt.end" start-date="2019-01-01" format="YYYY-MM-DD HH:mm" title="结束日期"></datetime>
          </group>
          <div style="padding:15px;" class="pop-footer">
            <x-button type="primary" plain @click.native="filterReset">重置</x-button>
            <x-button type="primary" @click.native="search">确定</x-button>
            <div class="full-btn">
              <x-button style="width: 96%;" type="default" @click.native="showScreen = false">关闭</x-button>
            </div>
          </div>          
        </div>
      </popup>
    </div>    
  </div>
</template>

<script>
import { XInput, Group, XButton, Cell, CellFormPreview, LoadMore, Divider, Flexbox, FlexboxItem, Sticky, TransferDom, Popup, PopupRadio, Datetime } from 'vux'
import { mapActions } from 'vuex'

export default {
  directives: {
    TransferDom
  },
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    CellFormPreview,
    LoadMore,
    Divider,
    Flexbox,
    FlexboxItem,
    Sticky,
    TransferDom,
    Popup,
    PopupRadio,
    Datetime
  },
  data () {
    return {
      disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
      isloading: false,
      showEndLine: false,
      page: 0,
      list: [],
      showContent: [],
      showScreen: false,
      filterOpt: {
        eid: '',
        aid: '',
        uid: '',
        nickname: '',
        status: '',
        start: '',
        end: ''
      },
      statusText: [{
        key: '',
        value: '全部'
      }, {
        key: 0,
        value: '发放中'
      }, {
        key: 1,
        value: '未领取'
      }, {
        key: 2,
        value: '已领取'
      }, {
        key: 3,
        value: '退款中'
      }, {
        key: 4,
        value: '已退款'
      }, {
        key: 5,
        value: '失败'
      }]
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
  computed: {
    groupTitle () {
      return `<div class='group-title'>\
                <span>UID</span>\
                <span>头像</span>\
                <span>昵称</span>\
                <span>红包金额(元)</span>\
                <span>状态</span>
              </div>`
    }
  },
  mounted () {
    this.envelopeData()
    window.addEventListener('scroll', this.loadMore, true)
  },
  methods: {
    ...mapActions([
      'removeToken'
    ]),
    // 纸包明细列表
    envelopeData () {
      let that = this
      let data = {
        page: this.page
      }

      // 到底
      if (this.showEndLine) {
        return false
      }

      // 红包编号
      if (this.filterOpt && this.filterOpt.eid) {
        data.red_id = this.filterOpt.eid
      }

      // 文章ID
      if (this.filterOpt && this.filterOpt.aid) {
        data.art_id = parseInt(this.filterOpt.aid)
      }

      // 用户UID
      if (this.filterOpt && this.filterOpt.uid) {
        data.uid = parseInt(this.filterOpt.uid)
      }

      // 昵称
      if (this.filterOpt && this.filterOpt.nickname) {
        data.nickname = this.filterOpt.nickname
      }

      // 交易状态
      if (this.filterOpt && this.filterOpt.status) {
        data.selStatus = parseInt(this.filterOpt.status)
      }

      // 时间
      if (this.filterOpt && this.filterOpt.start && this.filterOpt.end) {
        data.datetime = `${new Date(this.filterOpt.start).getTime()},${new Date(this.filterOpt.end).getTime()}`
      }

      this.isloading = true

      this.$axios.post('/api/mobile.php?s=/envelope/detail', data)
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
            that.showContent.push(false)
            that.list.push({
              uid: item.uid,
              headimgurl: item.headimgurl,
              nickname: item.nickname,
              money: item.money,
              status: item.status,
              label_list: [{
                label: '文章ID',
                value: item.cid
              }, {
                label: '红包编号',
                value: item.id
              }, {
                label: '红包发布人',
                value: item.name || '默认'
              }, {
                label: '红包发放描述',
                value: item.desc || '默认'
              }, {
                label: '交易时间',
                value: item.input_time
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
        this.envelopeData()
      }
    },
    hideScreenEve () {
      this.showScreen = false
    },
    showScreenEve () {
      this.showScreen = true
    },
    screenHide () {
      document.body.removeEventListener('touchmove', this.tmhandle, { passive: false })
    },
    screenShow () {
      // 禁止滚动
      document.body.addEventListener('touchmove', this.tmhandle, { passive: false })
    },
    search () {
      this.showEndLine = false
      this.page = 0 // 重置页数
      this.list = []
      this.envelopeData()
      this.showScreen = false
    },
    filterReset () {
      this.filterOpt.eid = ''
      this.filterOpt.uid = ''
      this.filterOpt.aid = ''
      this.filterOpt.nickname = ''
      this.filterOpt.status = ''
      this.filterOpt.start = ''
      this.filterOpt.end = ''
    },
    tmhandle (e) {
      let eve = e || window.event
      eve.preventDefault()
    }
  },
  destroyed () {
    // 销毁Scroll事件
    window.removeEventListener('scroll', this.loadMore, true)
    document.body.removeEventListener('touchmove', this.tmhandle, { passive: false })
  }
}
</script>

<style lang="less" scope>
@import '../styles/reset.less';
@import '../styles/1px.less';
.m-envelope.m-pre-list{
    .group-title {
        display: flex;
        justify-content: space-between;
        width: 94%;
        span {
            &:last-child {
                margin-right: 14px;
            }
        }
    }
    .weui-cell__ft {
        width: 78%;
    }
    .cell-main {
        display: flex;
        justify-content: space-between;
        width: 94%;
        .headerimg {
            width: 24px;
            height: 24px;
            border-radius: 50%;
        }
        .status {
            margin-right: 6px;
            font-size: 12px;
        }
    }
    .weui-cells__title {
        // position: fixed;
        // top: 46px;
        // left: 0;
        // width: 96%;
        // z-index: 3;
        // background-color: #fff;
        // height: 38px;
        // margin-top: 0 !important;
        // padding-top: 0.77em;     
        // display: block !important;   
    }
    .weui-cells__title + .weui-cells {
        // margin-top: 3px !important;
    }    
}

.tran-filter {
    .popup {
      width:100%;
      height:100%;
      .pop-footer {
        display: flex;
        flex-wrap: wrap;
        .full-btn {
          width: 100%;
        }
        .weui-btn {
          margin-top: 15px;
          width: 46%;
        }
      }
    }  
}
</style>
