import APIConnection from './APIConnection'
import { url, projectName, wsUrl, username, passwd, debug } from './config.js'

window.homePath = '/a/b'
// const url = '47.104.245.204'
// const projectName = 'hfh2'
// const port = '51717'
// const wsUrl = `ws://${url}:${port}/${projectName}`
// const username = 'test1'
// const passwd = '1'
// const debug = true

window.uploadUrl = `http://${url}/cgi-bin/upload.pl?proj=${projectName}`
window.download = `http://${url}/cgi-bin/download.pl?proj=${projectName}&fid=`
// window.download = `http://${url}/cgi-bin/download.pl?fid=`
window.projectName = projectName
var apiInfoData = {}
var apiCallback = {}
window.apiconn = null

function getData (attr, callback) {
  // attr.person_id=person_id;
  window.console.info('send:', JSON.stringify(attr))
  // 发送信息
  apiCallback[attr.obj + '_' + attr.act] = function (data) {
    // window.console.log("获取信息:",data);
    if (callback) {
      callback(data)
    }
  }
  apiconn.send_obj(attr)
}

function startApiconn () {
  // 全局SDK用的变量 【初始化和登录 A】
  apiconn = new APIConnection()
  // 服务端连接状态改变了的通知 【初始化和登录 B】
  apiconn.state_changed_handler = function (ds) {
    // window.console.log(ds, 'state: ' + apiconn.from_state, ' => ' + apiconn.conn_state)
    // 这时候成功进入登录状态了。没登录时候只是访客状态。
    if (apiconn.conn_state == 'IN_SESSION') {
      sessionStorage.setItem('login_name', apiconn.login_name)
      sessionStorage.setItem('login_passwd', apiconn.login_passwd)
      // 连接状态，表明SDK和服务端已经成功连上，获得了 server_info
      // 客户端可以允许用户输入密码（或从客户端保存密码）进行登录了
    } else if (apiconn.conn_state == 'LOGIN_SCREEN_ENABLED') {

      // 自动登录指定账户
      // apiconn.credential(login_name, login_passwd);
      // apiconn.connect();
      // auto re login after page refresh
      // 处理网页刷新自动登录的机制
    }
  }
  // SDK 说服务端有数据过来了，这可以是请求的响应，或推送 【初始化和登录 C】
  apiconn.response_received_handler = function (jo) {
    var key = jo.obj + '_' + jo.act
    // window.console.log(key, 'JO:', jo)
    if (key == 'server_info') {
      apiInfoData = jo
    }
    if (apiCallback[key]) {
      apiCallback[key](jo)
    }
  }
}
var isconect = false
window.islogin = false
var init = function (startCall) {
  startApiconn()
  window.apiconn.wsUri = wsUrl
  var server_infoCall = function () {
    if (debug) {
      window.server.login(username, passwd, function () {
        isconect = true
        if (startCall) {
          startCall()
        }
      })
    } else {
      isconect = true
      if (startCall) {
        startCall()
      }
    }
  }

  apiCallback['server_info'] = function () {
    server_infoCall()
  }
  window.apiconn.connect()
}

window.server = {
  logout (cb) {
    window.isLogin = false
    location.hash = '#/login'
    cb()
  },
  // 登录
  login: function (account, code, call) {
    // var type = 1
    apiCallback['person_login'] = function (data) {
      window.isLogin = true
      location.hash = '#/'
      if (call) {
        call(data)
      }
    }
    var attr = {
      'level': 'admin',
      'login_name': account,
      'login_passwd': code
    }
    apiconn.credentialx(attr)
    apiconn.connect()
  },
  send (attr, call) {
    if (isconect) {
      getData(JSON.parse(JSON.stringify(attr)), function (data) {
        if (call) {
          call(data)
        }
      })
    } else {
      setTimeout(() => { window.server.send(attr, call) }, 500)
    }
  },
  admin_accountlist: function (call) {
    // 账号列表
    var attr = {
      'obj': 'admin',
      'act': 'accountlist'
    }
    getData(attr, function (data) {
      if (call) {
        call(data)
      }
    })
  }
}
init()
