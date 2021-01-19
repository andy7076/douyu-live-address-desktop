const axios = require('axios')
const express = require('express')()
const CryptoJS = require('crypto-js')
const FormData = require('form-data')
const request = require('request')

function getLiveAddress(roomid, callback) {
  axios.get('https://www.douyu.com/' + roomid)
    .then(res => {
      const funStr = /function ub98484234.+?v = (.+?)\.slice\(0\);.+?return eval.+?;}/g.exec(res.data)
      if (!funStr) {
        callback('请输入正确的roomid！')
        return
      }
      const vArr = new RegExp('var ' + funStr[1] + '=.+?;', "g").exec(res.data)
      eval(vArr[0])
      const func = { ub98484234: eval("(" + funStr[0] + ")") }
      const result = func.ub98484234(roomid, '48285d8f8211a6bc2431e39600051501', parseInt(new Date().getTime() / 1000))
      const postBody = {
        cdn: "",
        rate: 0,
        ver: "Douyu_220050105",
        iar: 1,
        ive: 0,
        hevc: 0
      }
      const fields = result.split('&')
      fields.forEach((field) => {
        const [key, value] = field.split('=')
        postBody[key] = value
      })

      var options = {
        method: 'post',
        url: 'https://www.douyu.com/lapi/live/getH5Play/' + roomid,
        form: postBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      request(options, function (err, res) {
        if (err) {
          callback(err.message)
        } else {
          const data = JSON.parse(res.body)
          if (data === '鉴权失败') {
            callback('鉴权失败')
            return
          }
          if (data.error !== 0) {
            callback(data.msg)
            return
          }
          const liveAddress = data.data.rtmp_url + '/' + data.data.rtmp_live
          callback(liveAddress)
        }
      })
    })
}

express.get('/live-address/:roomid', (req, response) => {
  if (!req.params.roomid) {
    res.end(JSON.stringify({
      code: 1,
      data: null,
      msg: '参数错误'
    }))
  }
  response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
  getLiveAddress(req.params.roomid, (data) => {
    if (data.includes('http')) {
      response.end(JSON.stringify({
        code: 0,
        data,
        msg: 'success'
      }))
    } else {
      response.end(JSON.stringify({
        code: 1,
        data: null,
        msg: data
      }))
    }
  })
})

express.listen(8080, () => {
  console.log('获取斗鱼地址的服务已在8080端口开启')
})