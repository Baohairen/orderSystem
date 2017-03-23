//获取应用实例
var app = getApp()
Page({
  data:{
    collect:[],                    //收藏的商品
    foodinfo:[],                   //单个商品详情
    iscollect:{                    //已收藏的状态
      imgSrc:'../../../images/star_active.png',       
      text:'取消收藏' 
    }
  },
  onShow:function(){         //页面加载获取用户收藏列表
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'findCollect',
        userid:app.globalData.userInfo.userid,
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        var collect = JSON.parse(res.data.data);
        that.setData({
          collect: collect
        })
      }
    })
  },
  foodsInfo:function(e){                     //通过产品id查询产品详情
    var foodid = e.currentTarget.dataset.id;
    var collect = this.data.collect; 
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'findFoodById',
        foodid:foodid,
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        that.setData({
          foodinfo: res.data.data[0]
        })
      }
    })
  },
  close:function(){                    //关闭产品详情页
    this.setData({
      foodinfo: []
    })
  },
  cancelCollect:function(){             //取消收藏
    var collectFood = this.data.foodinfo;
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'cancelCollect',
        userid:app.globalData.userInfo.userid,
        collect:collectFood,
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        var collectFood = JSON.parse(res.data.data);
        that.setData({
          foodinfo: [],
          collect:collectFood
        })
      }
    })
  }
})