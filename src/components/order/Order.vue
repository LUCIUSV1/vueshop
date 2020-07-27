<template>
    <div>
        <!--        面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
<!--            订单列表-->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag  v-if="scope.row.pay_status==='1'">已付款</el-tag>
                        <el-tag v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"> </el-button>
                        <el-button type="danger" icon="el-icon-location" size="mini" @click="showProgress"> </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1,2,5,10]"
                    :page-size="this.queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

            <el-dialog
                    title="修改地址"
                    :visible.sync="dialogVisible"
                    width="30%"
                    @close="handleClose">
                <el-form :model="address"
                         :rules="addrules"
                         ref="ruleForm"
                         label-width="100px">
                    <el-form-item label="省市区/县" prop="address1">
                        <el-cascader :options="cityData" v-model="address.address1"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="address.address2"></el-input>
                </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                  </span>
            </el-dialog>

            <el-dialog
                    title="物流进度"
                    :visible.sync="progreDialogVisible"
                    width="30%"
                   >
                <el-timeline>
                    <el-timeline-item
                            v-for="(activity, index) in progresList"
                            :key="index"
                            :timestamp="activity.time">
                        {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import citydata from "./citydata.js";
    export default {
        name: "Order",
        data(){
            return{
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10
                }
                ,total:0,
                orderList:[],
                dialogVisible:false,
                address:{
                    address1:[],
                    address2:''
                },
                addrules:{
                    address1:[
                        {required:true,message:'请选择省市区县',trigger:'blur'}
                    ], address2:[
                        {required:true,message:'请填写详细地址',trigger:'blur'}
                    ]

                },
                cityData:citydata,
                progreDialogVisible:false,
                progresList:[]
            }
        }
        ,methods:{
            async getOrderList(){
                const {data:res} = await this.$http.get('orders',{
                    params:this.queryInfo
                })
                if(res.meta.status!==200){
                    return this.$message.error('获取订单列表失败')
                }
                // console.log(res)
                this.total = res.data.total
                this.orderList = res.data.goods
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize= newSize
                this.getOrderList()
            },
            handleCurrentChange(pagenum){
                this.queryInfo.pagenum = pagenum
                this.getOrderList()
            },
            showBox(){
                this.dialogVisible = true
            },
            handleClose(){
                this.$refs.ruleForm.resetFields()
            },
            async showProgress() {

                const {data: res} = await this.$http.get('/kuaidi/804909574412544580')
                if(res.meta.status!==200){
                    return this.$message.error('获取物流进度失败')
                }
                this.progresList = res.data

                this.progreDialogVisible = true
                console.log(this.progresList)
            }

        },
        created() {
            this.getOrderList()
        }
    }
</script>

<style scoped>

</style>
