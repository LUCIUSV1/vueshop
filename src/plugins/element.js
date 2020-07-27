import Vue from 'vue'
import { Button } from 'element-ui'
import { Form}from 'element-ui'
import { FormItem}from 'element-ui'
import { Input}from 'element-ui'
import {Message,Container,Header,Aside,Main
        ,Menu,Submenu,MenuItemGroup,MenuItem,Breadcrumb,BreadcrumbItem
        ,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog
        ,MessageBox,Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,
        Steps,Step,Checkbox,CheckboxGroup,Upload,Timeline,TimelineItem} from "element-ui";


Vue.use(Button)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

