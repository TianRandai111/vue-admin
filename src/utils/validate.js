// 过滤特殊字符,需要export将方法暴露出去
export function stripscript(s) {
  var pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]"
  );
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, "");
  }
  return rs;
}

// 验证邮箱
export function checkEmail(s) {
  let re = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return !re.test(s) ? true : false;
  // if (!re.test(s)){
  //     return true
  // }else{
  //     return false
  // }
}

// 验证密码
export function checkPasswd(s) {
  let passwd = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  return !passwd.test(s);
}

// 校验验证码
export function checkCode(s) {
  let codes = /^[a-z0-9]{6}$/;
  return !codes.test(s);
}
