<template>
  <div id="app">
    <span>
      <slot>课程管理</slot>
    </span>

    <p>{{ user.name }}</p>
    <p>{{ user.phone }}/{{ user.id }}</p>

    <!-- <template v-for="(c, index) of teachers" :key="index">
      <p>{{ c.phone }}/{{ c.id }}/{{ c.name }}</p>
    </template>  -->

    <p><button type="button" @click="findAll()">获取指定教师 的课程</button></p>
    <el-button @click="add()" type="primary" size="mini" style="margin: 10px 0">
      新增
    </el-button>
    <el-table :data="courses" style="width: 100%">
      <el-table-column label="课程名" width="150">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top">
            <!-- <template #default>
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
            </template> -->
            <template #reference>
              <div class="name-wrapper">
                <el-tag size="medium">{{ scope.row.cname }}</el-tag>
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="学时" width="100">
        <template #default="scope">
          <i class="name-wrapper"></i>
          <span style="margin-left: 10px">{{ scope.row.ctime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="选课学生数" width="120">
        <template #default="scope">
          <i class="name-wrapper"></i>
          <span style="margin-left: 10px">{{ scope.row.cnum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="课程id" width="200">
        <template #default="scope">
          <i class="name-wrapper"></i>
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button> -->
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
        <el-form-item label="课程名" label-width="100px">
          <el-input v-model="entity.cname" />
        </el-form-item>
        <el-form-item label="学时" label-width="100px">
          <el-input v-model="entity.ctime" />
        </el-form-item>
        <el-form-item label="选课学生人数" label-width="100px">
          <el-input v-model="entity.cnum" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
          <!-- <el-button type="primary" @click="update()">更新</el-button> -->
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
import { UPDATE_USER , LIST_COURSE , DEL_COURSEID, SAVE_COURSE ,UPDATE_COURSE } from "@/store/VuexTypes";

  import { ElMessageBox } from 'element-plus';

export default defineComponent({
   setup(){
   const store=useStore();
    const user = computed(() => store.state.user);
    const courses=computed(()=>(store.state.courses));

    const dialogVisible=ref(false);
    const findAll=()=>{
      store.dispatch(LIST_COURSE,user.value.id);
    };
    const state1 = reactive({
        entity:{
           id: '',
           cname: '',
           ctime: '',
           cnum: '',  //课程学生人数
           userid : computed(()=>(store.state.user.value.id)),
        }
     });
  // this.entity.userid=computed(()=>(store.state.user.value.id));
    /* watch(teachers,(newvlaue,oldvalue)=>{
        // findAll();   //为什么会一直请求
     });*/
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
     return{
       handleClose,
       store,
       user,
      courses,
      findAll,
      dialogVisible,
       ...toRefs(state1),
     };
   },

  methods: {

    handleEdit(index, row) {
     // console.log(index, row);
        this.entity={
          id: row.id,
           cname: row.cname,
           ctime: row.ctime,
           cnum: row.cnum,  //课程学生人数
           userid : row.userid
        };
       this.dialogVisible=true;

    },
    handleDelete(index, row) {
      // 基于id的删除(有精度问题)，基于phone
     // console.log(index, row);
    // console.log(row.phone);
      this.store.dispatch(DEL_COURSEID,row.id);

    },
    save(){
      //this.entity.userid=this.user.value.id;
     // console.log(this.entity);

      this.store.dispatch(SAVE_COURSE,this.entity);

      this.dialogVisible=false;
      this.entity={
          id: '',
           cname: '',
           ctime: '',
           cnum: '',  //课程学生人数
          // userid : this.user.value.id
        };
        // this.store.dispatch(LIST_COURSE);
        // window.reload();
        //  this.findAll();
    },
    add(){
        this.dialogVisible=true;
       // this.findAll();
        this.entity={
          id: '',
           cname: '',
           ctime: '',
           cnum: '',  //课程学生人数
          // userid : this.user.value.id
        }
    },


  },
});
</script>
