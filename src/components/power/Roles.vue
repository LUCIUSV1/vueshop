<template>
    <div>
        <!--        面包屑-->
        <el-breadcrumb separator="/" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
           <el-row>
               <el-col>
                   <el-button type="primary" @click="openAddDialog">添加角色</el-button>
               </el-col>
           </el-row>

<!--            角色列表区域-->
            <el-table :data="roleList" border stripe>
<!--                展开列-->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row  :class="['bdbottom',i1===0? 'bdtop' : '' ,'vcenter']"
                                 v-for="(item1,i1) in scope.row.children"
                                 :key="item1.id">
<!--                            渲染一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
<!--                            渲染二三级权限-->
                            <el-col :span="19">
                                <el-row
                                        :class="[i2===0? '' :'bdtop' ,'vcenter']"
                                        v-for="(item2,i2) in item1.children"
                                        :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
<!--                        <pre>-->
<!--&lt;!&ndash;                            {{scope.row}}&ndash;&gt;-->
<!--                        </pre>-->
                    </template>
                </el-table-column>
<!--                索引列-->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon = "el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon = "el-icon-delete" @click="removeRole(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" icon = "el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--添加角色对话框-->
        <el-dialog
                title="添加角色"
                :visible.sync="addRoleDialogVisible"
                width="50%"
                @close="addRoleDialogClose"
        >
            <!--            主体-->
            <el-form  :model="addRoleList" :rules="addRoleRules" label-width="70px" ref="addRoleRef">
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="addRoleList.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="addRoleList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!--                底部-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改角色对话框-->
        <el-dialog
                title="修改角色"
                :visible.sync="EditRoleDialogVisible"
                width="80%"
                @close="editRoleDialogClose">
            <!--            主体-->
            <el-form  :model="editRoleForm" :rules="editRoleFormRules" label-width="70px" ref="editRoleFormRef">
                <el-form-item label="角色ID">
                    <el-input v-model="editRoleForm.roleId" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色名">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" >
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="EditRole">确 定</el-button>
              </span>
        </el-dialog>
<!--        分配权限对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
                @close="setRightsDialogClosed"
                >
<!--            树形控件-->
            <el-tree :data="rightsList"
                     show-checkbox
                     :props="treeProps"
                     node-key="id"
                     :default-checked-keys="defkeys"
                     :default-expanded-keys="defkeys"
                     ref="treeRef"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data(){
            return {
                //所有角色列表数据
                roleList:[],
                //添加角色列表数据
                addRoleList: {
                    roleName: '',
                    roleDesc: ''
                },
                rightsList:[],
                //添加角色的验证规则对象
                addRoleRules:{
                    roleName:[
                        {required:true,message :'请输入角色名',trigger:'blur'},
                        {min:2,max:10,message: "角色名长度在2-10个字符之间",trigger:"blur"}
                    ],
                },
                //添加角色对话框控制
                addRoleDialogVisible:false,
                //编辑角色对话框控制
                EditRoleDialogVisible:false,
                //编辑角色列表数据
                editRoleForm:{
                    roleId:'',
                    roleName:'',
                    roleDesc: ''
                },
                editRoleFormRules:{

                },
                setRightDialogVisible:false,
                //树形控件属性绑定对象
                treeProps:{
                    label :'authName',
                    children :'children'
                },
                //默认选中的节点值ID数组
                defkeys:[

                ],
                //当前即将分配权限的ID
                roleId:''
            }
        },
        created() {
            this.getRolesList()
        },
        methods:{
            async getRolesList(){
                const{data:res} = await this.$http.get('roles')

                if(res.meta.status!== 200){
                    return this.$message.error('获取角色列表失败')
                }
                this.roleList =res.data
                // console.log(this.roleList)
            },
            //添加监听添加角色对话框关闭事件
            addRoleDialogClose(){
                this.$refs.addRoleRef.resetFields()
            },
            //添加角色操作
            addRoles(){
                this.$refs.addRoleRef.validate(async valid=>{

                    // console.log(valid)
                    if(!valid) return

                    const {data:res} = await this.$http.post('roles/',this.addRoleList)
                    if(res.meta.status!=200){
                        this.$message.error('添加角色失败')
                    }
                    this.$message.success('添加角色成功')

                    this.addRoleDialogVisible =false

                    await this.getRolesList()
                })
            },
            //打开添加对话框
            openAddDialog(){
                this.addRoleDialogVisible = true
            },
            editRoleDialogClose(){
                this.EditRoleDialogVisible = false
            },
            //打开编辑角色对话框
            async showEditDialog(id){
                this.EditRoleDialogVisible = true
                const {data:res} = await this.$http.get('roles/'+id)
                if(res.meta.status !=200){
                    this.$message.error('查询角色信息失败')
                }
                this.editRoleForm = res.data
                this.EditRoleDialogVisible = true
            },
            async EditRole(){
                 const {data:res} =await this.$http.put('roles/'+this.editRoleForm.roleId,{
                    roleName:this.editRoleForm.roleName,
                    roleDesc:this.editRoleForm.roleDesc
                })
                // console.log(res)
                if(res.meta.status !==200){
                    return this.$message.error('更新角色信息失败')
                }
                 this.EditRoleDialogVisible =  false

                await this.getRolesList()
                this.$message.success('更新角色信息成功')
            },
            async removeRole(id){
                //弹框询问是否删除
                const  res = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>{
                    return err
                })

                if(res!=='confirm')
                {
                    return this.$message.info('取消删除')
                }
                const{data
                :res1} = await this.$http.delete('roles/'+id)
                if(res1.meta.status!==200){
                    return this.$message.error('删除角色失败')
                }
                this.$message.success('删除角色成功')
                await this.getRolesList()
            },
            async removeRightById(role,rightId){
                //弹框询问是否删除
                const  res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>{
                    return err
                })
                if(res!=='confirm'){
                    return this.$message.info('取消删除')
                }

                const {data:res1} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if(res1.meta.status!==200){
                    return this.$message.error('删除权限失败')
                }
                // await this.getRolesList()

                // console.log(role.children)
                this.$message.success('删除权限成功')
                role.children= res1.data

            },
            //展示分配权限对话框
             async showSetRightDialog(role){
                this.roleId  = role.id
                //获取所有权限的数据

                const  {data:res} = await this.$http.get('rights/tree')

                 if(res.meta.status!== 200){
                     return this.$message.error('获取权限数据失败')
                 }
                 this.rightsList =res.data

                 //递归获取三级节点ID
                 this.getLeafKeys(role,this.defkeys)
                 this.setRightDialogVisible = true

            },
            //通过递归的形式获取角色下所有三级权限ID 并保存到数组中
            getLeafKeys(node,arr){
                //如果当前node节点不包含子属性 则是三级节点
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item=>this.getLeafKeys(item,arr))


            },
            //监听分配权限对话框的关闭事件
            setRightsDialogClosed(){
                this.defkeys = []
            },
            //点击为角色分配权限
           async allotRights(){
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                // console.log(keys)
                const idStr = keys.join(',')

               const {data:res} =  await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
               if(res.meta.status !==200){
                   return this.$message.error('分配权限失败')
               }
               this.$message.success('分配权限成功')
               this.getRolesList()
               this.setRightDialogVisible = false
            }

        }
    }
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
    .bdtop{
        border-top: 1px solid #eeeeee;
    }
    .bdbottom{
        border-bottom: 1px solid #eeeeee;

    }
    .vcenter{
        display: flex;
        align-items: center;
    }

</style>
