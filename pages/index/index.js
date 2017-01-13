//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [
      'http://127.0.0.1/images/%E8%BD%AE%E6%92%AD/01.jpg',
      'http://127.0.0.1/images/%E8%BD%AE%E6%92%AD/02.jpg',
      'http://127.0.0.1/images/%E8%BD%AE%E6%92%AD/03.jpg'
    ],
    martInfos:[{
      left:'店铺信息',
      right:''
    },{
      left:'店铺类型：',
      right:'西式快餐'
    },{
      left:'电话：',
      right:'0512-68186015'
    },{
      left:'起送价：',
      right:'￥20'
    },{
      left:'外送费：',
      right:'￥6（满99可免运费）'
    },{
      left:'外送范围：',
      right:'5公里'
    },{
      left:'店铺地址：',
      right:'高新区长江路463号绿宝广场一层'
    }]
  },
  onLoad: function () {
  }
})
