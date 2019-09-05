<template>
  <div class="g-page-container" style="padding-top: 46px;">
    <!-- 导航 -->
    <button-tab class="m-top-nav">
      <button-tab-item @on-item-click="navTo('text')">
        <v-icon name="pen" class="icon"></v-icon>
        <span>插入文字</span>
      </button-tab-item>
      <button-tab-item @on-item-click="navTo('img')" selected>
        <v-icon name="photo-video" class="icon"></v-icon>
        <span>插入图片</span>
      </button-tab-item>
      <button-tab-item @on-item-click="navTo('video')">
        <v-icon name="video" class="icon"></v-icon>
        <span>插入视频</span>
      </button-tab-item>
    </button-tab>
    <!-- 编辑区 -->
    <div class="m-edit-group">
      <div class="textarea-group">
      </div>
      <div class="upload-wrap vux-1px">
          <input type="file" class="upload" @change="handleAvatarSuccess" ref="inputer" accept="image/png,image/jpeg,image/jpg"/>
          <img class="img" v-if="imageUrl" :src="imageUrl" />
          <v-icon v-else name="plus" class="icon"></v-icon>
      </div>
      <p class="help-block">只能上传jpg/png文件,尺寸：340*340，图片大小不得大于100kb</p>
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
          <img class="preview" :src="item.src" alt="">
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
      imageUrl: '',
      text: '',
      cid: 1003,
      isSaveToTpl: true,
      tplData: [
        {
          cid: 1001,
          src: 'https://placekitten.com/800/400'
        },
        {
          cid: 1002,
          src: 'https://placekitten.com/1200/900'
        },
        {
          cid: 1003,
          src: 'https://placekitten.com/120/90'
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
      if (this.imageUrl) {
        if (this.isSaveToTpl) {
          this.tplData.unshift({
            cid: ++this.cid,
            src: this.imageUrl
          })
        }
        this.imageUrl = ''
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
      if (!this.beforeAvatarUpload(this.file)) {
        return false
      }
      var reader = new FileReader()
      reader.onload = function (ev) {
        _this.imageUrl = ev.target.result
      }
      reader.readAsDataURL(this.file)
    },
    beforeAvatarUpload (file) {
      const typeReg = /image\/(jpeg|jpg|png)/i
      const isJPG = typeReg.test(file.type)
      const isLt1K = file.size / 1024 < 100

      if (!isJPG) {
        this.$vux.toast.text('上传头像图片只能是 JPG 格式!', 'top')
      }
      if (!isLt1K) {
        this.$vux.toast.text('上传头像图片大小不能超过 100 KB!')
      }
      return isJPG && isLt1K
    }
  }
}
</script>

<style lang="less" scoped>
.weui-btn_primary {
  background-color: #4565ae;
}
.g-page-container {
  box-sizing: border-box;
}
.m-top-nav {
  font-size: 14px;
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
</style>
