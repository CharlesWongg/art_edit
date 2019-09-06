<template>
  <div style="padding-top: 46px; height: 100%; background-color: #fff;">
    <grid :cols="2" :show-lr-borders="false">
      <grid-item>
        <div class="acc-grid">
            <img src="../assets/icon/acc_balance.png" alt="" class="grid-icon" />
            <div class="grid-main">
                <span class="title">余额（元）</span>
                <span class="money">{{ parseInt(user.money)/100 || 0 }}</span>
            </div>    
        </div>
      </grid-item>
      <grid-item>
        <div class="acc-grid">
            <img src="../assets/icon/acc_used.png" alt="" class="grid-icon" />
            <div class="grid-main">
                <span class="title">已消费（元）</span>
                <span class="money">{{ parseInt(balance)/100 || 0 }}</span>
            </div>    
        </div>
      </grid-item>      
    </grid>
    <grid :cols="2" :show-lr-borders="false">
      <grid-item>
        <div class="acc-grid">
            <img src="../assets/icon/acc_freeze.png" alt="" class="grid-icon" />
            <div class="grid-main">
                <span class="title">冻结（元）</span>
                <span class="money">{{ balance_frozen/100 || 0 }}</span>
            </div>    
        </div>
      </grid-item>
      <grid-item>
        <div class="acc-grid">
            <img src="../assets/icon/acc_pay.png" alt="" class="grid-icon" />
            <div class="grid-main">
                <span class="title">总充值（元）</span>
                <span class="money">{{ parseInt(balance_all)/100 || 0 }}</span>
            </div>    
        </div>
      </grid-item>      
    </grid>      
    <div class="intro">                
        <x-icon type="ios-information-outline" size="40"></x-icon>
        <div class="tips">说明：系统按充值金额的10%计收服务费，（例如：充值1000元，实际可用金额为900元）</div>
    </div>           
  </div>
</template>

<script>
import { Grid, GridItem } from 'vux'

export default {
  components: {
    Grid,
    GridItem
  },
  data () {
    return {
      balance: '',
      balance_all: '',
      balance_frozen: '',
      user: ''
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      let that = this
      this.$axios.post('/api/mobile.php?s=/index/index', {})
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.balance = data.data.balance
          that.balance_all = data.data.balance_all
          that.user = data.data.user
          that.balance_frozen = data.data.balance_frozen
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../styles/reset.less';

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
.acc-grid {
    padding: 16px 10px;
    display: flex;
    align-items: center;
    .grid-icon {
        width: 36px;
        height: auto;
    }
    .grid-main {
        width: 100%;
        color: #000;
        text-align: center;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .money {
            font-size: 14px;
        }
    }
}
</style>
