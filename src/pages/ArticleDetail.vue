<template>
  <div class="article-detail-container" style="padding-top: 46px;">
    <template v-if="artInfo">
      <h1 class="title">{{ artInfo.name }}</h1>
      <div class="desc-wrap">
        <span class="tag">{{ artInfo.article }}</span>
        <span class="time">{{ artInfo.input_time*1000|dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
      </div>
      <div class="article-detail" v-html="artInfo.content">        
      </div>
    
      <div v-transfer-dom>
        <router-link tag="div" :to="`/articleedit?id=${ artInfo.id }`" class="edit-link">
          <x-button plain type="primary">修改文章</x-button>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { TransferDom, dateFormat, XButton } from 'vux'

export default {
  name: 'ArticleDetail',
  directives: {
    TransferDom
  },
  data () {
    return {
      artInfo: {}
    }
  },
  components: {
    XButton
  },
  mounted () {
    this.initData()
  },
  filters: {
    dateFormat
  },
  methods: {
    initData () {
      let that = this
      let query = this.$route.query
      if (!query || !query.id) {
        return false
      }

      let data = {
        id: query.id
      }

      this.$axios.post('/api/mobile.php?s=/wx_url_content/detail', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.artInfo = data.data
        } else {
          that.$vux.toast.text('文章发生错误')
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
        that.$router.push('/Login')
      })
    }
  }
}
</script>

<style>
.article-detail img {
    width: 100%;
}
</style>
<style lang="less" scoped>
.article-detail-container {
  padding: 10px;
  color: #666;
  box-sizing: border-box;
  background-color: #fff;
  .title {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 400;
    color: #333;
  }
  .desc-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #999;
  }
  .article-detail {
    padding: 20px 0;
    p {
      margin-bottom: 10px;
    }
  }
}
.edit-link {
  position: fixed;
  right: 0;
  bottom: 100px;
  button {
    font-size: 14px;
    border-color: #f00;
    color: #f00;
  }
}
</style>
<style>
@import '../styles/rich_media.css';
</style>
<link rel="stylesheet" href="//res.wx.qq.com/mmbizwap/zh_CN/htmledition/style/page/middle/middle476532.css">
