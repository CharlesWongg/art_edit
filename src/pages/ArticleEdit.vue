<template>
  <div class="m-article-detail-container" style="padding-top: 46px;">
      <!-- 提示语，可关闭 -->
    <div class="m-tips" v-if="isShowTips">
      点击标题、文字、图片进行修改 <x-icon type="ios-close" size="20" @click="closeTips"></x-icon>
    </div>
    <!-- 文章区 -->
    <article class="m-article-wrapper">
      <!-- 文章标题 -->
      <h1 class="title" @click="titlePop = true">{{ artInfo.name }}</h1>
      <!-- 设置发布人 -->
      <div class="m-publisher">
        <div class="publisher" @click="editUser">{{ fromUser ? '发布人: ' + fromUser : '点击设置你的发布人'}}</div>
      </div>
      <!-- 上传图片 -->
      <div class="m-upload-wrap vux-1px">
          <input type="file" class="upload" @change="handleAvatarSuccess" ref="inputer" />
          <img class="img" v-if="imageUrl" :src="imageUrl" />
          <v-icon v-else name="plus" class="icon"></v-icon>
      </div>
      <!-- 图片要求 -->
      <p class="u-help-block">封面图:只能上传jpg/png文件,尺寸：340*340</p>
      <!-- 编辑浮层 -->
      <div class="m-select-section" ref="catchContainer">
        <div class="border" ref="catchContent">  </div>
        <div class="m-edit-nav">
          <div class="nav-item" @click="delContent">
            <v-icon name="trash" class="icon"></v-icon>
            <span class="word">删除</span>
          </div>
          <!--
          <router-link tag="div" to="/articletpltext" class="nav-item">
            <v-icon name="pen" class="icon"></v-icon>
            <span class="word">改文字</span>
          </router-link>
          -->
          <div tag="div" class="nav-item" @click="editType('text')">
            <v-icon name="pen" class="icon"></v-icon>
            <span class="word">改文字</span>
          </div>          
          <div tag="div" class="nav-item" @click="editType('img')">
            <v-icon name="photo-video" class="icon"></v-icon>
            <span class="word">插图片</span>
          </div>
          <!--
          <div tag="div" class="nav-item" @click="editType('video')">
            <v-icon name="video" class="icon"></v-icon>
            <span class="word">插视频</span>
          </div>
          -->
        </div>
      </div>
      <!-- 文章内容 -->    
      <div class="m-article-detail" ref="article" @click="bindEditEve($event)" v-html="artInfo.content"></div>
    </article>

    <divider>设置</divider>

    <!-- 设置区 -->
    <div class="m-config">
        <!-- 微信分享描述 -->
      <section class="m-config-section">
        <h2>微信分享描述</h2>
        <group>
          <x-textarea v-model="shareDescription" :max="40" placeholder="例：倒贴1600元让你买，省钱变美的秘密全在这里"></x-textarea>
        </group>
      </section>
      <div id="setRule" v-if="showRule">
        <!-- 图谱设置 -->
        <section class="m-config-section">
          <h2>图谱设置</h2>
            <group class="check-wrap" title="我的图谱">
              <radio :options="options" v-model="map.my.show"></radio>
            </group>
            <group class="check-wrap" title="活动源图谱">
                <radio :options="options" v-model="map.source.show"></radio>
            </group>
        </section>
        <!-- 红包总额 -->
        <section class="m-config-section">
          <h2>文章分享封顶奖励（元）<span class="tips">（发放达到该金额后不会发放红包）</span></h2>
          <div>
            <input placeholder="例：500" v-model="max_money">
          </div>
        </section>
        <!-- 红包规则 -->
        <section class="m-config-section">
          <h2>设置系统发红包规则</h2>
          <section class="sub-section">
              <h4>触发系统发红包条件<span class="tips">（不设置时不触发）</span></h4>
              <div class="item">
                  前 <input type="text" class="width-short" placeholder="60" v-model="reward.time" /> 分钟内
              </div>
              <div class="item">
                  阅读量低于 <input type="text" class="width-short" placeholder="600" v-model="reward.num" /> 时给阅读的用户发送红包
              </div>
          </section>
          <section class="sub-section">
              <h4>触发系统发红包条件<span class="tips">（不设置时不触发）</span></h4>
              <div class="item">
                  用户停留页面 <input type="text" class="width-short" placeholder="10" v-model="red.stop" /> 秒
              </div>
              <group class="check-wrap" title="用户是否需要在文章页面存在滑动行为：">
                  <radio :options="options1" v-model="red.scroll"></radio>
              </group>
              <group class="check-wrap" title="用户是否需要转发当前文章：">
                  <radio :options="options1" v-model="red.zhuan"></radio>
              </group>
          </section>
          <section class="sub-section">
              <h4>单个红包金额限制</h4>
              <div class="item">
                  最低金额 <input type="text" class="width-short" placeholder="0.3" v-model="red.min" /> 元
              </div>
              <div class="item">
                  最高金额 <input type="text" class="width-short" placeholder="0.5" v-model="red.max" /> 元
              </div>
          </section>
          <section class="sub-section">
              <h4>系统触发发放红包时间段内发放个数上限<span class="tips">（不设置时为无上限）</span></h4>
              <div class="item">
                  <input type="text" class="width-short" placeholder="150" v-model="all_num" /> 个
              </div>
          </section>
          <section class="sub-section">
              <h4>红包发放商户名<span class="tips">（不设置时为系统默认）</span></h4>
              <group>
                  <x-textarea :max="10" :rows="1" v-model="red.shop" placeholder="例：美星社"></x-textarea>
              </group>
          </section>
          <section class="sub-section">
              <h4>红包发放描述<span class="tips">（不设置时为系统默认）</span></h4>
              <group>
                  <x-textarea :max="40" v-model="red.desc" placeholder="例：恭喜您！获得5元红包，请加微信MX_2019领取优惠券"></x-textarea>
              </group>
          </section>
        </section>
        <!-- 奖励规则 -->
        <section class="m-config-section" style="padding-bottom: 40px;">
            <h2>设置发放红包金额奖励规则</h2>
            <section class="sub-section">
              <h4>一次滑动奖励</h4>
              <div class="item">
                  <input type="text" v-model="scroll" class="width-short" placeholder="0.05" /> 元
              </div>
            </section>
            <section class="sub-section">
              <h4>停留时间奖励</h4>
              <div class="item">
                  奖励 <input type="text" v-model="stop.reward" class="width-short" placeholder="0.01" /> 元
              </div>
              <div class="item">
                  停留奖励时间上限 <input type="text" v-model="stop.time" class="width-short" placeholder="10" /> 秒
              </div>
            </section>
        </section>
      </div>      
    </div>

    <!-- 修改 -->
    <div v-transfer-dom>
      <popup v-model="editPop" @on-hide="editEve('hide')" height="100%" @on-show="editEve('show')" style="background-color: #fff;">
        <div style="text-align: right; margin-bottom: 8px;"  @click="closeEditPop">
          <span class="vux-close"></span>
        </div>
        <!-- 导航 -->
        <button-tab class="m-top-nav">
          <button-tab-item :selected="textContainer" @on-item-click="navTo('text')">
            <v-icon name="pen" class="icon"></v-icon>
            <span>插入文字</span>
          </button-tab-item>
          <button-tab-item :selected="imgContainer" @on-item-click="navTo('img')">
            <v-icon name="photo-video" class="icon"></v-icon>
            <span>插入图片</span>
          </button-tab-item>
          <!--
          <button-tab-item :selected="videoContainer" @on-item-click="navTo('video')">
            <v-icon name="video" class="icon"></v-icon>
            <span>插入视频</span>
          </button-tab-item>
          -->
        </button-tab>
        <div class="g-page-container" v-if="textContainer">
          <!-- 文本编辑区 -->
          <div class="m-edit-group">
            <group class="textarea-group needsclick">
              <vue-html5-editor class="needsclick" :content="text" :height="100" @change="updateData"></vue-html5-editor>                
            </group>
            <!--
            <group title="测试">
              <div>{{ text }}</div>
            </group>
            -->
            <check-icon :value.sync="isSaveToTpl" class="check-save"> 存为模板 </check-icon>
            <group class="btn-group">
              <x-button class="confirm" type="primary" @click.native="confirm">确定</x-button>
            </group>
          </div>
          <!-- 模板列表 -->
          <div class="m-tpl-container" v-if="tplData.length">
            <h2 class="section-title">选择模板</h2>
            <ul class="tpl-list">
              <li class="tpl-item" v-for="item in tplData" :key="item.id">
                <p class="text" v-html="item.data" @click="chooseTpl(item.data, 'text')"></p>
                <div class="operating">
                  <v-icon name="trash" @click="delTpl(item.id)" class="icon"></v-icon>
                  <span @click="delTpl(item.id)">删除</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <template v-if="imgContainer">
          <!-- 图片编辑区 -->
          <div class="m-edit-group">
            <div class="textarea-group">
            </div>
            <div class="upload-wrap vux-1px">
                <input type="file" class="upload" @change="handleAvatarSuccess" ref="inputer" />
                <img class="img" v-if="editImageUrl" :src="editImageUrl" />
                <v-icon v-else name="plus" class="icon"></v-icon>
            </div>
            <p class="help-block">只能上传jpg/png文件</p>
            <check-icon :value.sync="isSaveToTpl" class="check-save"> 存为模板 </check-icon>
            <group class="btn-group">
              <x-button class="confirm" type="primary" @click.native="confirm">确定</x-button>
            </group>
          </div>
          <!-- 模板列表 -->
          <div class="m-tpl-container" v-if="tplImgData.length">
            <h2 class="section-title">选择模板</h2>
            <ul class="tpl-list">
              <li class="tpl-item" v-for="item in tplImgData" :key="item.id">
                <img class="preview" :src="item.data" alt="" @click="chooseTpl(item.data, 'img')">
                <div class="operating">
                  <v-icon name="trash" @click="delTpl(item.id)" class="icon"></v-icon>
                  <span @click="delTpl(item.id)">删除</span>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template class="m-tpl-container" v-if="videoContainer">
          <!-- 视频编辑区 -->
          <div class="m-edit-group">
            <div class="textarea-group">
            </div>
            <div class="upload-wrap vux-1px">
                <input type="file" class="upload" @change="handleVideoSuccess" ref="inputer" accept="mp4,avi,mov,rmvb"/>
                <video v-if="videoUrl">
                    <source :src="videoUrl" />
                </video>
                <v-icon v-else name="plus" class="icon"></v-icon>
            </div>
            <p class="help-block">视频大小不能超过 1M</p>
            <check-icon :value.sync="isSaveToTpl" class="check-save"> 存为模板 </check-icon>
            <group class="btn-group">
              <x-button class="confirm" type="primary" @click.native="confirm">确定</x-button>
            </group>
          </div>
          <!-- 模板列表 -->
          <div class="m-tpl-container" v-if="tplVideoData.length">
            <h2 class="section-title">选择模板</h2>
            <ul class="tpl-list">
              <li class="tpl-item" v-for="item in tplVideoData" :key="item.cid">
                <video class="preview" :src="item.src" controls></video>
                <div class="operating">
                  <v-icon name="trash" @click="delTpl(item.cid)" class="icon"></v-icon>
                  <span @click="delTpl(item.cid)">删除</span>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </popup>
    </div>

    <!-- 编辑标题 -->
    <div v-transfer-dom>
        <popup v-model="titlePop" @on-hide="titleEve('hide')" height="100%" @on-show="titleEve('show')" style="background-color: #fff;">
            <div>
            <group title="编辑标题">
              <x-textarea v-model="artInfo.name"></x-textarea>
            </group>
            </div>
            <div class="pop-footer">
                <x-button @click.native="save_title" type="primary">确定</x-button>
                <x-button @click.native="titlePop = false" type="default">关闭</x-button>
            </div>
        </popup>
    </div>    

    <!-- 发布人  -->
    <div v-transfer-dom>
      <confirm v-model="showUserCon"
      show-input
      ref="confirmUser"
      title="发布人"      
      @on-show="onShowConfirmUser"
      @on-confirm="onConfirmUser">
      </confirm>
    </div>

    <div v-transfer-dom>
      <div class="save-art">
        <x-button class="confirm" type="primary" @click.native="ruleConfirm">保存</x-button>
      </div>
    </div>    
  </div>
</template>

<script>
import { XButton, ButtonTab, ButtonTabItem, XTextarea, CheckIcon, XInput, Tabbar, TabbarItem, Radio, Popup, TransferDom, Confirm, Divider } from 'vux'
import initRichText from '../common/initHTMLEditor'
import 'font-awesome.css/css/font-awesome.css'
initRichText()

export default {
  name: 'ArticleDetail',
  directives: {
    TransferDom
  },
  components: {
    XButton,
    ButtonTab,
    ButtonTabItem,
    XTextarea,
    CheckIcon,
    XInput,
    Tabbar,
    TabbarItem,
    Radio,
    Popup,
    Confirm,
    Divider
  },
  data () {
    return {
      titlePop: false,
      artInfo: {},
      editPop: false,
      showRule: false,
      originData: null,
      isShowTips: true,
      editImageUrl: '',
      imageUrl: '',
      videoUrl: '',
      isShowGraph: true,
      isShowOriginGraph: true,
      all_num: 150,
      red: {
        stop: 5,
        scroll: 2,
        zhuan: 2,
        min: 0.3,
        max: 0.5,
        shop: '',
        desc: ''
      },
      stop: {
        reward: 0.01,
        time: 10
      },
      options: [{
        key: 1,
        value: '显示'
      }, {
        key: 2,
        value: '不显示'
      }],
      options1: [{
        key: 1,
        value: ' 是'
      }, {
        key: 2,
        value: '否'
      }],
      map: {
        my: {
          show: 2,
          text: '开启人脉图谱绘制',
          textColor: '#ffffff',
          bgColor: '#4565ae'
        },
        source: {
          show: 2,
          text: '活动源图谱',
          textColor: '#ffffff',
          bgColor: '#F56C6C'
        }
      },
      shareDescription: '',
      catchContentHtml: '',
      text: '',
      cid: 1003,
      isSaveToTpl: true,
      tplData: [],
      tplImgData: [],
      fromUser: '',
      showUserCon: false,
      max_money: '',
      reward: {
        time: 60,
        num: 100,
        read: 2
      },
      scroll: 0.05,
      tplVideoData: [
        {
          cid: 1001,
          src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
        },
        {
          cid: 1002,
          src: 'http://www.w3school.com.cn/i/movie.ogg'
        },
        {
          cid: 1003,
          src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
        }
      ],
      textContainer: false,
      imgContainer: false,
      videoContainer: false,
      editHtml: '',
      editTab: 'text',
      editorOption: {
        modules: {
          toolbar: [
            [{'background': []}, {'color': []}],
            [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'link'],        // toggled buttons
            ['blockquote', 'code-block']
          ]
        },
        placeholder: '请输入内容'
      }
    }
  },
  mounted () {
    let that = this
    this.initData() // 加载文章内容

    /** 通过 video 的 play 事件
        给视频绑定点击事件 */
    this.$nextTick(() => {
      let videos = document.getElementsByTagName('video')
      for (let i = 0; i < videos.length; i++) {
        videos[i].addEventListener('play', (e) => {
          that.bindEditEve(e)
        })
      }
    })
  },
  methods: {
    unescape (html) {
      return html
        .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
    },
    save_title () {
      this.titlePop = false
    },
    titleEve (val) {
      if (val === 'show') {
        // 禁止滚动
        document.body.addEventListener('touchmove', this.tmhandle, { passive: false })
      } else if (val === 'hide') {
        document.body.removeEventListener('touchmove', this.tmhandle, { passive: false })
      }
    },
    // 加载文章内容
    initData () {
      let that = this
      let query = this.$route.query
      // 获取文章库的文章详情
      let url = '/api/mobile.php?s=/wx_url_content/detail'
      if (!query || !query.id) {
        return false
      }

      let data = {
        id: query.id
      }

      // 获取文章列表的文章详情
      if (query && query.from === 'artList') {
        url = '/api/mobile.php?s=/wx_url_content/art_list_det'
        data = {
          aid: query.id
        }
      }

      this.$axios.post(url, data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.artInfo = data.data
          if (query && query.from === 'artList') { 
            that.fromUser = data.data.article
            that.imageUrl = data.data.img
            that.max_money = data.data.max_money
            that.reward = data.data.reward
            that.red = data.data.red
            that.all_num = data.data.all_num
            that.scroll = data.data.scroll
            that.stop = data.data.stop
            that.shareDescription = data.data.desc
            that.map = data.data.map
          }
        } else {
          that.$vux.toast.text('文章发生错误')
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    bindEditEve (ev) {
      ev.preventDefault()
      let originDom = ev.target
      const catchContainer = this.$refs.catchContainer
      const catchContent = this.$refs.catchContent
      const article = this.$refs.article
      catchContainer.style.display = 'block'

      // 操作框的点击过滤掉
      if (/m-edit-nav|border|m-article-wrapper|nav-item/.test(originDom.parentNode.className) || originDom.tagName.toLowerCase() === 'path') {
        this.originData.className = ''
        catchContent.innerHTML = ''
        article.insertBefore(catchContainer, article.childNodes[0]) /** 把Dom 从嵌套标签抽离到 $refs.article 容器 */
        catchContainer.style.display = 'none'
        return false
      }

      // 显示源内容
      if (this.originData) {
        this.originData.className = ''
      }

      // if (originDom.tagName.toLowerCase() !== 'p') {
      //   originDom = ev.target.parentElement
      // }
      // const nextDom = originDom

      this.originData = originDom

      article.insertBefore(catchContainer, article.childNodes[0]) /** 把Dom 从嵌套标签抽离到 $refs.article 容器 */
      catchContent.innerHTML = this.catchContentHtml = originDom.outerHTML
      originDom.before(catchContainer, originDom)
      originDom.className = 'hide'
    },
    delContent () {
      const catchContainer = this.$refs.catchContainer
      const catchContent = this.$refs.catchContent
      const article = this.$refs.article
      article.insertBefore(catchContainer, article.childNodes[0]) /** 把Dom 从嵌套标签抽离到 $refs.article 容器 */
      catchContainer.style.display = 'none' // 隐藏工具栏

      catchContent.innerHTML = '' // 清空工具栏的编辑内容
      this.originData.remove() // 删除源标签的节点
    },
    closeTips () {
      this.isShowTips = false
    },
    handleAvatarSuccess (ev) {
      const _this = this
      const inputDOM = ev.target || ev.dataTransfer
      this.file = inputDOM.files[0]
      if (!this.beforeAvatarUpload(this.file)) {
        return false
      }
      var reader = new FileReader()
      reader.onload = function (ev) {
        if (!_this.editPop) {
          // 图片保存到对象存储
          _this.imgStorage(ev.target.result, 'avatar')
        } else { // Popup 内的图片                              
          _this.editImageUrl = ev.target.result
        }
      }
      reader.readAsDataURL(this.file)
    },
    // 图片保存到对象存储
    imgStorage (img, type, cb) {
      let that = this
      let data = {
        content: img,
        type: 2,
        model: 1
      }
      if (!/^(data:\s*image\/(\w+);base64,)/.test(img)) {
        cb && cb()
        return false
      }
      this.$axios.post('/api/mobile.php?s=/WxUrlContent/save_content', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          switch (type) {
            case 'avatar':
              that.imageUrl = data.data.content
              break
            case 'editImg':
              that.editImageUrl = data.data.content
              break
          }
          cb && cb()
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
        return false
      })
    },
    beforeAvatarUpload (file) {
      const typeReg = /image\/(jpeg|jpg|png)/i
      const isJPG = typeReg.test(file.type)
      const isLt1K = file.size / 1024 < 10240

      if (!isJPG) {
        this.$vux.toast.text('上传头像图片只能是 JPG 格式!', 'top')
      }
      if (!isLt1K) {
        this.$vux.toast.text('上传头像图片大小不能超过 10 MB!')
      }
      return isJPG && isLt1K
    },
    // 编辑 Popup 显示/隐藏
    editEve (val) {
      if (val === 'show') {
        // console.log(this.originData)
        this.editHtml = this.originData.outerHTML

        // console.log(this.editTab)
        this.navTo(this.editTab)
        switch (this.editTab) {
          case 'text':
            this.text = this.editHtml
            this.$nextTick(() => {
              // 忽略 fastClick 的检测
              this.traversal(document.querySelectorAll('.vue-html5-editor .content'), (dom) => {
                if (!/needsclick/.test(dom.classList)) {
                  dom.classList.add('needsclick')
                  document.querySelectorAll('.content.needsclick')[0].children[0].classList.remove('hide')
                }
              })
            })
            break
          case 'img':
            this.editImageUrl = this.originData.src
            break
          case 'videl':
            this.videoUrl = this.originData.src
            break
        }
        // 禁止滚动
        // document.body.addEventListener('touchmove', this.tmhandle, { passive: false })
      } else if (val === 'hide') {
        // document.body.removeEventListener('touchmove', this.tmhandle, { passive: false })
      }
    },
    tmhandle (e) {
      let eve = e || window.event
      eve.preventDefault()
    },
    // 选择模板
    chooseTpl (tpl, type) {      
      this.isSaveToTpl = false
      switch (type) {
        case 'text':
          this.text = tpl
          break
        case 'img':
          this.editImageUrl = tpl
      }
    },
    // 删除模板
    delTpl (id) {
      let that = this
      let forData = () => {
        switch (that.editTab) {
          case 'text':
            return that.tplData
          case 'img':
            return that.tplImgData
          case 'video':
            return that.tplVideoData
        }
      }

      forData().forEach((item, index) => {
        if (item.id === id) {
          let that = this
          let type = () => {
            switch (that.editTab) {
              case 'text':
                return 1
              case 'img':
                return 2
              case 'video':
                return 3
            }
          }
          
          let data = {
            type: type(),
            id
          }
          that.$vux.loading.show({
            text: '删除中'
          })

          this.$axios.post('/api/mobile.php?s=/WxUrlContent/del_content_data', data)
          .then(res => {
            let data = res.data
            that.$vux.loading.hide()
            if (data.code === 1) {
              that.$vux.toast.show({
                text: data.msg
              })
              forData().splice(index, 1)
            } else if (data.code === 0) {
              that.$vux.toast.show({
                text: data.msg
              })
            }
          })
          .catch(err => {
            that.$vux.loading.hide()
            console.log(err)
            console.log('request fail')
          })
        }
      })
    },
    // 获取模板列表
    getTplData (type) {
      let that = this
      let data = {
        type
      }

      this.$axios.post('/api/mobile.php?s=/WxUrlContent/get_content', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          switch(type) {
            case 1:
              data.data.map((item, i) => {
                data.data[i].data = that.unescape(item.data)
                that.tplData.push(data.data[i])
              })
              break
            case 2:
              data.data.map((item, i) => {
                that.tplImgData.push(item)
              })
              break
            case 3:
              break
          }
        } else {
          console.log(data.msg)
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    // 模板入库
    saveContent (content, type, model, cb) {
      let that = this
      let data = {
        content,
        type,
        model
      }
      this.$vux.loading.show({
        text: '保存模板中'
      })

      this.$axios.post('/api/mobile.php?s=/WxUrlContent/save_content', data)
      .then(res => {
        let data = res.data
        that.$vux.loading.hide()
        if (data.code === 1) {
          if (type === 2) {
            that.editImageUrl = data.data.content
          }
          cb && cb()
        } else {
          that.$vux.toast.show({
            text: data.msg
          })
        }
      })
      .catch(err => {
        that.$vux.loading.hide()
        console.log(err)
        console.log('request fail')
      })
    },
    confirm () {
      let that = this
      switch (this.editTab) {
        case 'text': // 文本内容
          if (!/</.test(this.text[0])) {
            this.text = `<span class="needsclick">${this.text}</span>`
          }
          this.text = this.text.replace('<p><br></p>', '') // 过滤掉多余的标签
          if (this.isSaveToTpl) { // 存为模板
            this.saveContent(this.text, 1, 2)
          }
          if (/img|video/.test(this.originData.tagName.toLowerCase())) { // img|video 转 text
            this.originData.parentNode.innerHTML = this.text
          } else { // 文本内容修改
            this.originData.innerHTML = this.text
            this.originData.innerHTML = this.originData.lastChild.innerHTML
            this.originData.before(this.originData, this.originData)
          }
          this.text = ''
          break
        case 'img': // 图片内容
          let that = this
          if (this.isSaveToTpl) { // 存为模板
            this.saveContent(this.editImageUrl, 2, 2, () => {
              this.createImg()
            })
          } else {
            this.imgStorage(this.editImageUrl, 'editImg', () => {
              that.createImg()
            })
          }
          break
        case 'video': // 视频内容
          if (!/img|video/.test(this.originData.tagName.toLowerCase())) { // 文本内容转视频内容
            let videoNode = document.createElement('video')
            videoNode.src = this.videoUrl
            videoNode.controls = 'controls'
            videoNode.style.width = '100%'
            videoNode.addEventListener('play', (e) => {
              that.bindEditEve(e)
            })
            this.originData.innerHTML = ''
            this.originData.appendChild(videoNode)
          } else if (/video/.test(this.originData.tagName.toLowerCase())) { // 视频内容修改
            this.originData.src = this.videoUrl
          } else if (/img/.test(this.originData.tagName.toLowerCase())) { // 视频内容转图片内容
            let videoNode = document.createElement('video')
            videoNode.src = this.videoUrl
            videoNode.controls = 'controls'
            videoNode.style.width = '100%'
            videoNode.addEventListener('play', (e) => {
              that.bindEditEve(e)
            })
            this.originData.before(videoNode, this.originData)
            this.originData.remove()
          }
          this.videoUrl = ''
          break
      }
      this.editPop = false
    },
    createImg () {
      if (!/img|video/.test(this.originData.tagName.toLowerCase())) { // 文本内容转图片内容
        let imgNode = document.createElement('img')
        imgNode.src = this.editImageUrl
        imgNode.style.width = '100%'
        this.originData.innerHTML = ''
        this.originData.appendChild(imgNode)
      } else if (/img/.test(this.originData.tagName.toLowerCase())) { // 图片内容修改
        this.originData.src = this.editImageUrl
      } else if (/video/.test(this.originData.tagName.toLowerCase())) { // 视频内容转图片内容
        let imgNode = document.createElement('img')
        imgNode.src = this.editImageUrl
        imgNode.style.width = '100%'
        this.originData.before(imgNode, this.originData)
        this.originData.remove()
      }
      this.editImageUrl = ''
    },  
    navTo (link) {
      this.editTab = link
      switch (link) {
        case 'text':
          this.textContainer = true
          this.imgContainer = false
          this.videoContainer = false
          if (/img|video/.test(this.originData.tagName.toLowerCase())) { // img|video 转 text,清空this.text
            this.$nextTick(() => {
              this.text = ''
            })
          }
          this.tplData = []
          this.getTplData(1)
          break
        case 'img':
          this.imgContainer = true
          this.textContainer = false
          this.videoContainer = false
          this.tplImgData = []
          this.getTplData(2)
          break
        case 'video':
          this.videoContainer = true
          this.textContainer = false
          this.imgContainer = false
          break
        default:
          break
      }
    },
    closeEditPop () {
      this.editPop = false
      this.textContainer = false
      this.imgContainer = false
      this.videoContainer = false
    },
    editType (type) {
      this.editPop = true
      this.textContainer = true
      this.editTab = type
    },
    handleVideoSuccess (ev) {
      const _this = this
      const inputDOM = ev.target || ev.dataTransfer
      this.file = inputDOM.files[0]
      // if (!this.beforeVideoUpload(this.file)) {
      //     return false
      // }
      this.$vux.loading.show({
        text: 'Loading'
      })
      var reader = new FileReader()
      _this.videoUrl = ''
      reader.onload = function (ev) {
        _this.$nextTick(() => {
          _this.videoUrl = ev.target.result
          _this.$vux.loading.hide()
        })
      }
      reader.readAsDataURL(this.file)
    },
    beforeVideoUpload (file) {
      const typeReg = /image\/(jpeg|jpg|png)/i
      const isJPG = typeReg.test(file.type)
      const isLt1K = file.size / 1024 < 10240

      if (!isJPG) {
        this.$vux.toast.text('上传头像图片只能是 JPG 格式!', 'top')
      }
      if (!isLt1K) {
        this.$vux.toast.text('上传头像图片大小不能超过 10 MB!')
      }
      return isJPG && isLt1K
    },
    updateData (val) {
      this.text = val
      this.$nextTick(() => {
        // 忽略 fastClick 的检测
        this.traversal(document.querySelectorAll('.vue-html5-editor .content'), (dom) => {
          if (!/needsclick/.test(dom.classList)) {
            dom.classList.add('needsclick')
          }
        })
      })
    },
    // 遍历 DOM
    traversal (dom, cb) {
      let len = dom.length
      let d = null
      for (let i = 0; i < len; i++) {
        d = dom[i]
        cb && cb(d)
        if (d.children) {
          this.traversal(d.children, cb)
        }
      }
    },
    beforeArtBox () {
      const catchContainer = this.$refs.catchContainer
      const catchContent = this.$refs.catchContent
      const article = this.$refs.article
      catchContainer.style.display = 'block'

      if (this.originData) this.originData.className = ''
      catchContent.innerHTML = ''      
      article.before(catchContainer, article) /** 把Dom 从嵌套标签抽离到 $refs.article 容器 */
      catchContainer.style.display = 'none'      
    },
    // 设置规则
    ruleConfirm () {
      let that = this
      if (this.showRule) {
        this.saveArt()
      } else {
        this.$vux.confirm.show({
          title: '要去设置红包吗？',
          content: '设置红包更有利于文章扩散与阅读哦',
          onCancel () {
            that.saveArt()
          },
          onConfirm () {
            that.showRule = true

            // 滚动到红包设置
            setTimeout(function() {
              // let scrollH = document.getElementById('vux_view_box_body').scrollHeight          
              let curroffTop = document.getElementById('setRule').offsetTop
              // let toTop = scrollH - curroffTop
              document.getElementById('vux_view_box_body').scrollTop = curroffTop          
            }, 200)
          }
        })
      }
    },
    // 保存文章
    saveArt () {
      let that = this
      let query = this.$route.query

      // if (!this.shareDescription) {
      //   that.$vux.toast.text('请填写微信分享描述')
      //   return false
      // }   

      this.beforeArtBox()

      let data = {
        name: this.artInfo.name,
        article: this.fromUser,
        img: this.imageUrl,
        content: this.$refs.article.innerHTML,
        max_money: this.max_money,
        reward: this.reward,
        red: this.red,
        all_num: this.all_num,
        scroll: this.scroll,        
        stop: this.stop,
        desc: this.shareDescription,
        map: this.map
      }

      if (query && query.id) {
        data.aid = query.id
      }

      if (query && query.from === 'artList') { // 文章编辑
        this.$axios.post('/api/mobile.php?s=/WxUrlContent/mod_art', data)
        .then(res => {
          let data = res.data
          console.log(data)
          if (data.code === 1) {
            that.$vux.confirm.show({
              title: '提示',
              content: '保存成功，立即前往文章列表查看',
              onCancel () {
                console.log('cancel')
              },
              onConfirm () {
                that.$router.push(`/Article`)
              }
            })          
          } else if (data.code === 0) {
            that.$vux.toast.text(data.msg)
          }
        })
        .catch(err => {
          console.log(err)
          console.log('request fail')        
        })  
      } else { // 新增
        this.$axios.post('/api/mobile.php?s=/WxUrlContent/save_art', data)
        .then(res => {
          let data = res.data
          console.log(data)
          if (data.code === 1) {
            that.$vux.confirm.show({
              title: '提示',
              content: '保存成功，立即前往文章列表查看',
              onCancel () {
                console.log('cancel')
              },
              onConfirm () {
                that.$router.push(`/Article`)
              }
            })          
          } else if (data.code === 0) {
            that.$vux.toast.text(data.msg)
          }
        })
        .catch(err => {
          console.log(err)
          console.log('request fail')        
        })    
      }
    },
    // 编辑发布人
    editUser () {
      this.showUserCon = true
    },
    onConfirmUser (val) {
      this.fromUser = val
    },
    onShowConfirmUser () {
      this.$refs.confirmUser.setInputValue(this.fromUser)
    }
  }
}
</script>

<style>
  .m-article-detail img {
    max-width: 100%;
  }
</style>
<style lang="less" scoped>
@import '../styles/reset.less';
  .save-art {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    .confirm {
      border-radius: 0;
      background-color: @weuiColorPrimary;
    }
  }
  a {
    color: initial;
  }
  .m-article-detail-container {
    padding: 10px;
    color: #666;
    box-sizing: border-box;
    background-color: #fff;
    input,
    textarea {
      outline: none;
      // -webkit-appearance: none;
      // appearance: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
  }
  .m-article-wrapper {
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
  }
  .m-article-detail {
    position: relative;
    padding: 20px 30px;
    text-align: center;
    p {
      margin: 10px auto;
    }
    img {
      display: block;
      max-width: 100%;
    }
    .hide {
      display: none;
    }
  }
  .m-select-section {
    display: none;
    .border {
      padding: 10px;
      border: 1px dotted #f00;
      p {
        margin: 0 auto;
      }
    }
  }
  .m-edit-nav {
    display: flex;
    border: 1px solid #c4c4c4;
    margin-top: 2px;
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 999;
    background-color: #f2f2f2;
    .nav-item {
      color: #666;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      height: auto;
      padding: 5px 0;
      border-right: 1px solid #4565ae;
      font-size: 14px;
      line-height: 1;
      &:last-child {
        border-right: none;
      }
      &::after {
        border-radius: 0;
      }
      .word {
        margin-top: 5px;
      }
    }
  }
  .m-tips {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px;
    text-align: center;
    color: #ff9933;
    background-color: #fff;
  }
   .m-upload-wrap {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 20px auto;
    background-color: #fff;
    // overflow: hidden;
    box-sizing: border-box;
    .upload {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0;
    }
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    .img {
        width: 100%;
        height: 100%;
    }
  }
  .u-help-block {
    padding: 0 10px;
    font-size: 14px;
    color: #999;
  }
  .m-publisher {
    padding: 3px 0;
    text-align: center;
    background-color: #fff;
    .publisher {
      color: #409EFF;
    }
  }
.m-config {
    font-size: 14px;
    h2,
    h4 {
        margin: auto;
        color: #333;
    }
}
.m-config-section {
    padding: 15px 0;
    h2 {
        font-size: 17px;
    }
    h4 {
        font-size: 15px;
    }
    .tips {
        font-size: 14px;
        font-weight: normal;
        color: #999;
    }
    .check-wrap {
        margin: 5px 0;
        .weui-cells_radio {
            font-size: 14px;
        }
    }
    .width-short {
        display: inline-block;
        width: 60px;
    }
    input {
        padding: 5px;
    }
    .sub-section {
        margin-bottom: 10px;
    }
    .item {
        margin-top: 5px;
        margin-bottom: 10px;
    }
}
.g-page-container {
  box-sizing: border-box;
}
.m-top-nav {
  .icon {
    width: 14px;
    height: 14px;
  }
  a.vux-button-group-current {
    background-color: #4565ae;
  }
  a.vux-button-tab-item-first::after {
    border-color: #4565ae;
  }
  a.vux-button-tab-item-middle::after {
    border-color: #4565ae;
  }
  a.vux-button-tab-item-last::after {
    border-color: #4565ae;
  }
}
.m-edit-group {
  .check-save {
    /deep/ .weui-icon {
      font-size: 16px;
    }
    /deep/ i.weui-icon-success {
      color: #4565ae;
    }
    /deep/ .weui-icon-success:before, 
    .weui-icon-success-circle:before {
      color: #4565ae;
    }
  }
  .btn-group {
    padding: 10px;
  }
  .weui-btn_primary {
    background-color: #4565ae;
  }
  .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before {
    color: #4565ae;
  }
}
.m-tpl-container {
  padding: 5px;
  .section-title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 400;
    color: #333;
  }
  .tpl-item {
    margin-bottom: 5px;
    padding: 10px;
    background-color: #fff;
  }
  .text {
    color: #666;
  }
  .operating {
    font-size: 14px;
    text-align: right;
    color: #999;
  }
  .icon {
    width: 14px;
    height: 14px;
  }
}
.m-edit-group {
  .check-save {
    /deep/ .weui-icon {
      font-size: 16px;
    }
    /deep/ .weui-icon-success {
      color: #4565ae;
    }
    /deep/ .weui-icon-success:before, 
    /deep/ .weui-icon-success-circle:before {
      color: #4565ae;
    }
  }
  .btn-group {
    padding: 10px;
  }
  .upload-wrap {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 20px auto;
    background-color: #fff;
    // overflow: hidden;
    box-sizing: border-box;
    .upload {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0;
    }
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    .img {
        width: 100%;
        height: 100%;
    }
  }
  .help-block {
    padding: 0 10px;
    font-size: 14px;
    color: #999;
  }
}
.m-tpl-container {
  padding: 5px;
  .section-title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 400;
    color: #333;
  }
  .tpl-item {
    margin-bottom: 5px;
    padding: 10px;
    background-color: #fff;
  }
  .text {
    color: #666;
  }
  .operating {
    font-size: 14px;
    text-align: right;
    color: #999;
  }
  .icon {
    width: 14px;
    height: 14px;
  }
  .preview {
    max-width: 200px;
  }
}
.m-edit-group {
  .weui-btn_primary {
    background-color: #4565ae;
  }
  .check-save {
    font-size: 14px;
    /deep/ .weui-icon {
      font-size: 16px;
    }
    /deep/ i.weui-icon-success {
      color: #4565ae;
    }
    /deep/ .weui-icon-success:before, 
    .weui-icon-success-circle:before {
      color: #4565ae;
    }
  }
  .btn-group {
    padding: 10px;
  }
  .upload-wrap {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 20px auto;
    background-color: #fff;
    // overflow: hidden;
    box-sizing: border-box;
    .upload {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0;
    }
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    video {
        width: 100%;
        height: 100%;
    }
  }
  .help-block {
    padding: 0 10px;
    font-size: 14px;
    text-align: center;
    color: #999;
  }
}
.m-tpl-container {
  padding: 5px;
  .section-title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 400;
    color: #333;
  }
  .tpl-item {
    margin-bottom: 5px;
    padding: 10px;
    background-color: #fff;
  }
  .text {
    color: #666;
  }
  .operating {
    font-size: 14px;
    text-align: right;
    color: #999;
  }
  .icon {
    width: 14px;
    height: 14px;
  }
  .preview {
    max-width: 200px;
  }
}
 .quill-editor {
    height: 350px;
 }
.pop-footer {
    margin-top: 20px;
}
</style>
<style>
@import '../styles/rich_media.css';
.rich_media_content {
  padding-bottom: 40px;
}
</style>
<link rel="stylesheet" href="//res.wx.qq.com/mmbizwap/zh_CN/htmledition/style/page/middle/middle476532.css">

