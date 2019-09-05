<template>
  <div style="padding-top: 46px;">
    <group>
      <cell-box>
        <div class="cell-item">
            <span>头像</span>
            <img :src="form.head_img || 'http://zf.lanseemy.com/Public/Shop/images/avatar/avatar0.png'" class="headimg" alt="" />
        </div>
      </cell-box>
    </group>
    <group>
        <cell title="昵称" :value="form.username" is-link @click.native="editPop = true"></cell>    
    </group>
    <group>
        <cell title="机构名称" :value="form.company" is-link @click.native="editPop = true"></cell>    
    </group>
    <group>
        <cell title="性别" :value="sexText[form.sex]" is-link @click.native="editPop = true"></cell>    
    </group>  
    <group>
      <cell-box>
        <div class="cell-item">
            <span>会员名</span>
            <span>{{ form.nickname }}</span>
        </div>
      </cell-box>
    </group>

    <div v-transfer-dom>
      <popup v-model="editPop" is-transparent>
        <div style="width: 95%;background-color:#fff;height:auto;margin:0 auto 10px;border-radius:5px;padding-top:10px;">
         <group>
          <x-input :clickFocus="true" title='昵称' v-model="form.username"></x-input>
          <x-input :clickFocus="true" title='机构' v-model="form.company"></x-input>
          <popup-radio title="性别" :options="sexOpt" v-model="form.sex" placeholder="请选择" @on-show="sexShow" @on-hide="sexHide"></popup-radio>
         </group>
         <div style="padding:20px 15px;">
          <x-button type="primary"  @click.native="saveHandle" :show-loading="isloading">保存</x-button>
          <x-button @click.native="editPop = false">取消</x-button>
         </div>
        </div>
      </popup>
    </div>

  </div>
</template>

<script>
import { TransferDom, XInput, Group, XButton, Cell, CellBox, Popup, PopupRadio } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
  directives: {
    TransferDom
  },
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    CellBox,
    Popup,
    PopupRadio
  },
  data () {
    return {
      isloading: false,
      editPop: false,
      sexText: {
        0: '保密',
        1: '男',
        2: '女'
      },
      sexOpt: [{
        key: 0,
        value: '保密'
      }, {
        key: 1,
        value: '男'
      }, {
        key: 2,
        value: '女'
      }],
      user: {},
      form: {
        username: '',
        company: '',
        sex: '',
        nickname: '',
        head_img: ''
      }
    }
  },
  computed: {
    ...mapState({
      domain: state => state.vux.domain
    })
  },
  mounted () {
    this.initData()
  },
  methods: {
    ...mapActions([
      'removeToken'
    ]),
    initData () {
      let that = this
      this.$axios.post('/api/mobile.php?s=/user/editShow', {})
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          that.user = data.data
          that.$set(that.form, 'username', data.data.username)
          that.$set(that.form, 'company', data.data.company)
          that.$set(that.form, 'sex', data.data.sex)
          that.$set(that.form, 'nickname', data.data.nickname)
          that.$set(that.form, 'head_img', that.domain + data.data.head_img)
        }
      })
      .catch(err => {
        console.log(err)
        console.log('request fail')
      })
    },
    tranClick (key) {
      return false
    },
    sexShow () {
      setTimeout(() => {
        this.editPop = false
      }, 200)
    },
    sexHide () {
      setTimeout(() => {
        this.editPop = true
      }, 500)
    },
    // 保存
    saveHandle () {
      this.isloading = true

      let that = this
      let data = this.form
      this.$axios.post('/api/mobile.php?s=/user/edit', data)
      .then(res => {
        let data = res.data
        that.isloading = false
        if (data.code === 1) { // 保存成功
          that.$vux.toast.text(data.msg)
          that.editPop = false
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
      })
    }
  }
}
</script>

<style lang="less" scope>
@import '../styles/reset.less';
@import '../styles/1px.less';
.cell-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}
.headimg {
    width: 24px;
    height: 24px;
}
</style>
