<template>
  <div class="message">
    <!-- 查找部分 开始 -->
    <el-form :model="select" ref="ruleForm" label-width="100px" class="demo-ruleForm select-container">
      <el-form-item label="规格/型号 :">
          <el-input v-model="select.model" placeholder="请输入规格/型号"></el-input>
      </el-form-item>
      <div class="right">
        <el-form-item label="是否有效 :">
          <el-select v-model="select.isEffective" placeholder="请选择是否有效">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <div class="button-container">
          <el-button type="primary" @click="selectMatrials">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
    </el-form>
    <!-- 查找部分 完 -->

    <!-- 信息展示 开始-->
    <div class="container">
      <div class="operation-container">
        <el-button type="primary" @click="addMaterial">新增</el-button>
        <el-button type="danger" @click="toDelete">删除</el-button>
        <!-- <el-button type="danger" @click="deleteMaterial">删除</el-button> -->
      </div>

      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <span>确定删除</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteMaterial">确 定</el-button>
        </span>
      </el-dialog>

      <div class="now-select" v-show="isShow">
        <div>已选择<span> {{selectedNum}} </span>项</div>
        <div class="clear" @click="toggleSelection">清空</div>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          type="index"
          :index="num"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="物资品名"
          width="180">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          prop="model"
          label="规格/型号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="reserve_type"
          label="储备类别"
          width="180">
        </el-table-column>
        <el-table-column
          prop="is_effective"
          label="是否有效"
          width="180">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="modifyRow(scope.$index, tableData)"
              type="text"
              size="small">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[4, 8, 10]"
          :page-size="4"
          layout="sizes, prev, pager, next, jumper"
          :total="count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { materialApi } from '@/api'
export default {
    name: 'Message',
    props: ['type'],
    created () {
      this.handleCurrentChange(1);
    },
    data () {
      return {
        // 删除的对话框是否显示
        dialogVisible: false,
        select: {
          // 规格/型号
          model: '',
            // 选择器最终值
          isEffective: '',
        },

        // 显示的数据
        tableData: [],
        // 已选的数据
        multipleSelection: [],
        // 当前页数
        currentPage: 1,
        // 每页大小
        size: 4,
        // 总共多少个
        count: 0,
        // 被选个数
        selectedNum: 0,
        // 顺序
        num: 1,
        // 是否显示被选个数信息
        isShow: false,
        // 是否是上面的条件查询
        conditionSelect: false
      }
    },
    methods: {
      // 查询
      async selectMatrials () {
        this.conditionSelect = true;
        this.handleCurrentChange(1);
      },
      // 重置
      reset () {
        this.select.model = '';
        this.select.isEffective = '';
        this.conditionSelect = false;
        this.handleCurrentChange(1);
      },
      toDelete () {
        if(this.multipleSelection.length > 0) {
          this.dialogVisible = true;
        }
      },
      // 删除的对话框：关闭
      handleClose() {
        this.dialogVisible = false;
      },
      // 清空所选选项
      toggleSelection() {
        this.$refs.multipleTable.clearSelection();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.selectedNum = this.multipleSelection.length;
        if(this.selectedNum > 0) {
          this.isShow = true;
        } else {
          this.isShow = false;
        }
      },
      // 每页大小变化时
      handleSizeChange(val) {
        this.size = val;
        this.handleCurrentChange(this.currentPage);
      },
      // 显示当前页
      async handleCurrentChange(val) {
        this.currentPage = val;
        this.num = (this.currentPage-1)*this.size+1;
        if(this.conditionSelect) {
          let res = await this.$axios.get('/materialApi'+ materialApi.selectMatrials, {
            params: {
              itemType: this.type,
              model: this.select.model,
              isEffective: this.select.isEffective,
              size: this.size,
              page: this.currentPage
            }
          });
          let { code, msg, data } = res.data;
          if(code === '0000') {
            this.count = data.count;
            this.tableData = data.data;
            // 当前页减1
            if(data.reduce) {
              this.currentPage--;
            }
          }
          return;
        }
        let res = await this.$axios.get('/materialApi'+ materialApi.getMaterialsMessage, {
          params: {
            size: this.size,
            page: val,
            itemType: this.type
          }
        });
        let { code, msg, data } = res.data;
        if(code === '0000') {
          this.count = data.count;
          this.tableData = data.data;
          // 当前页减1
          if(data.reduce) {
            this.currentPage--;
          }
        }
      },
      addMaterial () {
        this.$router.push(`/addMaterial/${this.type}`)
      },
      modifyRow(index, rows) {
        this.$router.push(`/modifyMaterial/${this.type}/${rows[index]._id}`)
      },
      // 删除物资
      async deleteMaterial () {
        this.dialogVisible = false;
        let res = await this.$axios.post('/materialApi'+ materialApi.deleteMaterial, {
          messageList: this.multipleSelection
        });
        let { code, msg } = res.data;
        if(code=== '0000') {
          this.$message({type: 'success', message: msg});
          this.handleCurrentChange(this.currentPage);
        }
      }
    },
    watch: {
      '$route' (to, from) {
        if(from.path.indexOf('/modifyMaterial') !== -1) {
          // 当修改完成后，需要显示更新后的数据
          this.handleCurrentChange(this.currentPage);
        } 
        if(from.path.indexOf('/addMaterial') !== -1) {
          // 当修改完成后，需要显示更新后的数据
          this.handleCurrentChange(this.currentPage);
        } 
      },
      type () {
        this.handleCurrentChange(1);
      }
    }
}
</script>

<style lang='less' scoped>
.message {
    border: 1px solid #e7e9ee;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    height: calc(100%);

    .select-container {
      display: flex;
      justify-content: space-between;
      margin: 15px 15px;

      .el-input, .el-select {
        width: 280px;
      }
      
      .right {
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 100px;

        .button-container {
          margin-left: 24px;
        }
      }
    }

    .container {
      display: flex;
      flex-direction: column;

      .now-select {
        height: 40px;
        background: rgb(28, 173, 218);
        margin-top: 10px;
        border-radius: 7px;
        display: flex;
        align-items: center;

        div {
          margin: 0 20px;
          font-size: 14px;

          span {
            color: rgb(26, 91, 212);
          }
        }

        .clear {
          color: rgb(26, 91, 212);

          &:hover {
            color: white;
          }
        }
      }

      .block {
        align-self: flex-end;
        margin-right: 30px;
        margin-top: 20px;
      }
    }
}
</style>