<template>
  <div class="message">
    <!-- 查找部分 开始 -->
      <div class="select-container">
          <div>
            规格/型号：
            <el-input
              placeholder="请输入规格/型号"
              v-model="standard"
              clearable>
            </el-input>
          </div>
          <div class="right">
            <div>
              是否有效：
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="button-container">
              <el-button type="primary">查询</el-button>
              <el-button>重置</el-button>
            </div>
          </div>
      </div>
    <!-- 查找部分 完 -->

    <!-- 信息展示 开始-->
    <div class="container">
      <div class="operation-container">
        <el-button type="primary" @click="addMaterial">新增</el-button>
        <el-button type="danger">删除</el-button>
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
        // 规格/型号
        standard: '',
        // select选择器可选值
        options: [{
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }],
        // select选择器最终值
        value: '',
        // 显示的数据
        tableData: [],
        multipleSelection: [],
        currentPage: 1,
        size: 4,
        count: 0
      }
    },
    methods: {
      // 清空所选选项
      toggleSelection() {
        this.$refs.multipleTable.clearSelection();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.size = val;
      },
      async handleCurrentChange(val) {
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
        }
      },
      addMaterial () {
        this.$router.push(`/addMaterial/${this.type}`)
      },
      modifyRow(index, rows) {
        this.$router.push(`/modifyMaterial/${this.type}/${rows[index]._id}`)
      }
    },
    watch: {
      '$route' (to, from) {
        if(from.path.indexOf('/modifyMaterial') !== -1) {
          this.handleCurrentChange(this.currentPage);
        } else {
          this.handleCurrentChange(1);
        }
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
    min-width: 800px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    height: calc(100%);

    .select-container {
      display: flex;
      justify-content: space-between;
      margin: 15px 15px;

      .el-input {
        width: 280px;
      }
      
      .right {
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 100px;
      }
    }

    .container {
      display: flex;
      flex-direction: column;

      .block {
        align-self: flex-end;
        margin-right: 30px;
        margin-top: 20px;
      }
    }
}
</style>