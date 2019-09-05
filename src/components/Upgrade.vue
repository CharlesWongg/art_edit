<template>
  <div style="padding-top: 46px;">
    <div class="pro-group">
        <span class="title">VIP专享权益</span>
        <scroller lock-y :scrollbar-x="false" :bounce="false">
        <div class="pro-box">
            <div class="pro-item" :class="{active: selIndex === i}" v-for="(item, i) in proInfo" :key="'pro_' + i" @click="selPro(i)">
                <span class="name">{{item.name}}</span>
                <template v-if="item.price[0].money">
                    <span class="tips">最低至</span>
                    <span class="money-group">
                        <span class="money">{{item.price[0].money}}</span>
                        元/月
                    </span>
                </template>
                <template v-else>
                    <span class="tips"></span>
                    <span class="money-group">
                        <span class="money">免费</span>
                        使用
                    </span>
                </template>                
            </div>                     
        </div>
        </scroller>  
        <group title="" label-width="5em" style="margin-bottom: 16px; margin-top: -24px;" v-if="proInfo && proInfo[selIndex].price[0].money">
            <popup-picker title="时长"  :data="monList" v-model="num" @on-change="numChange" placeholder="请选择"></popup-picker>
        </group>
        <div class="total-preview" v-if="proInfo && proInfo[selIndex].price[0].money">
            <span>
                应付金额：
                <span class="money big">{{ proInfo[selIndex].price[monKV[parseInt(num)]].money }}元</span>
            </span>
            <span class="tips">（已节省<span class="money">{{ (proInfo[selIndex].price[0].money * parseInt(num)) - proInfo[selIndex].price[monKV[parseInt(num)]].money }}</span>元
                <template v-if="monKV && monKV[parseInt(num)] !== (proInfo[selIndex].price.length - 1)">
                    ，建议购买{{ proInfo[selIndex].price[proInfo[selIndex].price.length - 1].num }}个月可以节省{{ (proInfo[selIndex].price[0].money * proInfo[selIndex].price[proInfo[selIndex].price.length - 1].num) - proInfo[selIndex].price[proInfo[selIndex].price.length - 1].money }}元
                </template>
            ）</span>            
        </div>
        <x-button type="primary" :disabled="proInfo && proInfo[selIndex].price[0].money ? false : true" @click.native="buy">立即购买</x-button>       
    </div>
    <div class="pro-group">
        <span class="title">权益详解</span>
        <x-table class="pro-table" :cell-bordered="false" :content-bordered="false" style="background-color:#fff; margin-top: 16px; font-size: 12px;">
            <thead>
            <tr style="background-color: #F7F7F7">
                <th>身份</th>
                <th>费用</th>
                <th>专享权益</th>
            </tr>
            </thead>
            <tbody>
                <tr class="tr" v-for="(item, i) in proInfo" :key="'tab_' + i">
                    <td>{{item.name}}</td>
                    <td class="price" v-if="item.price[0].money">
                        低至<span style="color: red">{{ item.price[0].money }}元</span>/月
                    </td>
                    <td class="price" v-else>
                        <span style="color: red">免费</span>
                    </td>                    
                    <td style="width: 65%; text-align: left;">
                        <p v-for="(jItem, j) in item.desc" :key="'td' + j">
                            <span>
                                <i class="dot"></i>
                                {{jItem}}
                            </span>
                        </p>                                      
                    </td>
                </tr>
            </tbody>
        </x-table>        
    </div>    
    <div v-transfer-dom>
      <x-dialog v-model="showDialogPay" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <p style="color:#fff;text-align:center;" @click="showDialogPay = false,clearTimer(timer)">
          <span style="font-size:30px; display: block;">微信扫码支付</span>
          <img :src="qr" art="" style="width: 60%; height: auto;" />
          <br>
          <br>
          <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
        </p>
      </x-dialog>
    </div>     
  </div>
</template>

<script>
import { Scroller, XButton, XTable, PopupPicker, Group, TransferDom, XDialog } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    Scroller,
    XButton,
    XTable,
    PopupPicker,
    Group,
    XDialog
  },
  data () {
    return {
      proInfo: '',
      selIndex: 0,
      num: ['1个月'],
      monList: [['1个月', '3个月', '6个月', '12个月']],
      showDialogPay: false,
      qr: 'http://zf.lanseemy.com/Public/Shop/images/loadding.gif',
      timer: '',
      monKV: ''
    }
  },
  mounted () {
    this.proList()
  },
  methods: {
    proList () {
      let that = this

      this.$axios.post('/api/mobile.php?s=/index/upgrade', {})
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.proInfo = data.data
          that.selPro(that.selIndex)
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    selPro (i) {
      this.selIndex = i
      if (this.proInfo[i].price) {
        this.num = [this.proInfo[i].price[0].num + '个月']
        this.monList = []
        this.monList[0] = []
        this.monKV = []
        this.proInfo[i].price.map((item, i) => {
          this.monList[0].push(item.num + '个月')
          this.monKV[item.num] = i
        })
      }
    },
    buy () {
      let pro = this.proInfo[this.selIndex]
      let that = this
      let data = {
        pid: pro.id,
        num: this.monKV[parseInt(this.num)]
      }
      this.$vux.loading.show({
        text: 'Loading'
      })

      this.$axios.post('/api/mobile.php?s=/index/get_qr', data)
      .then(res => {
        let data = res.data
        this.$vux.loading.hide()
        if (data.code === 1) {
          if (data.type && data.type === 'wxpay') {
            window.location.href = data.url
          } else {
            that.showDialogPay = true
          }
        }
        that.qr = data.url
        that.check(data.order_id)
      })
      .catch(err => {
        that.isloading = false
        console.log(err)
        console.log('request fail')
        this.$vux.loading.hide()
      })
    },
    numChange (val) {
      console.log(val)
    },
    check (id) {
      let that = this
      let data = {
        id: id
      }
      let index = that.timer = setInterval(() => {
        this.$axios.post('/api/mobile.php?s=/index/check_pay', data)
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
    }
  }
}
</script>

<style scope lang="less">
@import '../styles/reset.less';

.pro-group {
    background-color: #fff;
    padding: 15px 15px 30px;
    .title {

    }
    .pro-box {
        display: inline-flex;    
        padding-left: 14px;    
        .pro-item {
            display: flex;
            flex-direction: column;
            padding: 10px;            
            border: 1px solid #e3e3e3;
            width: 75px;
            height: 80px;
            justify-content: space-between;
            align-items: center;
            margin: 12px 0 24px;
            &.active {
                border-color: @weuiColorPrimary;
                background-color: #EFF3FF;
            }
            .name {
                font-size: 14px;
            }
            .tips {
                color: #999;
                font-size: 12px;
            }
            .money-group {
                font-size: 10px;
                color: @weuiColorPrimary;
                .money {
                    font-size: 18px;
                }                
            }
        }
        .pro-item + .pro-item {
            margin-left: 14px;
        }
    }
}
.pro-group + .pro-group {
    margin-top: 6px;
}
.vux-table {
    td {
        padding: 4px;        
        width: 22%;
    }
}
.pro-table {
    .price {
        line-height: 1.6;
    }
    .tr {
        border: 1px solid #eee;
    }
    .tr + .tr {
        border-top-width: 0;
    }
    p {
        line-height: 20px;
        .dot {
            width: 4px;
            height: 5px;
            background-color: #999;
            display: inline-block;
            border-radius: 50%;
            margin-right: 3px;
            margin-bottom: 2px;
        }        
    }
}
.total-preview {
    line-height: 1.2;
    margin-top: -6px;
    margin-bottom: 14px;
    padding: 0 14px;
    .tips {
        color: #999;
        font-size: 12px;
    }
    .money {
        color: #E74C3C;
    }
    .big {
        font-size: 22px;
    }
}
</style>
