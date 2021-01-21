function getLiveAddress(roomid, callback) {
  $.ajax({
    url: 'https://www.douyu.com/' + roomid,
    success: function (res) {
      console.log(res)
      const funStr = /function ub98484234.+?v = (.+?)\.slice\(0\);.+?return eval.+?;}/g.exec(res)
      console.log(funStr)
      if (!funStr) {
        callback('请输入正确的roomid！')
        return
      }
      const vArr = new RegExp('var ' + funStr[1] + '=.+?;', "g").exec(res)
      eval(vArr[0])
      const func = { ub98484234: eval("(" + funStr[0] + ")") }
      const result = func.ub98484234(roomid, random32Str(32), parseInt(new Date().getTime() / 1000))
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

      $.ajax({
        type: options.method,
        url: options.url,
        headers: options.headers,
        data: options.form,
        success: function (res) {
          if (res.error === 0) {
            var data = res.data
            var liveAddress = data.rtmp_url + '/' + data.rtmp_live
            callback(liveAddress)
          } else {
            callback(res.msg)
          }
        },
        error: function (err) {
          callback(err.responseText)
        }
      });
    }
  });
}

function random32Str(len) {
  len = len || 32;
  var $chars = 'abcdefhijkmnprstwxyz012345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var str = '';
  for (i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

