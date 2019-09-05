<template>
  <div class="g-page-container" style="padding-top: 46px;">
    <!-- 导航 -->
    <button-tab class="m-top-nav">
      <button-tab-item selected @on-item-click="navTo('text')">
        <v-icon name="pen" class="icon"></v-icon>
        <span>插入文字</span>
      </button-tab-item>
      <button-tab-item @on-item-click="navTo('img')">
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
      <group class="textarea-group">
        <x-textarea placeholder="占位用" show-counter :max="200" v-model="text"></x-textarea>
      </group>
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
          <p class="text">{{item.text}}</p>
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
      text: '',
      cid: 1003,
      isSaveToTpl: true,
      tplData: [
        {
          cid: 1001,
          text: '城镇居民超生一个子女的，对夫妻双方分别各征收社会抚养费148773元。'
        },
        {
          cid: 1002,
          text: '有配偶又与他人生育的，属城镇居民的，双方各征收社会抚养费297546元；属农村居民的，双方各征收社会抚养费185604元。'
        },
        {
          cid: 1003,
          text: '农村居民超生一个子女的，对夫妻双方分别各征收社会抚养费92802元。'
        }
      ]
    }
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
      if (this.text) {
        if (this.isSaveToTpl) {
          this.tplData.unshift({
            cid: ++this.cid,
            text: this.text
          })
        }
        this.text = ''
        this.$router.push('/articleedit')
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
</style>
