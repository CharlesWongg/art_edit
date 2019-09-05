<template>
  <div style="padding-top: 46px;">
    <div class="logo">
      <img src="../assets/wcm_logo.png" alt="" class="logoimg">
    </div>
    <group label-width="60px" label-margin-right="2em" label-align="justify">
      <x-input :clickFocus="true" title="账号" v-model="form.account" name="mobile" placeholder="请输入手机号码" :icon-type="iconAccType" keyboard="number" is-type="china-mobile" :required="true"></x-input>
      <x-input :clickFocus="true" title="密码" type="password" placeholder="请输入密码" novalidate v-model="form.pwd" :icon-type="iconPwdType" :min="6" :required="true"></x-input>
      <x-input :clickFocus="true" title="验证码" v-model="form.verify" class="verify" :icon-type="iconVerType" @click.native="changeVerify($event)">
        <img slot="right-full-height" :src="verify">
      </x-input>      
    </group>
    <div class="regist-forget">
        <router-link to="/Register">注册账号</router-link>
        <i class="vert-line"></i>
        <router-link to="/Forget">忘记密码？</router-link>
    </div>
    <div class="footer">
      <x-button type="primary" @click.native="login">登录</x-button>
    </div>       
  </div>
</template>

<script>
import { XInput, Group, XButton } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    XInput,
    XButton,
    Group
  },
  data () {
    return {
      iconAccType: '',
      iconPwdType: '',
      iconVerType: '',
      form: {
        account: '',
        pwd: '',
        verify: ''
      },
      t: new Date().getTime()
    }
  },
  computed: {
    verify () {
      return '/api/mobile.php?s=/public/verify/t/' + this.t
    },
    ...mapState({
      token: state => state.vux.token
    })
  },
  methods: {
    tranClick (key) {
      return false
    },
    // 更新验证码
    changeVerify (e) {
      if (e.target.localName === 'img') {
        this.t = new Date().getTime()
      }
    },
    login () {
      let that = this

      if (this.form.account.length === 0) {
        this.iconAccType = 'error'
        this.$vux.toast.show({
          text: '账号不能为空',
          type: 'warn'
        })
        return false
      }

      if (this.form.pwd.length === 0) {
        this.iconPwdType = 'error'
        this.$vux.toast.show({
          text: '密码不能为空',
          type: 'warn'
        })
        return false
      }

      // 登录API
      this.$axios.post('/api/mobile.php?s=/Public/login.html', {
        username: that.form.account,
        password: that.form.pwd,
        verify: that.form.verify
      })
      .then(res => {
        console.log('sucees')
        console.log(res.data)
        console.log(that)
        if (res.data.status === 0) {
          that.$vux.toast.show({
            text: res.data.info,
            type: 'warn'
          })
          that.t = new Date().getTime()
          return false
        }
        if (res.data.code === 1) { // 登录成功
          // 保存token
          this.updateToken(res.data.data.token)
          that.$router.push('/Home')
        } else {
          that.$vux.toast.text(res.data.msg)
          that.t = new Date().getTime()
        }
      })
      .catch(err => {
        console.log(err)
        console.log(err.status)
        console.log(err.statusText)
        console.log('request fail')
      })
    },
    ...mapActions([
      'updateDemoPosition',
      'updateToken'
    ])
  }
}
</script>

<style scope lang="less">
@import '../styles/reset.less';
.overwrite-title-demo {
  margin-top: 5px;
}
.regist-forget {
    text-align: right;
    padding: 10px 15px;
    margin-top: 20px;
    font-size: 12px;
    a {
        color: #666;
        border-right: 1px solid #666;
        padding-right: 6px;
        &:last-child {
            border-right: unset;
            padding-left: 3px;
        }
    }
}
.footer {
    padding: 15px;
    margin-top: 20px;
}
.logo {
    text-align: center;
    padding: 30px 0 20px;
}
</style>
