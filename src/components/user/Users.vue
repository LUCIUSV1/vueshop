<template>
    <div>
<!--        面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片-->
        <el-card class="box-card">
<!--            搜索-->
            <el-row>
                <el-col :span="7">
                    <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList" ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">
                        添加用户
                    </el-button>
                </el-col>
            </el-row>

<!--            用户列表区域-->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
<!--                    作用域插槽-->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStatesChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="" width="180px">
                    <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                            <el-button type="danger" icon="el-icon-delete"   size="mini"></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1,2,5]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
<!--添加用户对话框-->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                >
<!--            主体-->
            <el-form  :model="addForm" rules="addFormRules" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
            </el-form>
<!--                底部-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Users",
        data(){
            return {
                //获取用户列表参数
                queryInfo:{
                    query:'',
                    pagenum :1,
                    pagesize:5
                },
                userList :[],
                total:0,
                //控制添加用户对话框的显示与隐藏
                addDialogVisible:false,
                //添加用户的表单数据
                addForm:{
                    username: ''
                },
                //添加表单的验证规则对象
                addFormRules:{
                    username:[
                        {required:true,message :'请输入用户名',trigger:'blur'},
                        {min:3,max:10,message: "用户名长度在3-10个字符之间",trigger:"blur"}
                    ]
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods:{
            async getUserList(){
                 const {data:res} = await this.$http.get('users',{
                    params:
                        this.queryInfo
                })
                if(res.meta.status !== 200) {return this.$message.error('获取用户列表失败')}
                this.userList = res.data.users
                this.total = res.data.total
                console.log(res)
            },
            //监听pageSize改变的事件
            handleSizeChange(newSize){
                // console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            //监听页码值改变的事件
            handleCurrentChange(pageNum){
                // console.log(pageNum)
                this.queryInfo.pagenum = pageNum
                this.getUserList()
            },
            //监听switch开关状态的改变
            async userStatesChanged(userInfo){
                // console.log(userInfo)
                const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                console.log(userInfo.mg_state)
                console.log(res)
                if(res.meta.status !== 200)
                {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error('更新用户状态失败')
                }
                this.$message.success('更新用户状态成功')

            }
        }
    }
</script>

<style lang="less" scoped>

</style>
