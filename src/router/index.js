import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Forget from '@/components/Forget'
import UserInfoAll from '@/components/UserInfoAll'
import Article from '@/components/Article'
import ShareArticle from '@/components/ShareArticle'
import Envelope from '@/components/Envelope'
import Transaction from '@/components/Transaction'
import CommentDetail from '@/components/CommentDetail'
import UserEdit from '@/components/UserEdit'
import Analyse from '@/components/Analyse'
import MapTree from '@/components/MapTree'
import Pay from '@/components/Pay'
import Test from '@/components/Test'
import Home from '@/components/Home'
import Loading from '@/components/Loading'
import Upgrade from '@/components/Upgrade'
import ServiceTerm from '@/components/ServiceTerm'
import PayTerm from '@/components/PayTerm'
import artTransform from '@/components/artTransform'
import ArticleDetail from '@/pages/ArticleDetail'
import ArticleEdit from '@/pages/ArticleEdit'
import ArticleList from '@/pages/ArticleList'
import ArticleTplImg from '@/pages/ArticleTplImg'
import ArticleTplText from '@/pages/ArticleTplText'
import ArticleTplVideo from '@/pages/ArticleTplVideo'

Vue.use(Router)

export default new Router({
  mode: 'history',  // 去掉url中的#
  routes: [{
    path: '/Home',
    name: '我的',
    component: Home
  }, {
    path: '/Login',
    name: '登录',
    component: Login
  }, {
    path: '/Register',
    name: '注册',
    component: Register
  }, {
    path: '/Forget',
    name: '忘记密码',
    component: Forget
  }, {
    path: '/UserInfoAll',
    name: '用户信息',
    component: UserInfoAll,
    props: (route) => ({
      aid: route.query.aid
    })
  }, {
    path: '/Article',
    name: '文章列表',
    component: Article
  }, {
    path: '/ShareArticle',
    name: '已分享文章',
    component: ShareArticle
  }, {
    path: '/Envelope',
    name: '红包明细',
    component: Envelope
  }, {
    path: '/Transaction',
    name: '交易明细',
    component: Transaction
  }, {
    path: '/CommentDetail',
    name: '评论列表',
    component: CommentDetail
  }, {
    path: '/UserEdit',
    name: '修改信息',
    component: UserEdit
  }, {
    path: '/Analyse',
    name: '数据统计',
    component: Analyse
  }, {
    path: '/MapTree',
    name: '图谱',
    component: MapTree
  }, {
    path: '/Pay',
    name: '充值',
    component: Pay
  }, {
    path: '/test',
    name: 'test',
    component: Test
  }, {
    path: '/Loading',
    name: 'Loading',
    component: Loading
  }, {
    path: '/Upgrade',
    name: '升级',
    component: Upgrade
  }, {
    path: '/ServiceTerm',
    name: '服务条款',
    component: ServiceTerm
  }, {
    path: '/PayTerm',
    name: '充值协议',
    component: PayTerm
  }, {
    path: '/artTransform',
    name: '文章转换',
    component: artTransform
  }, {
    path: '/articlelist',
    name: '文章库',
    component: ArticleList
  }, {
    path: '/articledetail',
    name: '文章详情',
    component: ArticleDetail
  }, {
    path: '/articleedit',
    name: '文章修改',
    component: ArticleEdit
  }, {
    path: '/articletpltext',
    name: '文字模板',
    component: ArticleTplText
  }, {
    path: '/articletplimg',
    name: '图片模板',
    component: ArticleTplImg
  }, {
    path: '/articletplvideo',
    name: '视频模板',
    component: ArticleTplVideo
  }, {
    path: '/',
    redirect: '/Loading'
  }, {
    path: '*',
    redirect: '/Loading',
    meta: {}
  }]
})
