<template>
  <el-container>
    <el-aside width="350px">
        <div class="demo-input-suffix">
            <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="input">
            </el-input>
        </div>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>

    <router-view name='add'>
      新增物资
    </router-view>

    <router-view name='modify'>
      修改物资
      <div class="row-container" slot="time" slot-scope="slot">
        <el-form-item label="创建时间 :">
            <el-input v-model="slot.data"  :disabled="slot.data"></el-input>
        </el-form-item>
      </div>
    </router-view>
  </el-container>
</template>

<script>
export default {
    name: 'Main',
    data() {
      return {
        // 搜索框输入
        input: '',
        data: [{
          label: '救灾物资',
          children: [{
              label: '居住类'
            },{
              label: '床上用品类'
            },{
              label: '衣着类'
            },{
              label: '救灾设备类'
            },{
              label: '基本生活类'
          }]
        },{
          label: '森林防火设备',
          children: [{
              label: '居住类'
            },{
              label: '床上用品类'
            },{
              label: '衣着类'
            },{
              label: '救灾设备类'
            },{
              label: '基本生活类'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      handleNodeClick(data) {
        if(data.children === undefined) {
          this.$router.push(`/message/${data.label}`)
        }
      }
    }
}
</script>

<style lang='less' scoped>
.el-container {
    height: 100%;

    .el-aside {
      padding-top: 20px;
      padding-left: 20px;
      box-sizing: border-box;

      .el-tree {
        margin-top: 30px;
      }
    }

    .el-main {
      box-sizing: border-box;
      min-width: 1100px;
    }

    .row-container {
      .el-input {
        width: 280px;
      }
    }
}
</style>