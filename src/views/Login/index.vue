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
        ref="ruleForm"
        class="login-from"
        size="medium"
      >
        <el-form-item prop="username" class="item-from">
          <label>邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-from">
          <label>密码</label>
          <el-input
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
          <label>确认密码</label>
          <el-input
            type="text"
            v-model="ruleForm.agenPasswd"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-from">
          <label>验证码</label>

          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                v-model.number="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                @click="submitForm('ruleForm')"
                class="block"
                >获取验证码</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="login-btn-19 block"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import { isRef, onMounted, reactive,ref, toRef, toRefs } from "@vue/composition-api";
import { GetSms } from "@/api/login.js";
import {
  stripscript,
  checkEmail,
  checkPasswd,
  checkCode
} from "@/utils/validate.js";
export default {
  name: `login`,
  setup(props, {refs}) {
    let validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (checkEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback(); //ture
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
    console.log(msgTab);
    const model= ref("login");
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
    console.log(isRef(msgTab)?"是基础数据":"是对象类型");
    function useMousePosition() {    
      const pos = reactive({
        x: 0,
        y: 0
      });
    return toRefs(pos);
    }
    const { x, y } = useMousePosition();
    console.log(x.value,y.value)
        // 数据驱动试图
    const  toggleMnew = (data => {
      msgTab.forEach(elem => {
        elem.current = false;
      });
      data.current = true;
      // 修改模块值
      model.value = data.type;
    });

    const submitForm = (formName => {
      $refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    });
    
    // 提交表单、获取验证码
    const getSms = () => {
      // alert(111111);
      GetSms();
    };
    onMounted (() => {

    })
    return {
      msgTab,
      model,
      toggleMnew,
      submitForm,
      ruleForm,
      rules
    }
  },

  
  created() {},
  mounted() {},
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
