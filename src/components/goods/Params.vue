<template>
    <div>
        <!--        面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert
                    title="注意：只允许为第三季级分类设置相关参数"
                    type="warning"
                    :closable="false"   show-icon>
            </el-alert>

            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
<!--                    选择商品的级联选择框-->
                    <el-cascader
                            expand-trigger="hover"
                            v-model="selectedKeys"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

<!--            tab-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
<!--                    动态表格-->
                   <el-table
                   :data="manyTableData" border stripe>
                            <el-table-column type="expand">
                                <template slot-scope="scope">
<!--                                   循环渲染tag标签 -->
                                    <el-tag closable class="el-tag" v-for="(item,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
<!--                                   输入文本框-->
                                    <el-input
                                            class="input-new-tag"
                                            v-if="inputVisible"
                                            v-model="inputValue"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="handleInputConfirm"
                                            @blur="handleInputConfirm"
                                    >
                                    </el-input>
<!--                                    添加按钮-->
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                                </template>
                            </el-table-column>
                            <el-table-column type="index"></el-table-column>
                            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                    <el-button type="danger"  size="mini" icon="el-icon-delete"  @click="deleteEdit(scope.row.attr_id)">删除</el-button>
                                </template>
                            </el-table-column>
                   </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                    <el-table
                            :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag closable class="el-tag" v-for="(item,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
<!--                                <el-input-->
<!--                                        class="input-new-tag"-->
<!--                                        v-if="inputVisible"-->
<!--                                        v-model="inputValue"-->
<!--                                        ref="saveTagInput"-->
<!--                                        size="small"-->
<!--                                        @keyup.enter.native="handleInputConfirm"-->
<!--                                        @blur="handleInputConfirm"-->
<!--                                >-->
<!--                                </el-input>-->
<!--                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>-->

                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger"  size="mini" icon="el-icon-delete" @click="deleteEdit(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
             </el-tabs>
        </el-card>

<!--添加参数对话框-->
        <el-dialog
                :title="'添加'+titleText"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
               >
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
<!--        修改参数对话框-->
        <el-dialog
                :title="'修改'+titleText"
                :visible.sync="EditDialogVisible"
                width="50%"
                @close="EditDialogClosed"
        >
            <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="EditForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="EditParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Params",
        data(){
            return {
                cateList:[],
                //级联选择框
                cateProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },

                selectedKeys:[],
                //被激活的页签的名字
                activeName:'many',
                //动态参数数据
                manyTableData:[],
                //静态属性数据
                onlyTableData:[],
                addDialogVisible:false,
                addForm:{
                    attr_name:''
                },
                addFormRules:{
                    attr_name:[
                        {required:true,message :'请输入内容',trigger:'blur'}
                    ]
                },
                EditDialogVisible:false,
                EditForm:{
                    attr_name:''
                },
                EditFormRules:{
                    attr_name:[
                        {required:true,message :'请输入内容',trigger:'blur'}
                    ]
                },
                //
                inputVisible:false,
                inputValue:''
            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            //获取所有商品分类
            async getCateList(){
                const {data:res} = await this.$http.get('categories')
                // console.log(res)
                if(res.meta.status!==200){
                    return this.$message.error('获取商品分类失败')
                }
                this.cateList = res.data
                console.log(this.cateList)
            },
            //级联选择框选中改变的属性
             handleChange(){
                this.getParamsData()
            },
            //tab页签点击事件触发函数
            handleTabClick(){
                this.getParamsData()
             }
             ,
            async getParamsData(){
                // console.log(this.selectedKeys)
                if(this.selectedKeys.length!==3){
                    this.selectedKeys= []
                    return
                }
                //根据所选分类的id 和当前所处的面板获取对应的参数
                const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{
                        sel:this.activeName
                    }
                })

                if(res.meta.status!==200){
                    return this.$message.error('获取参数失败')
                }
                // console.log(res)
                res.data.forEach(item=>{
                    item.attr_vals= item.attr_vals ? item.attr_vals.split(',') :[]
                })
                console.log(res.data)
                if(this.activeName==='many'){
                    this.manyTableData = res.data
                }else{
                    this.onlyTableData =res.data
                }
            },
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            //点击新增
            addParams(){
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid) return
                    const {data:res} =await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name:this.addForm.attr_name,
                        attr_sel:this.activeName
                    })
                    if(res.meta.status!==201){
                        return this.$message.error('添加参数失败')
                    }
                    this.$message.success('添加参数成功')
                    this.addDialogVisible = false
                    await this.getParamsData()
                })
            },
            async showEditDialog(attr_id){

                const {data:res}  = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
                    params:{
                        attr_sel:this.activeName,
                    }
                })
                if(res.meta.status!==200){
                    return this.$message.error('获取参数信息失败')
                }
                this.EditForm = res.data
                this.EditDialogVisible= true
            },
            EditDialogClosed(){
                this.$refs.EditFormRef.resetFields()
            },
            EditParams(){
                this.$refs.EditFormRef.validate(async valid=>{
                    if(!valid) return
                    const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.EditForm.attr_id}`,{
                        attr_name:this.EditForm.attr_name,
                        attr_sel:this.activeName
                    })
                    if(res.meta.status!==200){
                        return this.$message.error('修改参数失败')
                    }
                    this.$message.success('修改参数成功')
                    await this.getParamsData()
                    this.EditDialogVisible = false
                })
            },

            async deleteEdit(attr_id){
                //弹框询问是否删除
                const  res = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
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
                const {data:res1} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if(res1.meta.status!==200){
                    return this.$message.error('删除参数失败')
                }
                this.$message.success('删除参数成功')
                await this.getParamsData()
            },
            //文本失去焦点或者点击回车
            handleInputConfirm(){
                console.log('ok')
            },
            showInput(){
                this.inputVisible = true
            }
        },
        computed:{
            //如果按钮需要被禁用 则返回true
            isBtnDisabled(){

                if(this.selectedKeys.length!==3){
                    return true
                }
                return false
            },
            //当前选中的三级分类id
            cateId(){
                if(this.selectedKeys.length ===3){
                    return this.selectedKeys[2]
                }
                return null
            },
            titleText(){
                if(this.activeName==='many'){
                    return '动态参数'
                }
                return '静态属性'
            }
        }
    }
</script>

<style style="less" scoped>
.cat_opt{
    margin: 15px 0;
}
.el-tag{
    margin: 10px;
}
    .input-new-tag{
        width: 120px;
    }
</style>
