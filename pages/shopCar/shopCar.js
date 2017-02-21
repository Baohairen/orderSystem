//获取应用实例
var app = getApp()
Page({
  data:{
    model:'1',   //0表示无货，1表示外卖，2表示堂食
    shops:'active',  //商家配送
    self:'',          //上门自取
    address:{'person':'张三','phone':'13890989098','address':'高新区东邦新苑南区'},    //用户地址信息
    payway:{'online':'border_active','offline':''},    //支付方式
    goods_info:[{'number':'888001','name':'披萨A','price':'8','num':'2','imgurl':'http://127.0.0.1/images/%E8%BD%AE%E6%92%AD/01.jpg'},
                {'number':'888002','name':'披萨B','price':'10','num':'1','imgurl':'http://127.0.0.1/images/%E8%BD%AE%E6%92%AD/02.jpg'}],
    good_price:'',
    full_price:'',
    date: '2017-03-01',
    time: '12:01'
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
  onShow:function(){
    var price = [];
    var sum = 0;
    var date = new Date();
    var year = date.getFullYear();
    var month = parseInt(date.getMonth())+1;
    var day = date.getDate();
    for (var i = 0; i < this.data.goods_info.length; i++) {
      price[i] = this.data.goods_info[i].price*this.data.goods_info[i].num;
    };
    for (var i = 0; i < price.length; i++) {
      sum = sum + parseInt(price[i]);
    };
    if(sum > 99){
      this.setData({
        good_price:sum,
        full_price:sum,
        date:year+'-'+month+'-'+day
      })
    }
    this.setData({
      good_price:sum,
      full_price:sum+6,
      date:year+'-'+month+'-'+day
    })
  },
  switchs:function(e){
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
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  minus:function(e){
    var number = e.currentTarget.id.substr(8);
    console.log(number);
    this.setData({
      goods_info:[{'number':'888001','name':'披萨A','price':'8','num':'1','imgurl':'http://127.0.0.1/images/%E8%BD%AE%E6%92%AD/01.jpg'},
                {'number':'888002','name':'披萨B','price':'10','num':'1','imgurl':'http://127.0.0.1/images/%E8%BD%AE%E6%92%AD/02.jpg'}] 
    })
  },
  plus:function(e){
    var number = e.currentTarget.id.substr(7);
    console.log(number);
    this.setData({
      goods_info:[{'number':'888001','name':'披萨A','price':'8','num':'1','imgurl':'http://127.0.0.1/images/%E8%BD%AE%E6%92%AD/01.jpg'},
                {'number':'888002','name':'披萨B','price':'10','num':'2','imgurl':'http://127.0.0.1/images/%E8%BD%AE%E6%92%AD/02.jpg'}] 
    })
  }
})