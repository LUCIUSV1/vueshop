<template>
    <div>
        <!--        面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

<!--            表格占位-->

            <tree-table class="treeTable"
                    :data="cateList"
                    :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index border :show-row-hover="false"
            index-text="#">

<!--                是否有效模板-->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted ===false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red   "></i>
                </template>
<!--                排序模板-->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini"  v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini"  v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                    <el-tag size="mini"  v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row)">编辑</el-button>
                    <el-button type="warning" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row)">删除</el-button>

                </template>
            </tree-table>
<!--            分页区域-->

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

<!--        添加分类对话框-->
        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                width="30%"
                @close="addCateDialogClose"
        >
            <!--            主体-->
            <el-form :model="addCateForm"
                     :rules="addCateFormRules"
                     ref="addCateFormForm"
                     label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:" >
<!--                    <el-input v-model="addCateForm.cat_name"></el-input>-->

<!--                    -->
<!--               change-on-select 允许选中任意一行
                    clearable 可以被清空
                      expand-trigger 鼠标移动附近触发事件
      -->
                    <el-cascader
                            change-on-select
                            clearable
                            class="el-cascader"
                            expandTrigger="hover"
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!--                底部-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改用户对话框-->
        <el-dialog
                title="修改分类"
                :visible.sync="EditCateDialogVisible"
                width="80%"
        >
            <!--            主体-->
            <el-form  :model="editCateForm" :rules="editCateFormRules" label-width="70px" ref="editCateFormRef">
                <el-form-item label="分类名" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="putEditCateName">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Cate",
        data (){
            return {
                //商品分类的数据列表
                cateList:[],
                //查询条件数组
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                //总数据条数
                total:0,
                //为table指定列的定义
                columns:[
                    {
                        label:'分类名称',
                        prop:'cat_name'
                    },
                    {
                        label:'是否有效',
                        //模板列
                        type:'template',
                        template:'isok'
                    },
                    {
                        label:'排序',
                        //模板列
                        type:'template',
                        template:'order'
                    },
                    {
                        label:'操作',
                        //模板列
                        type:'template',
                        template:'opt'
                    }
                ]
                ,
                //控制添加分类对话框的隐藏
                addCateDialogVisible:false,
                addCateForm:{
                    cat_name:'',
                    //父级分类id
                    cat_pid:0,
                    //默认添加一级分类
                    cat_level:0
                },
                addCateFormRules:{
                    cat_name:[
                        {required:true,message :'请输入分类名称',trigger:'blur'}
                    ]
                },
                //父级分类列表
                parentCateList:[],
                //指定级联选择器的对象
                cascaderProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                //选中的父级分类的id数组
                selectedKeys(){

                },
                EditCateDialogVisible:false,
                editCateForm:{
                    cat_name:'',
                    cat_id:''
                },
                editCateFormRules:{
                    cat_name:[
                        {required:true,message :'请输入分类名称',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            //获取商品分类数据
            async getCateList(){
                const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
                if(res.meta.status!==200){
                    return this.$message.error('获取商品分类失败')
                }
                // console.log(res.data)
                this.cateList = res.data.result
                //总数据条数赋值
                this.total = res.data.total
            },
            //监听pagesize改变的事件
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            //监听pagenum的改变
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            //展示添加分类对话框
            showAddCateDialog(){
                this.getParentCateList()
                this.addCateDialogVisible = true

            },
            //获取父级分类节点
            async getParentCateList(){
                const {data:res} = await this.$http.get('categories',{
                    params:{
                        type:2,
                    }
                })

                if(res.meta.status!==200){
                    return this.$message.error('获取父级分类失败')
                }

                // console.log(res.data)
                this.parentCateList = res.data
            },
            //选择项发生变化触发这个函数
            parentCateChange() {
                // console.log(this.selectedKeys)
                //如果selectedKeys数组大于0则证明选中了父级分类
                if (this.selectedKeys.length > 0) {
                    //父级分类的id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    this.addCateForm.cat_level = this.selectedKeys.length
                    return
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
            },
            //点击按钮添加新的分类
            addCate(){
                // console.log(this.addCateForm)
                this.$refs.addCateFormForm.validate(async valid=>{
                    if(!valid ) return
                    const {data:res} = await this.$http.post('categories',this.addCateForm)
                    if(res.meta.status!==201){
                        return this.$message.error('添加分类失败')
                    }
                    this.$message.success('添加分类成功')
                    await this.getCateList()
                    this.addCateDialogVisible = false
                })
            },
            addCateDialogClose(){
                this.$refs.addCateFormForm.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            },
            //删除分类
            async deleteCate(result){
                // console.log(res.cat_id)
                //弹框询问是否删除
                const  res = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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

                const {data:res1} = await this.$http.delete('categories/'+result.cat_id)

                if(res1.meta.status!==200){
                    return this.$message.error('删除分类失败')
                }
                this.$message.success('删除分类成功')
                await this.getCateList()
            },
            editCate(result){
                // console.log(result)
                this.editCateForm.cat_name = result.cat_name
                this.editCateForm.cat_id = result.cat_id
                this.EditCateDialogVisible= true
            },
            putEditCateName(){
                // console.log(this.editCateForm.cat_name)
                // console.log(this.editCateForm.cat_id)
                this.$refs.editCateFormRef.validate(async valid=>{
                    if(!valid) return
                    const {data:res} = await this.$http.put('categories/'+this.editCateForm.cat_id,{
                        cat_name:this.editCateForm.cat_name
                    })
                    // console.log(res)
                    if(res.meta.status !== 200){
                        return this.$message.error('编辑分类信息失败')
                    }
                    this.EditCateDialogVisible = false
                    await this.getCateList()
                    this.$message.success('编辑分类信息成功')
                })
            }

        },
        created() {
            this.getCateList()
        }
    }
</script>

<style scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascade{
    width: 100%;
}
</style>
