<template>
    <div>
        <sticky scroll-box="vux_view_box_body" :check-sticky-support="false" :offset="0">
            <tab :line-width="2" active-color="#91a8f6" v-model="tabIndex">
                <tab-item
                    class="vux-center"
                    :selected="selectedTab === item.name"
                    v-for="(item, index) in tabTitleList"
                    @click.native="handleSelTab(item, index)"
                    :key="'tab_'+index"
                >{{item.name}}</tab-item>
            </tab>
        </sticky>
        <div ref="articleList" class="article-list-wrap">
            <div v-for="(item, index) in tabContentList" :key="index" class="article-list">
                <router-link tag="div" :to="{path: 'articledetail', query: {id: item.id}}" class="vux-1px-b m-article-item">
                    <div class="img-wrap" v-if="item.img">
                        <img :src="item.img" alt />
                    </div>
                    <div class="content-wrap">
                        <h2 class="title">{{item.name}}</h2>
                        <div class="desc-wrap">
                            <!-- <span class="tag">{{subitem.tag}}</span> -->
                            <span>
                                <v-icon name="user" class="icon"></v-icon>
                                <span class="nums">{{item.num}}</span>
                            </span>
                            <span class="time">{{item.input_time*1000|dateFormat('YYYY-MM-DD HH:mm:ss')}}</span>
                        </div>
                    </div>
                </router-link>
            </div>
            <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-if="!tabContentList.length && !isloading"></load-more>
            <load-more :show-loading="true" tip="加载中" background-color="#fbf9fe" v-if="isloading"></load-more>   
            <divider v-if="showEndLine && tabContentList.length">我是有底线的</divider>            
        </div>        
    </div>
</template>

<script>
import { Sticky, Tab, TabItem, Swiper, SwiperItem, Panel, LoadMore, dateFormat, Divider } from "vux"

export default {
    name: "ArticleList",
    components: {
        Sticky,
        Tab,
        TabItem,
        Swiper,
        SwiperItem,
        Panel,
        LoadMore,
        Divider
    },
    data () {
        return {            
            isloading: false,
            showEndLine: false,
            tabTitleList: [{
                id: 0,
                name: '全部'
            }],
            selectedTab: "全部",
            tabIndex: 0,
            page: 0,
            tabContentList: []
        }
    },
    filters: {
      dateFormat
    },
    mounted () {
      this.getTabList()
      this.getArtList()
      window.addEventListener('scroll', this.loadMore, true)
    },
    methods: {
      handleSelTab (item, i) {
        this.selectedTab = item.name
        this.tabIndex = i
        this.page = 0
        this.showEndLine = false
        this.getArtList()
      },
      getTabList () {
        let that = this
        let data = {}

        this.$axios.post('/api/mobile.php?s=/WxUrlContent/get_content_type', data)
        .then(res => {
            let data = res.data
            if (data.code === 1) {
            data.data.map((item) => {
                this.tabTitleList.push(item)
            })
            }
        })
        .catch(err => {
            console.log(err)
            console.log('request fail')
        })          
      },
      // 加载更多
      loadMore () {
        let clientHeight = document.getElementById('vux_view_box_body').clientHeight
        let scrollTop = document.getElementById('vux_view_box_body').scrollTop
        let scrollHeight = document.getElementById('vux_view_box_body').scrollHeight
        if (!this.isloading && (clientHeight + scrollTop >= scrollHeight)) {
          this.getArtList()
        }
      },      
      getArtList () {
        let that = this

        // 到底
        if (this.showEndLine) {
          return false
        }

        this.isloading = true

        let data = {
          type: this.tabTitleList[this.tabIndex].id,
          p: this.page
        }

        this.$axios.post('/api/mobile.php?s=/WxUrlContent/content_list', data)
        .then(res => {
            let data = res.data
            if (data.code === 1) {
              that.page++
              if (data.data === null || !data.data) {
                that.showEndLine = true
                that.isloading = false
                return false
              }                
              this.tabContentList = data.data
            } else if (data.code === 0) {
              if (data.data === null || !data.data) {
                that.showEndLine = true
                that.isloading = false
                return false
              }
            }
            that.isloading = false
        })
        .catch(err => {
            console.log(err)
            console.log('request fail')
            that.isloading = false
        })           
      }
    }
}
</script>

<style lang="less" scoped>
@import "~vux/src/styles/1px.less";
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
