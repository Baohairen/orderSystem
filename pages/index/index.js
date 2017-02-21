//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [
      'http://ol58x6i5t.bkt.clouddn.com/images/01.jpg',
      'http://ol58x6i5t.bkt.clouddn.com/images/02.jpg',
      'http://ol58x6i5t.bkt.clouddn.com/images/03.jpg'
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
    }],
    comments:[{
      name:'张三',
      star:'⭐️⭐️⭐️⭐️',
      contents:'还好',
      time:'2017-01-13 12:00:23'
    },{
      name:'李四',
      star:'⭐️⭐️⭐️⭐️⭐️',
      contents:'好评好评好评好评好好评评好评好评好评好评好评好评好评好评好评好评好评好评好评好评好评好评好评好评',
      time:'2017-01-13 11:00:23'
    }]
  },
  onLoad: function () {
  },
  toChoose: function(e){
    app.globalData.ways = e.currentTarget.id;
    wx.switchTab({
      url: '/pages/choose/choose'
    })
  },
  tel: function () {  //拨号
    wx.makePhoneCall({
      phoneNumber: '0512-68186015' 
    })
  },
  location: function() {  //定位
    wx.navigateTo({
      url: '../map/map'
    })
  }
})
