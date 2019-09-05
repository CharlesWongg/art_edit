<template>
  <div style="padding-top: 46px;">
    <group label-width="90px" label-margin-right="2em" label-align="justify">
      <x-input :clickFocus="true" title="手机号码" v-model="form.account" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
      <x-input :clickFocus="true" title="密码" type="password" placeholder="请输入密码" v-model="form.pwd" :min="6"></x-input>
      <x-input :clickFocus="true" title="确认密码" v-model="form.sec_pwd" type="password" placeholder="请确认登录密码" :equal-with="form.pwd"></x-input>
      <x-input :clickFocus="true" title="机构名称" placeholder="请输入机构名称"v-model="form.company" :required="true"></x-input>
      <x-input :clickFocus="true" title="验证码" v-model="form.verify" class="verify" :icon-type="iconVerType" @click.native="changeVerify($event)">
        <img class="verify-img" slot="right-full-height" :src="verify">
      </x-input>    
      <x-input :clickFocus="true" title="手机验证码" class="weui-vcode" v-model="form.code">
        <x-button slot="right" type="primary" @click.native="codEvent" :disabled="coding" mini>{{ code_text }}</x-button>
      </x-input>
      <div class="r-service-info">
        <template v-if="isRead">
          <x-icon type="ios-circle-filled" size="24" @click="readEve"></x-icon>
        </template>
        <template v-else>
          <x-icon type="ios-circle-outline" size="24" @click="readEve"></x-icon>
        </template>
        <span style="margin-left: 8px;" @click="readEve">已同意并阅读</span>
        <router-link to="/ServiceTerm" style="color: #409EFF;">服务条款</router-link>
      </div>           
    </group>
    <div class="footer">
      <x-button type="primary" @click.native="submit" :show-loading="submiting">提交</x-button>
    </div>       
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
      iconAccType: '',
      iconPwdType: '',
      iconVerType: '',
      submiting: false,
      isRead: true,
      form: {
        account: '',
        pwd: '',
        sec_pwd: '',
        company: '',
        verify: '',
        code: '',
        flag: 'reg_auth'
      },
      loading: false,
      coding: false,
      code_text: '获取验证码',
      t: new Date().getTime()
    }
  },
  computed: {
    verify () {
      return '/api/mobile.php?s=/public/verify/t/' + this.t
    }
  },
  methods: {
    // 更新验证码
    changeVerify (e) {
      if (e.target.localName === 'img') {
        this.t = new Date().getTime()
      }
    },
    submit () {
      let that = this
      let data = {
        tel: this.form.account,
        code: this.form.code,
        pwd: this.form.pwd,
        checkPwd: this.form.sec_pwd,
        company: this.form.company
      }

      if (!this.isRead) {
        this.$vux.toast.show({
          text: '请阅读并同意服务条款',
          type: 'warn'
        })
        return false
      }

      this.submiting = true
      this.$axios.post('/api/mobile.php?s=/public/register', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.$vux.toast.text(data.msg)
          setTimeout(() => {
            that.$router.push('/Login')
          }, 1500)
        } else if (data.code === 0) {
          that.$vux.toast.show({
            text: data.msg,
            type: 'warn'
          })
          that.t = new Date().getTime()
        }
        this.submiting = false
      })
      .catch(err => {
        this.submiting = false
        console.log(err)
        console.log('request fail')
      })
    },
    // 获取手机验证码
    codEvent () {
      let that = this
      let data = {
        mobile: this.form.account,
        verify: this.form.verify,
        flag: this.form.flag
      }

      if (!this.isRead) {
        that.$vux.toast.show({
          text: '请阅读服务条款',
          type: 'warn'
        })
        return false
      }

      if (this.coding) {
        return false
      }
      var time = 60
      var timer = setInterval(() => {
        this.code_text = time + '秒后重新获取'
        this.coding = true
        time--
        if (time === 0) {
          this.code_text = '获取验证码'
          this.coding = false
          clearInterval(timer)
        }
      }, 1000)
      this.$axios.post('/api/mobile.php?s=/public/mobile_auth', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.$vux.toast.text(data.msg)
        } else if (data.code === 0) {
          that.$vux.toast.show({
            text: data.msg,
            type: 'warn'
          })
          that.code_text = '获取验证码'
          that.coding = false
          clearInterval(timer)
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    readEve () {
      this.isRead = !this.isRead
    }
  }
}
</script>

<style scope lang="less">
@import '../styles/reset.less';
.footer {
    padding: 15px;
    margin-top: 20px;
}
.vux-x-input-right-full {
    position: relative;
    .verify-img {
        height: 38px;
        margin-top: 50%;
        height: 38px;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        right: 0;    
    }
}
.r-service-info {
  display: flex;
  margin: 14px 14px 20px;  
}
.vux-x-icon {
  fill: #409EFF;
}
</style>
