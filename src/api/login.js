import service from "@/utils/request.js";
/* 获取验证码 */
export function GetSms() {
  service.request({
    url: "/getSms",
    method: "port",
    data: {
      firsName: "fanneng@enn.cn",
      lastName: "Fnw"
    }
  });
}

/* 获取用户角色 */

/* 登录 */

/* 注册 */
