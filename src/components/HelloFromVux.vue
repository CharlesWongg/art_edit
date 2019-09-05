<template>
  <div>
    <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true">
      <span>{{ title }}</span>
      <x-icon slot="overwrite-left" type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
    </x-header>
    <group>
      <cell title="cell-+--" value="hello" is-link link="/fromVux"></cell>
      <cell-box is-link>
        cell-box long long long long long long long
      </cell-box>
      <cell-box>
        cell-box hello world hello world hello world
      </cell-box>
      <cell title="cell" value="hello" is-link link="/test"></cell>
    </group>   
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus" @on-click-menu="tranClick" show-cancel></actionsheet>
    </div>    
  </div>
</template>

<script>
import { XHeader, Actionsheet, TransferDom, Group, Cell, CellBox } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Actionsheet,
    Group,
    Cell,
    CellBox
  },
  data () {
    return {
      title: '首页',
      menus: {
        menu1: '修改信息',
        menu2: '退出登录'
      },
      showMenus: false
    }
  },
  methods: {
    tranClick (key) {
      switch (key) {
        case 'menu1':
          console.log(this.menus[key])
          break
        case 'menu2':
          console.log('退出登录操作~')
          break
      }
    }
  }
}
</script>

<style>
.overwrite-title-demo {
  margin-top: 5px;
}
</style>
