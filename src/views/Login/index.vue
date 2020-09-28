<template>
  <div id="login">
    <div class="login-warp">
      <ul class="menu-tab">
        <li
          :class="{ current: item.current }"
          v-for="item in msgTab"
          @click="toggleMnew(item)"
          :key="item.id"
        >
          {{ item.txt }}
        </li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginFrom"
        class="login-from"
        size="medium"
      >
        <el-form-item prop="username" class="item-from">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-from">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="agenPasswd"
          class="item-from"
          v-show="model === 'reg'"
        >
          <label for="againPassword">确认密码</label>
          <el-input
            id="againPassword"
            type="text"
            v-model="ruleForm.agenPasswd"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-from">
          <label for="code">验证码</label>

          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                id="code"
                v-model.number="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                @click="getSms()"
                class="block"
                :disabled="codeCentext.status"
                >{{ codeCentext.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginFrom')"
            class="login-btn-19 block"
            :disabled="loginButtonStatus"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import {
  isRef,
  onMounted,
  reactive,
  ref,
  toRef,
  toRefs
} from "@vue/composition-api";
import { GetSms, Register, Login } from "@/api/login.js";
import {
  stripscript,
  checkEmail,
  checkPasswd,
  checkCode
} from "@/utils/validate.js";
export default {
  name: `login`,
  setup(props, { refs, root }) {
    // let validateUserName = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入用户名"));
    //   } else if (checkEmail(value)) {
    //     callback(new Error("用户名格式有误"));
    //   } else {
    //     callback(); //ture
    //   }
    // };
    let validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (checkEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback(); //true
      }
    };
    // 校验密码
    let validatePass = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (checkPasswd(value)) {
        callback(new Error("请输入正确的密码格式!"));
      } else {
        callback();
      }
    };

    // 校验二次密码
    let valiagenPass = (rule, value, callback) => {
      if (model.value === "login") {
        callback();
      }
      ruleForm.agenPasswd = stripscript(value);
      value = ruleForm.agenPasswd;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("两次密码输入不一致!"));
      } else {
        callback();
      }
    };

    // 校验验证码
    let checkcode = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入验证码"));
      } else if (checkCode(value)) {
        return callback(new Error("请输入正确格式的验证码"));
      } else {
        callback();
      }
    };

    const msgTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "reg" }
    ]);
    const model = ref("login");

    // 登录模块禁用状态
    const loginButtonStatus = ref(true);

    // 验证码模块

    const codeCentext = reactive({
      status: false,
      text: "获取验证码"
    });

    const ruleForm = reactive({
      username: "",
      password: "",
      agenPasswd: "",
      code: ""
    });
    const rules = reactive({
      username: [{ validator: validateUserName, trigger: "blur" }],
      password: [{ validator: validatePass, trigger: "blur" }],
      agenPasswd: [{ validator: valiagenPass, trigger: "blur" }],
      code: [{ validator: checkcode, trigger: "blur" }]
    });
    console.log(isRef(msgTab) ? "是基础数据" : "是对象类型");

    function useMousePosition() {
      const pos = reactive({
        x: 0,
        y: 0
      });
      return toRefs(pos);
    }

    // 数据驱动试图
    const toggleMnew = data => {
      msgTab.forEach(elem => {
        elem.current = false;
      });
      data.current = true;
      // 修改模块值
      model.value = data.type;
      // 重置表单
      refs.loginFrom.resetFields();
    };
    // 提交表单
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    // 登录方法
    const login = () => {
      let requestdata = {
        username: ruleForm.username,
        paassword: ruleForm.password,
        code: ruleForm.code,
        module: "login"
      };
      Login()
        .then(response => {})
        .catch(err => {});
    };

    // 注册方法
    const register = () => {
      let requestdata = {
        username: ruleForm.username,
        paassword: ruleForm.password,
        code: ruleForm.code,
        module: "register"
      };
      Register(requestdata)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 模拟注册成功
          toggleMnew(msgTab[0]);
          clearCountDown();
        })
        .catch(error => {});
    };

    const timer = ref(null);
    // 倒计时
    const counDown = number => {
      // setTimeout:clearTimeout(变量)只执行一次
      // setInterval:clearInterval(变量)不断执行，需要条件才会停止
      let time = number;
      timer.value = setInterval(() => {
        // 判断定时器是否存在，存在则清除
        if (timer.value) {
          clearInterval(timer.value);
        }
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          // 修改获取验证码按钮状态
          codeCentext.status = false;
          codeCentext.text = "再次获取";
        } else {
          codeCentext.text = `倒计时${time}秒`;
        }
      }, 1000);
    };

    /*
     *清除倒计时
     */
    const clearCountDown = () => {
      codeCentext.status = false;
      codeCentext.text = "获取验证码";
      clearInterval(timer.value);
      // const codeCentext = reactive({
      //   status: false,
      //   text: "获取验证码"
      // });
    };

    // 提交表单、获取验证码
    const getSms = () => {
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空");
        return false;
      }
      if (checkEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误，请重新输入！！");
        return false;
      }
      let data = {
        username: ruleForm.username,
        module: model.value
      };

      // 修改获取验证码按钮状态
      codeCentext.status = true;
      codeCentext.text = "已发送";

      setTimeout(() => {
        GetSms(data)
          .then(response => {
            let data = response.data;
            root.$message({
              message: data.message,
              type: "success"
            });
            // 计时器

            // 启动登录和发送按钮
            loginButtonStatus.value = false;
            counDown(5);
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      }, 5000);
    };
    onMounted(() => {
      // GetSms()
    });
    return {
      msgTab,
      model,
      toggleMnew,
      submitForm,
      ruleForm,
      rules,
      getSms,
      loginButtonStatus,
      codeCentext
    };
  },

  created() {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-warp {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-from {
  margin-top: 20px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-from {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn-19 {
    margin-top: 19px;
  }
}
</style>

