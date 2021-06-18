<template>
  <div id="app">
    <span>
      <slot>教师管理</slot>
    </span>

    <p>{{ user.name }}</p>
    <p>{{ user.phone }}</p>

    <!-- <template v-for="(c, index) of teachers" :key="index">
      <p>{{ c.phone }}/{{ c.id }}/{{ c.name }}</p>
    </template>  -->

    <p><button type="button" @click="findAll()">获取所有教师</button></p>
    <el-button @click="add" type="primary" size="mini" style="margin: 10px 0">
      新增
    </el-button>
    <el-table :data="teachers" style="width: 100%">
      <el-table-column label="姓名" width="150">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top">
            <!-- <template #default>
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
            </template> -->
            <template #reference>
              <div class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="180">
        <template #default="scope">
          <i class="name-wrapper"></i>
          <span style="margin-left: 10px">{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="id" width="220">
        <template #default="scope">
          <i class="name-wrapper"></i>
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 更改信息的模态框 -->

    <!-- <el-button type="text" @click="dialogVisible = true">
      点击打开 Dialog
    </el-button> -->

    <el-dialog
      title="用户信息"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>

      <el-form :model="entity">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="entity.name" />
        </el-form-item>
        <el-form-item label="手机号" label-width="100px">
          <el-input v-model="entity.phone" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
          <el-button type="primary" @click="update()">更新</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="tsx ">


import { User } from "@/datasource/Types";
import { State } from "@/store";
import { computed, defineComponent, ref ,toRefs,reactive,watch} from "vue";
import { Store, useStore } from "vuex";
import { UPDATE_USER ,LIST_TEACHERS,DEL_USERID,SAVE_USER,UPDATE} from "@/store/VuexTypes";


export default defineComponent({
   setup(){
   const store=useStore();
    const user = computed(() => store.state.user);
    const teachers=computed(()=>(store.state.teachers));

    const dialogVisible=ref(false);
    const findAll=()=>{
      store.dispatch(LIST_TEACHERS);
    };
    const state1 = reactive({
        entity:{
          name:'',
          phone:'',
          id:'',
          role:'1'
        }
     });
     watch(teachers,(newvlaue,oldvalue)=>{
         //findAll();   //为什么会一直请求
     });
     return{
       store,
       user,
      teachers,
      findAll,
      dialogVisible,
       ...toRefs(state1),
     };
   },

  methods: {
    handleEdit(index, row) {
     // console.log(index, row);
       this.entity=row;
       this.dialogVisible=true;

    },
    handleDelete(index, row) {
      // 基于id的删除(有精度问题)，基于phone
     // console.log(index, row);
      this.store.dispatch(DEL_USERID,row.phone);
    // window.reload()
      //this.findAll();

    },
    save(){
      if(this.entity.phone!="")
      this.store.dispatch(SAVE_USER,this.entity);
      this.dialogVisible=false;
      this.entity={
          name:'',
          phone:'',
          id:'',
          role:'1'
        };
        // this.store.dispatch(LIST_TEACHERS);
        // window.reload();
        //  this.findAll();
    },
    add(){
        this.dialogVisible=true;
       // this.findAll();
        this.entity={
          name:'',
          phone:'',
          id:'',
          role:'1'
        }
    },
    update(){
       if(this.entity.phone!="")
       this.store.dispatch(UPDATE,this.entity);
        this.dialogVisible=false;
      this.entity={
          name:'',
          phone:'',
          id:'',
          role:'1'
        };
    }

  },
});
</script>
