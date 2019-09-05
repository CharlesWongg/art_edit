<template>
  <div class="g-page-container" style="padding-top: 46px;">
    <!-- 导航 -->
    <button-tab class="m-top-nav">
      <button-tab-item @on-item-click="navTo('text')">
        <v-icon name="pen" class="icon"></v-icon>
        <span>插入文字</span>
      </button-tab-item>
      <button-tab-item @on-item-click="navTo('img')">
        <v-icon name="photo-video" class="icon"></v-icon>
        <span>插入图片</span>
      </button-tab-item>
      <button-tab-item @on-item-click="navTo('video')" selected>
        <v-icon name="video" class="icon"></v-icon>
        <span>插入视频</span>
      </button-tab-item>
    </button-tab>
    <!-- 编辑区 -->
    <div class="m-edit-group">
      <div class="textarea-group">
      </div>
      <div class="upload-wrap vux-1px">
          <input type="file" class="upload" @change="handleAvatarSuccess" ref="inputer" accept="mp4,avi,mov,rmvb"/>
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
    <div class="m-tpl-container" v-if="tplData.length">
      <h2 class="section-title">选择模板</h2>
      <ul class="tpl-list">
        <li class="tpl-item" v-for="item in tplData" :key="item.cid">
          <video class="preview" :src="item.src" controls></video>
          <div class="operating" @click="delTpl(item.cid)">
            <v-icon name="trash" class="icon"></v-icon>
            <span>删除</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {ButtonTab, ButtonTabItem, XTextarea, Group, XInput, CheckIcon, XButton} from 'vux'

export default {
  name: 'ArticleTplText',
  components: {
    ButtonTab,
    ButtonTabItem,
    XTextarea,
    Group,
    XInput,
    CheckIcon,
    XButton
  },
  data () {
    return {
      videoUrl: '',
      imageUrl: '',
      text: '',
      cid: 1003,
      isSaveToTpl: true,
      tplData: [
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
      ]
    }
  },
  mounted () {
  },
  methods: {
    delTpl (cid) {
      this.tplData.forEach((item, index) => {
        if (item.cid === cid) {
          this.tplData.splice(index, 1)
        }
      })
    },
    confirm () {
      if (this.videoUrl) {
        if (this.isSaveToTpl) {
          this.tplData.unshift({
            cid: ++this.cid,
            src: this.videoUrl
          })
        }
        this.videoUrl = ''
        this.$router.push('/articleEdit')
      }
    },
    navTo (link) {
      switch (link) {
        case 'text':
          this.$router.push('articletpltext')
          break
        case 'img':
          this.$router.push('articletplimg')
          break
        case 'video':
          this.$router.push('articletplvideo')
          break
        default:
          break
      }
    },
    handleAvatarSuccess (ev) {
      const _this = this
      const inputDOM = ev.target || ev.dataTransfer
      this.file = inputDOM.files[0]
    //   if (!this.beforeAvatarUpload(this.file)) {
    //       return false
    //   }
      var reader = new FileReader()
      reader.onload = function (ev) {
        _this.videoUrl = ev.target.result
      }
      reader.readAsDataURL(this.file)
    },
    beforeAvatarUpload (file) {
      const typeReg = /(ogg|mp4|rmvb|avi|mov)/i
      const isJPG = typeReg.test(file.type)
      const isLtSize = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$vux.toast.text('上传头像图片只能是 JPG 格式!', 'top')
      }
      if (!isLtSize) {
        this.$vux.toast.text('上传头像图片大小不能超过 1 MB!')
      }
      return isJPG && isLtSize
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
