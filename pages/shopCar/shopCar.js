//获取应用实例
var app = getApp()
Page({
  data:{
    model:'0',           //0表示无货，1表示外卖，2表示堂食
    shops:'active',      //商家配送
    self:'',             //上门自取
    address:{},          //用户地址信息
    payway:{'online':'border_active','offline':''},    //支付方式
    goods_info:[],          //商品列表
    good_price:'',          //商品总价
    full_price:'',          //商品总价（含配送费）
    date: '2017-03-10',
    time: '12:01',
    userInfo:[]             //用户信息
  },
  shops:function(){   //商家配送
    this.setData({
      self:'',
      shops:'active'
    })
  },
  self:function(){    //上门自取
    this.setData({
      shops:'',
      self:'active'
    })
  },
  findAddress:function(){            //查找地址
    var openid = app.globalData.openid;
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'findOneAddress',
        openid : openid,
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
          address:res.data.data
        })
      }
    })
  },
  onShow:function(){                      //页面加载获取相关参数
    var orderlist = app.globalData.orderlist;
    if(orderlist.length<1){
      this.setData({
        model:'0'
      })
      return;
    }
    var ways = parseInt(app.globalData.ways)+1;
    var date = new Date();
    var year = date.getFullYear();
    var month = parseInt(date.getMonth())+1;
    var day = date.getDate();
    var time = date.getHours();
    time++;

    this.setData({
      model:ways,
      goods_info:orderlist,
      good_price:app.globalData.fullPrice,
      userInfo:app.globalData.userInfo,
      date:year+'-'+month+'-'+day,
      time:time+':01'
    })
    this.getFullPrice();
    if (app.globalData.address) {
      this.setData({
        address:app.globalData.address
      })
      return;
    }
    this.findAddress();
  },
  switchs:function(e){               //控制是否在线支付
    var id = e.currentTarget.id;
    if(id == 'online'){
      this.setData({
        payway:{'online':'border_active','offline':''} 
      })
    }
    if(id == 'offline'){
      this.setData({
        payway:{'online':'','offline':'border_active'} 
      })
    }
  },
  chooseAddress:function(){            //选择地址
    wx.navigateTo({
      url: '../personal/address/address?userid='+this.data.userInfo.userid+'&chooseAddress=true'
    })
  },
  bindDateChange: function(e) {       //日期更改
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {       //时间更改
    this.setData({
      time: e.detail.value
    })
  },
  getFullPrice:function(){               //获取用户所选的产品总价
    var price = [];
    var sum = 0;
    for (var i = 0; i < this.data.goods_info.length; i++) {
      price[i] = this.data.goods_info[i].price*this.data.goods_info[i].num;
    };
    for (var i = 0; i < price.length; i++) {
      sum = sum + parseInt(price[i]);
    };
    if(sum < 99){
      var full_price = sum+6;
    }else{
      var full_price = sum;
    }
    sum = sum.toString() + '.00';
    full_price = full_price.toString() + '.00';
    this.setData({
      good_price:sum,
      full_price:full_price
    })
  },
  minus:function(e){                  //减少商品数量
    var index = e.currentTarget.dataset.index;
    var num = this.data.goods_info[index].num;
    num--;
    var list = this.data.goods_info;
    list[index].num = num;
    if(num == 0){
      list.splice(index,1);
    }
    if(list.length<1){
      this.setData({
        model:'0'
      })
    }
    this.setData({
      goods_info: list
    })
    app.globalData.orderlist = list;
    this.getFullPrice();
  },
  plus:function(e){             //增加商品数量
    var index = e.currentTarget.dataset.index;
    var num = this.data.goods_info[index].num;
    num++;
    var list = this.data.goods_info;
    list[index].num = num;
    this.setData({
      goods_info: list
    })
    app.globalData.orderlist = list;
    this.getFullPrice();
  },
  Rad:function(d){                //经纬度转换成三角函数中度分表形式。
     return d * Math.PI / 180.0;
  },
  GetDistance:function(lat,lng){     //根据经纬度计算两地之间的距离
    var radLat1 = this.Rad(31.3010584459);
    var radLat2 = this.Rad(lat);
    var a = radLat1 - radLat2;
    var  b = this.Rad(120.5490183483) - this.Rad(lng);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s * 6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    return s;
  },
  order:function(e){                //下订单
    var fullPrice = this.data.good_price;
    var remark = e.detail.value.remark;
    var orderlist = this.data.goods_info;
    orderlist = JSON.stringify(orderlist);
    var address = {};
    var status = '';
    var payway = '';
    var inviteTime = '';
    var processName = '待接单';
    if(this.data.model=='1'){
      if(this.data.shops){
        var latitude = address.latitude;                //纬度
        var longitude = address.longitude;              //经度
        var distance = this.GetDistance(latitude,longitude);
        if(distance > 5){
          return app.alerts('配送距离大于5公里,请您重新选择配送地点');
        }
        status = '商家配送';
        fullPrice = this.data.full_price;
        address = this.data.address;
        if(!address){
          return app.alerts('请填写配送地址');
        }
      }else{
        status = '到店自取';
        inviteTime = this.data.date +' '+ this.data.time;
        address.addressname = e.detail.value.addressname;
        address.tel = e.detail.value.tel;
        if(!address.addressname){
          return app.alerts('请输入姓名');
        }
        var res= /^1[34578]\d{9}$/;
        if(!res.test(address.tel)){
          return app.alerts('请输入正确的手机号吗');
        }
        var nowTime = new Date();
        var okTime = new Date(inviteTime);
        if(okTime<=nowTime){
          return app.alerts('请选择大于现在的时间');
        }
      }
      if(this.data.payway.online){
        payway = 'online';
      }else{
        payway = 'offline';
      }
    } 
    address = JSON.stringify(address);
    var time = Date.parse(new Date());
    var orderData = {
      userid:this.data.userInfo.userid,          //用户id
      orderlist:orderlist,                       //订单列表
      address:address,                           //地址信息
      remark:remark,                             //备注
      payway:payway,                             //支付方式
      state:this.data.model,                     //订单类型，1外卖，2堂食
      status:status,                             //订单配送方式
      processName:processName,                   //订单进度描述
      prosess:'0',                               //0待处理订单，1正在处理订单，2处理完成订单，3待评价订单，4已完成订单,5已取消订单
      fullPrice:fullPrice,                       //商品总价
      inviteTime:inviteTime,                     //自取时间
      createtime:time                            //下单时间
    }
    orderData = JSON.stringify(orderData);
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'addOrder',
        orderData:orderData          
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        app.globalData.orderlist = [];
        wx.navigateTo({
          url: '../personal/order/order'
        })
      }
    })
  }
})