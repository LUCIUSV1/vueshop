<template>
    <div>
        <!--        面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图区域-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="queryGoods"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" width="100px" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" width="70px" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" width="140px" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button @click="removeById(scope.row.goods_id)" type="danger" icon="el-icon-edit" size="mini"></el-button>
                    </template>
                 </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="SizeChange"
                    @current-change="CurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1,5,10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "List",
        data(){
            return {
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10
                }
                ,goodsList:[],
                total:0
            }
        }
        ,created() {
            this.getGoodsList()
        },
        methods:{
           async getGoodsList(){
               const{data:res} =await this.$http.get('goods',{
                    params:this.queryInfo
                })
               if(res.meta.status!==200){
                   return this.$message.error(
                       '获取商品列表失败'
                   )
               }
               // this.$message.success('获取商品列表成功')
               // console.log(res.data)
               this.goodsList =res.data.goods
               this.total = res.data.total
            },
            SizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            CurrentChange(pagenum){
                this.queryInfo.pagenum = pagenum
                this.getGoodsList()
            },queryGoods(){
               this.getGoodsList()
            },
            async removeById(id) {
                //弹框询问是否删除
                const res = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                //如果用户确认删除 则返回字符串confirm
                //如果用户取消删除，则返回字符串cancel
                // console.log(res)
                if (res !== 'confirm') {
                    return this.$message.info('取消删除')
                }

                const{data:res1} = await this.$http.delete(`goods/${id}`)
                if(res1.meta.status!==200){
                    return  this.$message.error('删除失败')
                }
                this.$message.success('删除成功')
                await this.getGoodsList()
           },
            goAddpage(){
               this.$router.push('goods/add')
            }

        },


    }
</script>

<style lang="less" scoped>

</style>