<template>
  <div class="m-analyse">
    <div>
      <div style="height:44px;">
          <sticky scroll-box="vux_view_box_body" ref="sticky" :check-sticky-support="false" :offset="0" :disabled="disabled">
              <tab :line-width="1">
                  <tab-item selected @on-item-click="onItemClick">数据</tab-item>
                  <tab-item @on-item-click="onItemClick">图表</tab-item>      
              </tab>
          </sticky>
      </div>
        <cell title='文章' :value="selArtVal" is-link style="background-color: #fff;" class="vux-1px-b art-search" @click.native="artPopHandle"></cell>
    </div>
    <div v-show="tabIdx === 0">
        <div class="m-panel">
            <div class="panel-main">
                <div class="main-item vux-1px-r">
                    <span>已领取红包个数</span>
                    <p class="num">{{ red_data.red_over || 0 }}</p>
                </div>
                <div class="main-item">
                    <span>可领取红包个数</span>
                    <p class="num">{{ red_data.red_can || 0 }}</p>
                </div>            
            </div>
            <div class="panel-footer">
                领取率：{{red_data.red_per|| '0'}}%（已领取红包个数/可领取红包个数）
            </div>
        </div>

        <div class="m-panel">
            <div class="panel-main">
                <div class="main-item vux-1px-r">
                    <span>转发人数</span>
                    <p class="num">{{forward_data.forward_num|| '0'}}</p>
                </div>
                <div class="main-item vux-1px-r">
                    <span>转发次数</span>
                    <p class="num">{{forward_data.forward_all|| '0'}}</p>
                </div>      
                <div class="main-item">
                    <span>阅读人数</span>
                    <p class="num">{{forward_data.read_num|| '0'}}</p>
                </div>                        
            </div>
            <div class="panel-footer">
                人均转发次数：{{forward_data.pre|| '0'}}（转发人数/转发次数）
            </div>
        </div>    

        <div class="m-panel">
            <div class="panel-main">
                <div class="main-item vux-1px-r">
                    <span>间接阅读人数</span>
                    <p class="num">{{forward_data.read_indirect_num|| '0'}}</p>
                </div>
                <div class="main-item vux-1px-r">
                    <span>间接转发次数</span>
                    <p class="num">{{forward_data.forward_indirect_all|| '0'}}</p>
                </div>      
                <div class="main-item vux-1px-r">
                    <span>间接最高层级</span>
                    <p class="num">{{forward_data.forward_layer|| '0'}}</p>
                </div>
                <div class="main-item">
                    <span>间接转发人数</span>
                    <p class="num">{{forward_data.forward_indirect_num|| '0'}}</p>
                </div>                                    
            </div>
            <div class="panel-footer">
                间接转发率：{{forward_data.forward_pre|| '0'}}%（间接转发人数/间接阅读人数）
            </div>
        </div> 

        <div class="m-panel">
            <div class="panel-main">
                <div class="main-item vux-1px-r">
                    <span>系统发放金额占比（领取/发放）</span>
                    <p class="num">{{red_data['red_system_get']/100|| '0'}} | {{red_data['red_system_all']/100|| '0'}}</p>
                </div>
                <div class="main-item">
                    <span>后台发放金额占比（领取/发放）</span>
                    <p class="num">{{red_data['red_admin_over']/100|| '0'}} | {{red_data['red_admin']/100|| '0'}}</p>
                </div>                                     
            </div>
            <div class="panel-footer">
                <x-button mini type="primary" @click.native="$router.push('/Envelope')">红包记录</x-button>
            </div>
        </div>   

        <div class="m-panel" style="padding-bottom: 20px;">
            <div class="panel-main">
                <div class="main-item vux-1px-r">
                    <span>总阅读量</span>
                    <p class="num">{{comment_data.all_read|| '0'}}</p>
                </div>
                <div class="main-item vux-1px-r">
                    <span>pv单价</span>
                    <p class="num">{{Math.floor(red_data['red_system_get']/comment_data['all_read'])/100|| '0'}}</p>
                </div>  
                <div class="main-item">
                    <span>uv单价</span>
                    <p class="num">{{red_data.pv_money|| '0'}}</p>
                </div>                                                 
            </div>
        </div>        

        <div class="m-panel" style="padding-bottom: 20px;">
            <div class="panel-main">
                <div class="main-item vux-1px-r">
                    <span>人均停留时间</span>
                    <p class="num">{{comment_data.stop_average_time|| '0'}}秒</p>
                </div>
                <div class="main-item vux-1px-r">
                    <span>最长停留时间</span>
                    <p class="num">{{comment_data.stop_max_time|| '0'}}秒</p>
                </div>  
                <div class="main-item">
                    <span>优质用户数量</span>
                    <p class="num">{{comment_data.quality_user|| '0'}}</p>
                </div>                                                 
            </div>
        </div>    

        <div class="m-panel">
            <div class="panel-main">
                <div class="main-item vux-1px-r">
                    <span>留言次数</span>
                    <p class="num">{{comment_data.comment_all_num|| '0'}}</p>
                </div>
                <div class="main-item vux-1px-r">
                    <span>已处理留言</span>
                    <p class="num">{{comment_data.comment_answer_num|| '0'}}</p>
                </div>  
                <div class="main-item">
                    <span>未处理留言</span>
                    <p class="num">{{comment_data.comment_false_num|| '0'}}</p>
                </div>                                                 
            </div>
            <div class="panel-footer">
                <x-button mini type="primary" @click.native="$router.push('/CommentDetail')">留言记录</x-button>
            </div>        
        </div>  
    </div> 

    <div v-show="tabIdx === 1">
        <div class="m-chart">
            <div id="gender" class="vux-1px-b" style="width: 100%; height:200px;"></div>
            <div id="terminal" class="vux-1px-b" style="width: 100%; height:200px;"></div>
            <div id="stay" class="vux-1px-b" style="width: 100%; height:280px;"></div>
            <div class="areaBar">
                <div id="area" style="width: 100%; height:280px;"></div>
                <div class="area-select">
                    <template v-if="areaSel == 'province'">
                        <x-button mini type="primary" class="area-btn" @click.native="areaSel = 'province', drawAreaBar()">省份</x-button>
                        <x-button mini plain class="area-btn" @click.native="areaSel = 'city', drawAreaBar()">城市</x-button>
                    </template>
                    <template v-else>
                        <x-button mini plain class="area-btn" @click.native="areaSel = 'province', drawAreaBar()">省份</x-button>
                        <x-button mini type="primary" class="area-btn" @click.native="areaSel = 'city', drawAreaBar()">城市</x-button>                    
                    </template>
                </div>
            </div>
        </div>
    </div>   

    <div v-transfer-dom>
      <popup class="m-artPop" v-model="artPop" height="60%" @on-hide="artPopHideEve">
        <div>
          <load-more tip="正在加载" v-if="artloading"></load-more>
          <radio :options="artList" v-model="selArtKey" @on-change="artChange">
            <template slot-scope="props" slot="each-item">
              <flexbox :gutter="10">
                <flexbox-item :span="3/4"><span>{{ artList[props.index].value }}</span></flexbox-item>
                <flexbox-item :span="1/4"><span>{{ artList[props.index].share }}</span></flexbox-item>
              </flexbox>                            
            </template>
          </radio>
        </div>
      </popup>
    </div>                 
  </div>
</template>

<script>
import { TransferDom, XInput, Group, XButton, Cell, Tab, TabItem, Sticky, Popup, Radio, Flexbox, FlexboxItem, LoadMore } from 'vux'
import echarts from 'echarts'

export default {
  directives: {
    TransferDom
  },
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    Tab,
    TabItem,
    Sticky,
    Popup,
    Radio,
    Flexbox,
    FlexboxItem,
    LoadMore
  },
  data () {
    return {
      isChangeArt: false,
      artloading: false,
      selArtKey: 0,
      selArtVal: '全部',
      artList: [],
      artPop: false,
      disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
      tabIdx: 0,
      red_data: '',
      forward_data: '',
      comment_data: '',
      genderChart: '',
      genderOption: {
        title: {
          text: '性别分布',
          subtext: '',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '性别',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      terminalChart: '',
      terminalOption: {
        title: {
          text: '终端分布',
          subtext: '',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '系统',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      stayChart: '',
      stayOption: {
        title: {
          text: '停留时间',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}人'
        },
        xAxis: {
          name: '时间',
          type: 'category',
          data: ['0秒', '0-3秒', '3-15秒', '15-30秒', '30-60秒', '60-180秒', '180-300秒', '300秒以上']
        },
        yAxis: {
          name: '人数',
          type: 'value'
        },
        series: [{
          name: '停留时间',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          data: [],
          type: 'bar'
        }]
      },
      areaSel: 'province',
      areaChart: '',
      areaOption: {
        title: {
          text: '微信地区分布',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}人'
        },
        xAxis: {
          name: '地区',
          type: 'category',
          data: []
        },
        yAxis: {
          name: '人数',
          type: 'value'
        },
        dataZoom: [
          {
            show: false,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            show: false,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 30,
            height: '80%',
            showDataShadow: false,
            left: '93%'
          }
        ],
        series: [{
          name: '微信地区分布',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          data: [],
          type: 'bar'
        }]
      }
    }
  },
  mounted () {
    // this.drawMyChart()
    this.get_red()
    this.get_forward()
    this.get_comment()
  },
  methods: {
    onItemClick (index) {
      this.tabIdx = index
      document.getElementById('vux_view_box_body').scrollTop = 0
      if (index === 1) {
        let that = this
        setTimeout(() => {
          if (this.isChangeArt) {
            this.isChangeArt = false
            this.genderChart = ''
          }
          if (this.genderChart) {
            that.reDrawChart(['gender', 'terminal', 'stay', 'area'])
            return false
          }
          // 绘制性别分布饼图
          this.drawGenderPie()
          // 绘制终端分布饼图
          this.drawTerminalPie()
          // 绘制停留时间柱状图
          this.drawStayBar()
          // 绘制地区柱状图
          this.drawAreaBar()
        }, 300)
      }
    },
    reDrawChart (arr) {
      let that = this
      arr.map((item) => {
        let obj = `${item}Chart`
        let opt = `${item}Option`
        that[obj] = echarts.init(document.getElementById(item))
        that[obj].showLoading()
        that[obj].setOption(that[opt])
        that[obj].hideLoading()
      })
    },
    drawMyChart () {
      let myChart = echarts.init(document.getElementById('main'))
      let option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
      myChart.setOption(option)
    },
    // 红包 data
    get_red () {
      let that = this
      let data = {}
      data.cid = this.selArtKey
      this.$axios.post('/api/mobile.php?s=/Exchange/get_red', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.red_data = data.data
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    // 转发 data
    get_forward () {
      let that = this
      let data = {}
      data.cid = this.selArtKey
      this.$axios.post('/api/mobile.php?s=/Exchange/get_forward', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.forward_data = data.data
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    // 留言
    get_comment () {
      let that = this
      let data = {}
      data.cid = this.selArtKey
      this.$axios.post('/api/mobile.php?s=/Exchange/get_comment_data', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.comment_data = data.data
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    drawGenderPie () {
      // 基于准备好的dom，初始化echarts实例
      this.genderChart = echarts.init(document.getElementById('gender'))
      this.genderChart.showLoading()

      let that = this
      let data = {}
      data.cid = this.selArtKey
      this.$axios.post('/api/mobile.php?s=/Exchange/get_sex', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          data.data.map((item, i) => {
            that.genderOption.series[0].data[i] = item
          })
          that.genderChart.setOption(that.genderOption)
          that.genderChart.hideLoading()
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    drawTerminalPie () {
      // 基于准备好的dom，初始化echarts实例
      this.terminalChart = echarts.init(document.getElementById('terminal'))
      this.terminalChart.showLoading()

      let that = this
      let data = {}
      data.cid = this.selArtKey
      this.$axios.post('/api/mobile.php?s=/Exchange/get_model', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          data.data.map((item, i) => {
            that.terminalOption.series[0].data[i] = item
          })
          that.terminalChart.setOption(that.terminalOption)
          that.terminalChart.hideLoading()
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    drawStayBar () {
      // 基于准备好的dom，初始化echarts实例
      this.stayChart = echarts.init(document.getElementById('stay'))
      this.stayChart.showLoading()

      let that = this
      let data = {}
      data.cid = this.selArtKey
      this.$axios.post('/api/mobile.php?s=/Exchange/get_stop', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          data.data.map((item, i) => {
            that.stayOption.series[0].data[i] = item
          })
          that.stayChart.setOption(that.stayOption)
          that.stayChart.hideLoading()
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    drawAreaBar () {
      // 基于准备好的dom，初始化echarts实例
      this.areaChart = echarts.init(document.getElementById('area'))
      this.areaChart.showLoading()

      let that = this
      let data = {}
      data.cid = this.selArtKey
      switch (this.areaSel) {
        case 'province':
          data.type = 1
          break
        case 'city':
          data.type = 2
          break
      }
      this.$axios.post('/api/mobile.php?s=/Exchange/get_city', data)
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          data.area.map((item, i) => {
            that.areaOption.xAxis.data[i] = item
          })
          data.num.map((item, i) => {
            that.areaOption.series[0].data[i] = item
          })
          that.areaChart.setOption(that.areaOption)
          that.areaChart.hideLoading()
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    // 选择文章
    artChange (val, label) {
      this.selArtVal = label
      this.selArtKey = val
      this.artPop = false
      this.get_red()
      this.get_forward()
      this.get_comment()
      this.isChangeArt = true
      if (this.tabIdx === 1) {
        // 绘制性别分布饼图
        this.drawGenderPie()
        // 绘制终端分布饼图
        this.drawTerminalPie()
        // 绘制停留时间柱状图
        this.drawStayBar()
        // 绘制地区柱状图
        this.drawAreaBar()
      }
      document.getElementById('vux_view_box_body').removeEventListener('touchmove', this.unThrough, { passive: false })
    },
    artPopHandle () {
      document.getElementById('vux_view_box_body').addEventListener('touchmove', this.unThrough, { passive: false })
      this.artPop = true
      if (this.artList.length === 0) this.artloading = true
      let that = this
      let data = {}

      this.$axios.post('/api/mobile.php?s=/Exchange/get_art', data)
      .then(res => {
        let data = res.data
        that.artloading = false
        if (data.code === 1) {
          data = data.data
          that.artList = []
          for (let i in data) {
            that.artList.push({
              key: data[i].id,
              value: data[i].art,
              share: data[i].share
            })
          }
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
        that.artloading = false
      })
    },
    unThrough (e) {
      let eve = e || window.event
      eve.preventDefault()
    },
    artPopHideEve () {
      document.getElementById('vux_view_box_body').removeEventListener('touchmove', this.unThrough, { passive: false })
    }
  }
}
</script>

<style scope lang="less">
@import '../styles/reset.less';
@import '../styles/1px.less';
.m-panel {
    padding-top: 20px;
    margin-top: 10px;
    background-color: #fff;
    font-size: 12px;
    text-align: center;
    &:first-child {
        margin-top: 0;
    }
    .panel-main {
        display: flex;
        justify-content: space-around;
        .main-item {
            width: 100%;
            p {
                color: @weuiColorWarn;
                margin-top: 10px;
            }
        }
    }    
    .panel-footer {
        padding: 10px 15px 20px;
    }
}
.m-analyse {
    .vux-tab .vux-tab-item.vux-tab-selected {
        color: @weuiColorPrimary !important;
        border-bottom: 3px solid @weuiColorPrimary !important;
    }
    .vux-tab-ink-bar {
        background-color: @weuiColorPrimary !important;
    }
}
.m-chart > div {
    background-color: #fff;
}

.areaBar {
    position: relative;
    z-index: 100;
    .area-select {
        position: absolute;
        top: 5px;
        right: 5px;
        .area-btn {
            font-size: 10px;
            border-radius: 0;
        }
    }
}
.m-artPop {
    &.vux-popup-dialog {
        background-color: #fff;
    }
    .weui-cells_radio {
        .weui-cell__ft {
            width: 30px;
        }
    }
}
.art-search {
    .vux-label {
        width: 45px;
    }
    .weui-cell__ft {
        text-align: left;
    }
}
</style>
