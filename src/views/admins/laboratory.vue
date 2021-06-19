<template>
  <div>
    <span>
      <slot>实验室管理</slot>
    </span>

    <p>{{ user.name }}</p>
    <p>{{ user.phone }}/{{ user.id }}</p>

    <!-- <template v-for="(c, index) of teachers" :key="index">
      <p>{{ c.phone }}/{{ c.id }}/{{ c.name }}</p>
    </template>  -->

    <p><button type="button" @click="findAll()">获取所有实验室</button></p>
    <el-button
      @click="add1()"
      type="primary"
      size="mini"
      style="margin: 10px 0"
    >
      新增
    </el-button>
    <el-table :data="laboratorys" style="width: 100%">
      <el-table-column label="实验室名" width="120">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top">
            <!-- <template #default>
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
            </template> -->
            <template #reference>
              <div class="name-wrapper">
                <el-tag size="medium">{{ scope.row.classnum }}</el-tag>
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="机器数量" width="120">
        <template #default="scope">
          <i class="name-wrapper"></i>
          <span style="margin-left: 10px">{{ scope.row.mnum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实验室简介" width="300">
        <template #default="scope">
          <i class="name-wrapper"></i>
          <span style="margin-left: 10px">{{ scope.row.message }}</span>
        </template>
      </el-table-column>

      <el-table-column label="id" width="150">
        <template #default="scope">
          <i class="name-wrapper"></i>
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit1(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete1(scope.$index, scope.row)"
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

      <el-form :model="entity1">
        <el-form-item label="实验室名" label-width="100px">
          <el-input v-model="entity1.classnum" />
        </el-form-item>
        <el-form-item label="机器数量" label-width="100px">
          <el-input v-model="entity1.mnum" />
        </el-form-item>
        <el-form-item label="实验室简介" label-width="100px">
          <el-input v-model="entity1.message" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <!-- <el-button>right</el-button> -->
          <el-button type="primary" @click="save()">确认</el-button>
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
import { UPDATE_USER ,LIST_LABORATORY ,DEL_LABORATORYID ,SAVE_LABORATORY,UPDATE_LABORATORY} from "@/store/VuexTypes";
  import { ElMessageBox } from 'element-plus';

export default defineComponent({
   setup(){
   const store=useStore();
    const user = computed(() => store.state.user);
    const laboratorys=computed(()=>(store.state.laboratorys));

    const dialogVisible=ref(false);
    const findAll=()=>{
      store.dispatch(LIST_LABORATORY);
    };
    const state1 = reactive({
        entity1:{
           id: '',
           classnum: '',
           mnum: '',
           message: '',
           laborcheck:''
        }
     });
     const handleClose = (done) => {
        ElMessageBox
          .confirm('确认关闭？')
          .then((_) => {
            done();
          })
          .catch((_) => {
            // catch
          });
      };
    /* watch(teachers,(newvlaue,oldvalue)=>{
        // findAll();   //为什么会一直请求
     });*/
     return{
       handleClose ,
       store,
       user,
      laboratorys,
      findAll,
      dialogVisible,
       ...toRefs(state1),
     };
   },

  methods: {
    handleEdit1(index, row) {
     // console.log(index, row);
       this.entity1=row;
       this.dialogVisible=true;

    },
    handleDelete1(index, row) {
      // 基于id的删除(有精度问题)，基于phone
     // console.log(index, row);
    // console.log(row.phone);
      this.store.dispatch(DEL_LABORATORYID,row.id);

    },
    save(){
      // if(this.entity.id==""){
      // this.store.dispatch(SAVE_LABORATORY,this.entity1);
      // }
      // else {

      // }
      this.store.dispatch(UPDATE_LABORATORY,this.entity1);
      this.dialogVisible=false;
      this.entity={
          name:'',
          phone:'',
          id:'',
          role:'1'
        };
         this.store.dispatch(LIST_LABORATORY);
        // window.reload();
        //  this.findAll();
    },
    add1(){
        this.dialogVisible=true;

        this.entity1={
         entity1:{
           id: '',
           classnum: '',
           mnum: '',
           message: '',
           laborcheck:''
        }
        }
    }
    /*update(){
       if(this.entity.phone!="")
       this.store.dispatch(UPDATE,this.entity);
        this.dialogVisible=false;
      this.entity={
          name:'',
          phone:'',
          id:'',
          role:'1'
        };
    }*/

  },
});
</script>
