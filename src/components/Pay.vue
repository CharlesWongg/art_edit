<template>
  <div style="padding-top: 46px;">
    <div class="pay-header">
        <span>当前余额（元）</span>
        <p class="money">{{shopmember['money']/100 || 0}}</p>
    </div>
    <div class="checker-box">
        <checker
        v-model="money"
        default-item-class="m-pay-item"
        selected-item-class="m-pay-item-selected"
        type="radio"
        >
            <checker-item @on-item-click="checkerClk" :class="{'m-pay-item-selected' : item === money}" v-for="(item, i) in moneyList" :key="i" :value="item">￥{{ item }}</checker-item>        
        </checker>  
        <group title="">
            <x-input title="" v-model="other_money" :clickFocus="true" :is-type="beNum" @on-change="othMoneyChange" placeholder="其他" placeholder-align="left"></x-input>
        </group>
        <div class="r-service-info">
          <template v-if="isRead">
            <x-icon type="ios-circle-filled" size="24" @click="readEve"></x-icon>
          </template>
          <template v-else>
            <x-icon type="ios-circle-outline" size="24" @click="readEve"></x-icon>
          </template>
          <span style="margin-left: 8px;" @click="readEve">已同意并阅读</span>
          <router-link to="/PayTerm" style="color: #409EFF;">充值协议</router-link>
        </div>         
        <x-button type="primary" class="btn-pay" @click.native="paySubmit">立即充值</x-button>           
    </div>

    <div class="intro">                
        <x-icon type="ios-information-outline" size="40"></x-icon>
        <div class="tips">说明：系统按充值金额的10%计收服务费，（例如：充值1000元，实际可用金额为900元）</div>
    </div>    

    <div v-transfer-dom>
      <x-dialog v-model="showDialogPay" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <p style="color:#fff;text-align:center;" @click="showDialogPay = false,clearTimer(timer)">
          <span style="font-size:30px; display: block;">微信扫码支付</span>
          <img :src="qr" art="加载中" style="width: 60%; height: auto;" />
          <br>
          <br>
          <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
        </p>
      </x-dialog>
    </div>      
  </div>
</template>

<script>
import { InlineLoading, Checker, CheckerItem, XInput, Group, XButton, XDialog, TransferDom } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    InlineLoading,
    Checker,
    CheckerItem,
    XInput,
    Group,
    XButton,
    XDialog
  },
  data () {
    return {
      isRead: true,
      money: 500,
      moneyList: [
        500,
        1000,
        2000,
        5000
      ],
      other_money: '',
      beNum: function (value) {
        return {
          valid: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value),
          msg: '必须为数字,最多两位小数'
        }
      },
      isloading: false,
      showDialogPay: false,
      qr: 'http://zf.lanseemy.com/Public/Shop/images/loadding.gif',
      timer: '',
      shopmember: ''
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    othMoneyChange () {
      this.money = 0
    },
    checkerClk (val, itemDisabled) {
      let that = this
      this.other_money = ''
      setTimeout(() => {
        that.money = val
      }, 100)
    },
    initData () {
      let that = this
      let data = {}
      this.$axios.post('/api/mobile.php?s=/recharge/recharge', data)
      .then(res => {
        let data = res.data
        that.isloading = false
        if (data.code === 1) {
          that.shopmember = data.data
        }
      })
      .catch(err => {
        that.isloading = false
        console.log(err)
        console.log('request fail')
      })
    },
    // 充值
    paySubmit () {
      let that = this
      let money = 0
      if (parseFloat(this.money)) {
        money = this.money
      }

      if (!this.isRead) {
        that.$vux.toast.show({
          text: '请阅读充值协议',
          type: 'warn'
        })
        return false
      }

      if (parseFloat(this.other_money)) {
        money = this.other_money
      }
      if (!money) {
        that.$vux.toast.show({
          text: '请选择充值金额',
          type: 'warn'
        })
        return false
      }
      this.$vux.loading.show({
        text: 'Loading'
      })

      let data = {
        money: money
      }
      this.$axios.post('/api/mobile.php?s=/recharge/get_qr', data)
      .then(res => {
        let data = res.data
        that.isloading = false
        this.$vux.loading.hide()
        if (data.code === 1) {
          if (data.type && data.type === 'wxpay') {
            window.location.href = data.url
          } else {
            that.showDialogPay = true
          }
          that.qr = data.url
          that.check(data.order_id)
        } else if (data.code === 0) {
          that.$vux.toast.show({
            text: data.msg,
            type: 'warn'
          })
        }
      })
      .catch(err => {
        that.isloading = false
        console.log(err)
        console.log('request fail')
        this.$vux.loading.hide()
      })
    },
    check (id) {
      let that = this
      let data = {
        id: id
      }
      let index = that.timer = setInterval(() => {
        this.$axios.post('/api/mobile.php?s=/recharge/check_pay', data)
        .then(res => {
          let data = res.data
          that.isloading = false
          if (data.code === 1) {
            clearInterval(index)
            that.$vux.toast.show({
              text: data.msg
            })
            that.showDialogPay = false
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          } else if (data.code === 0) {
          }
        })
        .catch(err => {
          that.isloading = false
          console.log(err)
          console.log('request fail')
        })
      }, 1000)
    },
    clearTimer (t) {
      clearInterval(t)
    },
    readEve () {
      this.isRead = !this.isRead
    }
  }
}
</script>

<style scope lang="less">
@import '../styles/reset.less';

.m-pay-item {
  width: 100px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
}
.m-pay-item-selected {
  background: #ffffff url(../assets/chk_active.png) no-repeat right bottom;
  border-color: #ff4a00;
}
.pay-header {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    font-size: 20px;
    margin-bottom: 12px;
    .money {
        font-size: 24px;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    }
}
.checker-box {
    padding: 8px 14px 20px;
    background-color: #fff;
    text-align: center;
}
.vux-checker-box {
    text-align: center;
    .m-pay-item {
        margin-right: 24px;
        margin-top: 12px;
    }
}
.btn-pay {
    margin: 20px auto 20px;
}
.cw-input {
    width: 100%;
    border: 0;
    outline: 0;
    -webkit-appearance: none;
    background-color: transparent;
    font-size: 18px;
    color: inherit;
    line-height: 1.6;     
    height: 32px;   
}
.intro {
    padding: 20px 14px;
    display: flex;
    align-items: center;
    .vux-x-icon {
        fill: @weuiColorPrimary;
        margin-right: 10px;
    }
    .tips {
        font-size: 12px;
        color: #999;
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
