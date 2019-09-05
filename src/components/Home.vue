<template>
  <div class="m-home">
    <div class="header-bg"></div>
	<card>
      <div slot="content" class="card-box">
        <div class="card-header">
            <div class="headerimg">
                <img src="http://zf.lanseemy.com/Public/Shop/images/avatar/avatar0.png" alt="用户头像">
            </div>
            <div class="user-mid">                
                <span class="user">{{ user.nickname || '--' }}</span>
            </div>            
        </div>
        <div class="card-footer">
            <div class="money-box">余额<span class="money">5500</span>元</div>
            <router-link tag="div" class="btn-pay" to="Pay">
                <img src="../assets/icon/btn_pay.png" alt="" />
            </router-link>
        </div>
      </div>
    </card>
    <div class="mid_nav">                 
        <router-link to="articlelist" tag="div" class="item artlib"></router-link >
        <router-link to="AccCenter" tag="div" class="item money"></router-link>        
    </div>
    <div class="m-grids">
        <grid :show-lr-borders="false" :show-vertical-dividers="false">
            <grid-item link="/Article" label="文章列表">
                <img slot="icon" src="../assets/icon/art_list.png">
            </grid-item>
            <grid-item link="/ShareArticle" label="已分享文章">
                <img slot="icon" src="../assets/icon/art_share.png">
            </grid-item>
            <grid-item link="/CommentDetail">
                <img slot="icon" src="../assets/icon/art_comment.png">
                <span slot="label">文章评论</span>
            </grid-item>
        </grid>
        <grid :show-lr-borders="false" :show-vertical-dividers="false">
            <grid-item link="/Envelope" label="红包明细">
                <img slot="icon" src="../assets/icon/rp_record.png">
            </grid-item>
            <grid-item link="/Transaction" label="交易明细">
                <img slot="icon" src="../assets/icon/ex_record.png">
            </grid-item>
            <grid-item label="联系客服" @on-item-click="serverEve">
                <img slot="icon" src="../assets/icon/help.png">
            </grid-item>
        </grid>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showDialogSer" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <p style="color:#fff;text-align:center;" @click="showDialogSer = false">
          <span style="font-size:30px; display: block;">联系客服</span>
          <img :src="wx_img" art="" style="width: 60%; height: auto;" />
          <br>
          <br>
          <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
        </p>
      </x-dialog>
    </div>    
  </div>
</template>

<script>
import { XHeader, Actionsheet, TransferDom, Group, Cell, CellBox, XButton, Card, Grid, GridItem, GroupTitle, XDialog } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Actionsheet,
    Group,
    Cell,
    XButton,
    Card,
    CellBox,
    Grid,
    GridItem,
    GroupTitle,
    XDialog
  },
  data () {
    return {
      title: '首页',
      showMenus: false,
      balance: '',
      balance_all: '',
      balance_frozen: '',
      user: '',
      showDialogSer: false,
      wx_img: ''
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
          that.wx_img = data.data.wx_img
        }
      })
      .catch(err => {
        console.log(err)
        console.log(err.status)
        console.log(err.statusText)
        console.log('request fail')
      })
    },
    serverEve () {
      console.log('show server')
      this.showDialogSer = true
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/reset.less';
@import '../styles/1px.less';
a {
    color: initial;
}
.card-flex {
  display: flex;
  justify-content: space-around;
}
.card-footer {
  padding: 0 0 20px 0;
  text-align: center;
  flex-wrap: wrap;
  .money-box {
    .money {
        color: #000;
        font-size: 20px;
        font-weight: bold;
        padding: 0 6px;
    }
  }
  .btn-pay {
      width: 100px;
      height: auto;
      margin: 14px auto 0;
      img {
          width: 100px;
          height: auto;
      }
  }
  .item {
      width: 33%;
  }
}
.vux-1px-r::after {
    // right: -2px;
}
.header-bg {
    background-color: #90aafe;
    width: 100%;
    height: 192px;
    position: absolute;
    z-index: -1;
    top: 0;
}
.m-home {
    .weui-panel {    
        margin: 24px 14px 0px 14px !important;
        border-radius: 10px;
        overflow: unset !important;
        &::before {
            content: unset !important
        }
    }
}
.card-box {
    font-size: 14px;
    margin-top: 46px;
    .card-header {
        display: flex;
        padding-bottom: 6px;
        flex-direction: column;
        text-align: center;
        .pay {
            display: block;
            background-color: @weuiColorSecond;
            height: 40px;
            font-size: 18px;
            line-height: 40px;
            padding: 0 20px;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            color: #fff;            
        }
        .headerimg {
            margin-top: -32px;
            img {
                width: 64px;
                height: 64px;
                border-radius: 50%;
            }
        }        
        .user-mid {
            display: flex;
            flex-direction: column;
            padding-top: 2px;
            .upgrade {
                display: inline-block;
                margin-left: 14px;
                background-color: @weuiColorPrimary;
                color: #fff;
                padding: 1px 5px;
                font-size: 10px;
            }            
            .user {
                color: #000;
                font-size: 16px;
                font-weight: bold;
            }
            .exp {
                color: #4565ae;
                background-color: #b0d8fc;
                display: inline-block;
                text-align: center;
                border-radius: 4px;
                font-size: 12px;
                margin: 3px 0;
                padding: 1px 3px;
                min-width: 105px;
            }
        }    
    }
}
.mid_nav {
    display: flex;
    padding: 14px;
    justify-content: space-between;
    .item {
        width: 47%;
        height: 72px;
        background-position: center;
        background-size: 100% 100%;
        color: #fff;
        display: flex;
        flex-direction: column;
        font-size: 14px;        
        &.artlib {
            background-image: url(../assets/icon/artlib.png)
        }
        &.money {
            background-image: url(../assets/icon/nav_money.png)
        }
    }
}

.m-grids {
    background-color: #fff;
}
.placeholder.weui-grid::after {
    height: 0 !important;
    border: unset !important;
}
.weui-grid__icon {
    width: 32px !important;
    height: 32px !important;
}
</style>
<style lang="less">
.m-grids {
    .weui-grid {
        padding: 12px 10px;
        .weui-grid__icon {
            width: 36px !important;
            height: 36px !important;
        }   
    }
}
</style>
