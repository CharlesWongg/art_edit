<template>
  <div class="m-artlib">
    文章库
  </div>
</template>

<script>
import { XInput, Group, XButton } from 'vux'

export default {
  components: {
    XInput,
    XButton,
    Group
  },
  data () {
    return {
      form: {
      }
    }
  },
  methods: {
    tranClick (key) {
      return false
    }
  }
}
</script>

<style scope lang="less">
@import '../styles/reset.less';
@import '../styles/1px.less';
</style>
