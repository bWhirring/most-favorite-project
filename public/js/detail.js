const NebPay = require('nebpay');
const nebPay = new NebPay();
var dappAddress = "n22fCs1yMHWbkeDw85VRrDXctpcoAYdzq2T";

console.log(NebPay, nebPay);
var serialNumber;

function onButtonClick() {
  var to = dappAddress; //Dapp的合约地址
  var value = "0";
  var callFunction = "getAll";

  var callArgs = "" //参数格式为参数数组的JSON字符串, 比如'["arg"]','["arg1","arg2]'
  var options = {
    goods: { //商品描述
      name: "search github most favorite project"
    },
    //callback 是交易查询服务器地址,
    // callback: NebPay.config.mainnetUrl //在主网查询(默认值)
    // callback: NebPay.config.testnetUrl //在测试网查询
  }

  //发送交易(发起智能合约调用)
  serialNumber = nebPay.call(to, value, callFunction, callArgs, options);
  console.log(serialNumber, 1111111111);
  //设置定时查询交易结果
  // intervalQuery = setTimeout(function () {
  //   funcIntervalQuery();
  // }, 1000); //建议查询频率10-15s,因为星云链出块时间为15s,并且查询服务器限制每分钟最多查询10次。
}


function funcIntervalQuery() {
  //queryPayInfo的options参数用来指定查询交易的服务器地址,(如果是主网可以忽略,因为默认服务器是在主网查询)
  nebPay.simulateCall(serialNumber) //search transaction result from server (result upload to server by app)
    .then(function (resp) {
      console.log("tx result: " + resp) //resp is a JSON string
      var respObject = JSON.parse(resp)
      //code==0交易发送成功, status==1交易已被打包上链
      if (respObject.code === 0 && respObject.data.status === 1) {
        //交易成功,处理后续任务....
        clearInterval(intervalQuery) //清除定时查询
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
