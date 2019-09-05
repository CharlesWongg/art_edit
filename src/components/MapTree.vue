<template>
  <div style="padding-top: 46px;">
    <iframe id="t-ifm" :style="`width: 100%; height: ${clientHeight}px;`" :src="ifUrl"></iframe>
  </div>
</template>

<script>
import { base64 } from 'vux'

export default {
  data () {
    return {
      ifUrl: ''
    }
  },
  computed: {
    clientHeight: function () {
      let ch = parseInt(document.body.clientHeight) - 100
      return ch
    }
  },
  mounted () {
    document.body.addEventListener('touchmove', this.tmhandle, { passive: false })
    let u = this.$route.query.u
    if (u) {
      this.ifUrl = base64.decode(u)
      console.log(this.ifUrl)
    }
  },
  methods: {
    tmhandle (e) {
      let eve = e || window.event
      eve.preventDefault()
    }
  },
  destroyed () {
    document.body.removeEventListener('touchmove', this.tmhandle, { passive: false })
  }
}
</script>

<style scope lang="less">
@import '../styles/reset.less';
</style>
