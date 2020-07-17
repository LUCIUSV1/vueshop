<template>
    <div class="login_container" :style="bgImg">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/avator.jpg" alt="">
            </div>
            <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0px" class="login_form">
<!--                <el-form-item prop="usernames">-->
<!--                    <el-input  v-model="loginForm.userName" prefix-icon="iconfont icon-user"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item  prop="userName">
                    <el-input  v-model="loginForm.username" prefix-icon="iconfont icon-user"  placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item  prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"  placeholder="请输入密码"  @keyup.enter.native="LOGIN"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="LOGIN" >登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    //设置背景图片
    const url = require("../assets/bkimg.jpg");
    export default {
        name: "Login",
        data() {
            return {
                bgImg: {
                    backgroundImage: "url(" + url + ")",
                    backgroundRepeat: "repeat",
                    backgroundSize: "100% auto"
                },
                loginForm:{
                    username:'admin',
                    password:'123456'
                },
                rules:{
                    username : [
                        {type: "string",required :true,message:"请输入用户名",trigger:"blur"},
                        {min:3,max:10,message: "用户名长度在3-10个字符之间",trigger:"blur"}
                    ],
                    password :[
                        {required :true,message:"请输入密码",trigger:"blur"},
                        {min:6,max:15,message: "密码长度在6-15个字符之间",trigger:"blur"}
                    ]
                }
            };
        }
        ,methods:{
            resetForm(){
                // console.log(this)
                this.$refs.loginFormRef.resetFields()
            },
            LOGIN(){
                this.$refs.loginFormRef.validate( async (vaild)=>{
                    // console.log(vaild)
                    if(!vaild) return ;
                    const  result = await this.$http.post('/login',this.loginForm)
                        // {
                        //     params:{
                        //         userName: this.loginForm.userName,
                        //         password: this.loginForm.password
                        //     }
                        // });
                    // console.log(this.loginForm)
                    console.log(result)
                    if (result.data.meta.status!= '200') return this.$message.error('登录失败')
                    this.$message.success('登录成功')
                    window.sessionStorage.setItem('token',result.data.data.token)

                    await this.$router.push('/home')
                })

            }
        }
    }
</script>

<style scoped>
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #ffff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%  ;
        transform: translate(-50%,-50%);
        border-radius: 10px;

        box-shadow: 0 0 10px #ddd;
    }
    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 60%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

</style>
