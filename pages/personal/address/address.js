//获取应用实例
var app = getApp()
Page({
  data:{
    list:true,        //地址列表页展示
    addressList:[],   //地址列表信息
    add:false,        //添加地址
    updatePage:false, //修改地址
    update:{},        //修改地址信息
    userid:'',        //用户id
    address:{},        //地址信息
    chooseAddress:false,   //是否为选择地址情况
    isChoose:0         //默认选中的地址
  },
  onLoad:function(option){         //页面加载获取地址信息
    wx.setNavigationBarTitle({
      title: '我的地址'
    })
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'findAddress',
        userid:option.userid,
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res);
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        if(!res.data.data){
          app.alerts('还没有地址，赶紧添加一个吧');
        }else{
          var addressList = JSON.parse(res.data.data);
        }
        that.setData({
          userid:option.userid,
          chooseAddress:option.chooseAddress,
          addressList:addressList
        })
      }
    })
  },
  addNew:function(){        //新增地址页面打开
    this.setData({
      list:false,
      add:true,
      address:{}
    })
  },
  position:function(){      //定位
    var that = this;
    wx.chooseLocation({
      success:function(res){
        console.log(res);
        var address = res.address;
        var area = address.substr(0,parseInt(address.indexOf('区'))+1);
        var detail = address.substr(parseInt(address.indexOf('区'))+1)+'  '+res.name;
        var address_info = that.data.address;
        address_info.area = area;
        address_info.detail = detail;
        address_info.latitude = res.latitude;
        address_info.longitude = res.longitude;
        var update = that.data.update;
        update.area = area;
        update.details = detail;
        that.setData({
          address:address_info,
          update:update
        }) 
      },
      cancel:function(res){     //用户取消时进入
        app.alerts(res);
      }
    })
  },
  formAdd:function(e){          //添加地址
    var that = this;
    var address = e.detail.value;
    if(!address.addressname){
      return app.alerts('请输入姓名');
    }
    var res= /^1[34578]\d{9}$/;
    if(!res.test(address.tel)){
      return app.alerts('请输入正确的手机号吗');
    }
    if(!address.area){
      return app.alerts('请输入所在地区');
    }
    if(!address.details){
      return app.alerts('请输入详细信息');
    }
    address.latitude = this.data.address.latitude;
    address.longitude = this.data.address.longitude;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'addAddress',
        address:address,
        userid:that.data.userid,
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res);
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        that.setData({
          add:false,
          list:true,
          addressList:res.data.data
        })
      }
    })
  },
  updateAddress:function(e){         //修改地址页面打开并获取页面数据
    if(this.data.chooseAddress){
      return;
    }
    var that = this;
    var addresId = e.currentTarget.id;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'findAddressById',
        addresId:addresId,
        userid:this.data.userid,
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res);
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        that.setData({
          list:false,
          updatePage:true,
          update:res.data.data
        })
      }
    })
  },
  modifyAndDel:function(api,address){         //删除和修改封装成一个函数
    var that = this;
    var time = Date.parse(new Date());
    if(api == 'delAddress'){
      var param = {
        api:api,
        addresId:this.data.update.addresId,
        userid:this.data.userid,
        time:time
      }
    }
    if(api == 'updateAddress'){
      var param = {
        api:api,
        address:address,
        userid:this.data.userid,
        time:time
      }
    }
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: param,
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res);
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        that.setData({
          addressList:res.data.data,
          updatePage:false,
          list:true
        })
      }
    })
  },
  delAddress:function(){               //删除地址
    this.modifyAndDel('delAddress');
  },
  formUpdate:function(e){              //修改地址
    var address = e.detail.value;
    if(!address.addressname){
      return app.alerts('请输入姓名');
    }
    var res= /^1[34578]\d{9}$/;
    if(!res.test(address.tel)){
      return app.alerts('请输入正确的手机号吗');
    }
    if(!address.area){
      return app.alerts('请输入所在地区');
    }
    if(!address.details){
      return app.alerts('请输入详细信息');
    }
    address.addresId = this.data.update.addresId;
    address.latitude = this.data.address.latitude;
    address.longitude = this.data.address.longitude;
    this.modifyAndDel('updateAddress',address);
  },
  choose:function(e){           //选择地址
    var index = e.currentTarget.dataset.index
    this.setData({
      isChoose:index
    })
    app.globalData.address = this.data.addressList[index];
    wx.switchTab({
      url: '/pages/shopCar/shopCar'
    })
  }
})