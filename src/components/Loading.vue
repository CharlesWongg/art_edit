<template>
  <div style="padding-top: 46px;">
    <br />
    <p style="text-align:center;">
      <span style="vertical-align:middle;display:inline-block;font-size:14px;">加载中&nbsp;&nbsp;</span><inline-loading></inline-loading>
    </p>          
  </div>
</template>

<script>
import { InlineLoading } from 'vux'

export default {
  components: {
    InlineLoading
  },
  data () {
    return {
      t: ''
    }
  },
  mounted () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      let that = this

      this.$axios.post('/api/mobile.php?s=/index/index', {})
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.$router.push('/Home')
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

<style scope lang="less">
</style>
