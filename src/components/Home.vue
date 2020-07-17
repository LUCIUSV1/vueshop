<template>
    <el-container class="home-container">
<!--        头部-->
        <el-header>
            <div class="header-div">
                <img src="../assets/avator.jpg" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
<!--        主题区域-->
        <el-container>
<!--            侧边栏-->
            <el-aside :width="isCollapsed ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapsce" >|||</div>
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        :unique-opened="true "
                        active-text-color="#409EFF"
                        :collapse="isCollapsed"
                        :collapse-transition="false"
                        :default-active="activePath"
                        :router="true"
                >

                    <el-submenu :index="item.id+' '" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
                            :key="subItem.id"
                            @click="saveNavStatus('/'+subItem.path)">
                            <span>{{subItem.authName}}</span>
                        </el-menu-item>
                    </el-submenu>


                </el-menu>
            </el-aside>
<!--            主体-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>



</template>

<script>
    export default {
        data(){
            return{
                //左侧菜单数据
                menuList:[],
                iconObj:{
                    '125':'iconfont icon-user',
                    '102':'iconfont icon-tijikongjian',
                    '101':'iconfont icon-shangpin',
                    '103':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao'
                },
                //是否折叠
                isCollapsed:false,
                //激活连接地址
                activePath:''
            }
        },
        name: "Home",
        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            //获取所有菜单
            async getMenuList(){
               const {data:res} = await this.$http.get('menus')
                if(res.meta.status!=200) return this.$message.error(res.meta.msg)
                this.menuList = res.data
                // console.log(res)
            },
            //点击切换菜单折叠与展开
            toggleCollapsce(){
                this.isCollapsed = !this.isCollapsed
            },
            saveNavStatus(activePath){
                window.sessionStorage.setItem('activePath',activePath)
                this.activePath = activePath
            }
        },
        created() {
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')
        }
    }
</script>

<style scoped>
    .header-div{
        display: flex;
        align-items: center;
    }
    span{
        margin-left: 15px;

    }
    .el-menu{
        border-right: none;
    }
    .el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0px;
        align-items: center;
        color: white;
        font-size: 20px;
    }
    .el-aside{
        background-color: #333744;
    }
    .el-main{
        background-color: #eaedf1;
    }
    .home-container{
        height: 100%;
    }
    .toggle-button{
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: #fffdef;
        text-align: center;
        letter-spacing: 0.2px;
    }
</style>
