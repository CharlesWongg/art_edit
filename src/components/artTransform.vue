<template>
  <div style="padding-top: 46px;">
    <sticky scroll-box="vux_view_box_body" ref="sticky" :check-sticky-support="false" :offset="46" :disabled="disabled">    
        <tab active-color="#409EFF" bar-active-color="#409EFF">
            <tab-item :selected="tabIndex === 0" @on-item-click="onItemClick">文章转换</tab-item>
            <tab-item :selected="tabIndex === 1" @on-item-click="onItemClick">我的转换</tab-item>
        </tab>    
    </sticky>
    <div class="art-tran-box"  style="padding-top: 46px;">
        <template v-if="tabIndex === 0">
            <group title="文章链接">
                <x-textarea placeholder="长按粘贴文章链接" v-model="url"></x-textarea>            
            </group>
            <div class="footer">
                <x-button type="primary" @click.native="transform" :show-loading="isloading">立即转换</x-button>
                <x-button link="https://wx.sogou.com/" class="search">进入微信搜索</x-button>
            </div>
            <p class="tips"><icon type="info-circle"></icon>如果您进入微信搜索到好的文章或者在朋友圈看到好的文章，可以复制链接进行转换。转换文章不能涉及敏感政治话题和网络谣言，不能包含传销、迷信、暴力，一经发现，删除文章。</p>
        </template>
        <template v-if="tabIndex === 1">        
            <div ref="articleList" class="article-list-wrap">
                <div v-for="(item, index) in tabContentList" :key="index" class="article-list" >
                    <router-link tag="div" :to="{path: 'articledetail', query: {id: item.id}}" class="vux-1px-b m-article-item">
                        <div class="img-wrap" v-if="item.img">
                            <img :src="item.img" alt />
                        </div>
                        <div class="content-wrap">
                            <h2 class="title">{{item.name}}</h2>
                            <div class="desc-wrap">
                                <span>
                                    <v-icon name="user" class="icon"></v-icon>
                                    <span class="nums">{{item.num}}</span>
                                </span>
                                <span class="time">{{item.put_time*1000|dateFormat('YYYY-MM-DD HH:mm:ss')}}</span>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div style="margin-top: 30px; text-align: center;">
                    <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-if="!tabContentList.length && !listisloading"></load-more>
                </div>
                <load-more :show-loading="true" tip="加载中" background-color="#fbf9fe" v-if="listisloading"></load-more>   
                <divider v-if="showEndLine && tabContentList.length">我是有底线的</divider>                
            </div>       
        </template>
    </div>         
  </div>
</template>

<script>
import { dateFormat, XTextarea, Group, XButton, Icon, Tab, TabItem, Divider, LoadMore, Sticky } from 'vux'

export default {
  components: {
    XTextarea,
    Group,
    XButton,
    Icon,
    Tab,
    TabItem,
    Divider,
    LoadMore,
    Sticky
  },
  data () {
    return {
      showEndLine: false,
      url: '',
      listisloading: false,
      isloading: false,
      tabIndex: 0,
      tabContentList: [],
      page: 0,
      disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
    }
  },
  filters: {
    dateFormat
  },
  mounted () {
    window.addEventListener('scroll', this.loadMore, true)      
  },
  methods: {
    transform () {
      let that = this
      if (!this.url) {
        this.$vux.toast.text('文章链接不能为空')
        return false
      }

      this.isloading = true
      let data = {
        url: this.url
      }

      this.$axios.post('/api/mobile.php?s=/wx_url_content/index', data)
      .then(res => {
        let data = res.data
        that.isloading = false
        if (data.code === 1) {
          that.$vux.confirm.show({
            title: '提示',
            content: '转换成功，立即去查看',
            onCancel () {
              console.log('cancel')
            },
            onConfirm () {
              that.$router.push(`/articledetail?id=${data.data.id}`)
            }
          })
        } else if (data.code === 0) {
          that.$vux.toast.text(data.msg)
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
        that.isloading = false
      })
    },
    onItemClick (index) {
      this.tabIndex = index
      console.log(index)
      if (index === 1) {
        console.log('get list')
        this.page = 0
        this.showEndLine = false        
        this.myTran()
      }
    },
    // 加载更多
    loadMore () {
      let clientHeight = document.getElementById('vux_view_box_body').clientHeight
      let scrollTop = document.getElementById('vux_view_box_body').scrollTop
      let scrollHeight = document.getElementById('vux_view_box_body').scrollHeight
      if (!this.isloading && (clientHeight + scrollTop >= scrollHeight)) {
        this.myTran()
      }
    },    
    myTran () {
      let that = this
      let data = {
        p: this.page
      }

      // 到底
      if (this.showEndLine) {
        return false
      }

      this.listisloading = true

      this.$axios.post('/api/mobile.php?s=/wx_url_content/my_content', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          console.log(data)
          that.page++
          that.tabContentList = data.data
          that.listisloading = false
        } else if (data.code === 0) {
          that.listisloading = false
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
        that.listisloading = false
      })
    }
  }
}
</script>
<style>
body {
    background-color: #f2f2f2;
}
</style>
<style lang="less" scoped>
@import '../styles/reset.less';
.art-tran-box {
    .footer {
        margin: 20px 14px 0;
        .search {
            background-color: #ffa025;
            color: #fff;
        }
    }
    .tips {
        color: #999;
        padding: 18px 14px;  
        .weui-icon-info-circle {
            font-size: 21px;
            color: #409EFF;
        }          
    }
}
.m-article-item {
    display: flex;
    padding: 10px;
    background-color: #fff;
    .img-wrap {
        width: 80px;
        margin-right: 10px;
        img {
            display: block;
            max-width: 100%;
        }
    }
    .content-wrap {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;
        .title {
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 400;
        }
        .desc-wrap {
            // position: relative;
            font-size: 14px;
            color: #666;
        }
        .tag {
            margin-right: 20px;
            padding: 3px 5px;
            color: #fff;
            background-color: #159;
            border-radius: 3px;
        }
        .time {
            // position: absolute;
            // right: 0;
            float: right;
        }
        .icon {
            width: auto;
            height: 0.9em;
            max-width: 100%;
            max-height: 100%;
            font-size: 12px;
            color: #999;
        }
    }
}
</style>
