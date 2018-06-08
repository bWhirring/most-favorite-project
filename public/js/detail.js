var dappAddress = "n22fCs1yMHWbkeDw85VRrDXctpcoAYdzq2T";
var nebulas = require("nebulas"),
  Account = nebulas.Account,
  neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io/"));
//to check if the extension is installed
//if the extension is installed, var "webExtensionWallet" will be injected in to web page
if (typeof webExtensionWallet === "undefined") {
  alert(
    "https://github.com/ChengOrangeJu/WebExtensionWallet  is not installed, please install it first."
  );
}

function getAll() {
  var from = Account.NewAccount().getAddressString();

  var value = "0";
  var nonce = "0";
  var gas_price = "1000000";
  var gas_limit = "2000000";
  var callFunction = "getAll";
  var callArgs = '["' + $("#project").val() + '"]'; //in the form of ["args"]

  var contract = {
    function: callFunction
    // "args": callArgs
  };

  neb.api
    .call(from, dappAddress, value, nonce, gas_price, gas_limit, contract)
    .then(function(resp) {
      cbSearch(resp);
    })
    .catch(function(err) {
      //cbSearch(err)
      console.log("error:" + err.message);
    });
}

function cbSearch(resp) {
  var result = resp.result; ////resp is an object, resp.result is a JSON string
  console.log("return of rpc call: " + JSON.stringify(result));
}

const NebPay = require("nebpay");
const nebPay = new NebPay();

var serialNumber;

function onButtonClick() {
  var to = dappAddress; //Dapp的合约地址
  var value = "0";
  var callFunction = ""; //调用的函数名称
  var callArgs = ""; //参数格式为参数数组的JSON字符串, 比如'["arg"]','["arg1","arg2]'
  var options = {
    goods: {
      //商品描述
      name: "search github most favorite project"
    }
    //callback 是交易查询服务器地址,
    // callback: NebPay.config.mainnetUrl //在主网查询(默认值)
    // callback: NebPay.config.testnetUrl //在测试网查询
  };

  //发送交易(发起智能合约调用)
  serialNumber = nebPay.call(to, value, callFunction, callArgs, {
    listener: cbPush
  });
}

function cbPush(resp) {
  console.log("response of push: " + JSON.stringify(resp));
}
