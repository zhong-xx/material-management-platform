<template>
  <div class="operation-message-wrap">
      <div class="operation-message">
          <div class="top">
              <div class="operation"><slot></slot></div>
              <div class="close" @click="close">X</div>
          </div>

          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <div class="row-container">
                  <el-form-item label="物资品名 :" prop='name'>
                      <el-input v-model="ruleForm.name" :disabled="forbid" placeholder="请输入物资品名"></el-input>
                  </el-form-item>
                  <el-form-item label="物资类别 :">
                      <el-select v-model="ruleForm.itemType" placeholder="请选择物资类别" :disabled="forbid">
                        <el-option label="居住类" value="居住类"></el-option>
                        <el-option label="床上用品类" value="床上用品类"></el-option>
                        <el-option label="衣着类" value="衣着类"></el-option>
                        <el-option label="救灾设备类" value="救灾设备类"></el-option>
                        <el-option label="基本生活类" value="基本生活类"></el-option>
                      </el-select>
                  </el-form-item>
              </div>
              <div class="row-container">
                  <el-form-item label="计量单位 :">
                      <el-input v-model="ruleForm.unit"  :disabled="forbid" placeholder="请输入计量单位"></el-input>
                  </el-form-item>
                  <el-form-item label="规格/型号 :" prop='model'>
                      <el-input v-model="ruleForm.model" placeholder="请输入规格/型号"></el-input>
                  </el-form-item>
              </div>
              <div class="row-container">
                  <el-form-item label="是否有效 :" prop='isEffective'>
                      <el-radio-group v-model="ruleForm.isEffective">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="储备类型 :" prop='reserveType'>
                      <el-select v-model="ruleForm.reserveType" placeholder="请选择储存类型">
                        <el-option label="自储存" value="自储存"></el-option>
                        <el-option label="自储存" value="自储存"></el-option>
                      </el-select>
                  </el-form-item>
              </div>
              <div class="row-container">
                  <el-form-item label="排序 :" prop='sort'>
                      <el-input v-model="ruleForm.sort" placeholder="请输入排序"></el-input>
                  </el-form-item>
                  <el-form-item label="重量 :">
                      <el-input v-model="ruleForm.weight" placeholder="请输入重量"></el-input>
                  </el-form-item>
              </div>
              <div class="row-container">
                  <el-form-item label="体积 :">
                      <el-input v-model="ruleForm.volume" placeholder="请输入体积"></el-input>
                  </el-form-item>
              </div>
              <div>
                  <el-form-item label="物资用途 :">
                      <el-input type="textarea" v-model="ruleForm.purpose" placeholder="请输入物资用途"></el-input>
                  </el-form-item>
              </div>
              <slot name='time' :data="ruleForm.time"></slot>
              <div class="row-container">
                  <div></div>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                    <el-button @click="close">关闭</el-button>
                  </el-form-item>
              </div>
          </el-form>
      </div>
  </div>
</template>

<script>
import { materialApi } from '@/api'
export default {
    name: 'OperationMessage',
    props: ['type', 'id'],
    created () {
        if(this.$route.path.indexOf('/addMaterial') !== -1) {
            this.ruleForm.itemType = this.type;
        }
        if(this.$route.path.indexOf('/modifyMaterial') !== -1) {
            this.getMaterialMessage();
            this.forbid = true;
        }
    },
    data () {
        return {
            forbid: false,
            ruleForm: {
                // 物资品名
                name: '',
                // 物资类别
                itemType: '',
                // 计量单位
                unit:'',
                // 规格/型号
                model:'',
                // 是否有效
                isEffective: '',
                // 储备类别
                reserveType: '',
                // 排序
                sort: '',
                // 重量
                weight: '',
                // 体积
                volume: '',
                // 物资用途
                purpose: '',
                // 时间
                time: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入物资品名', trigger: 'blur' }
                ],
                model: [
                    { required: true, message: '请输入规格/型号', trigger: 'blur' }
                ],
                isEffective: [
                    { required: true, message: '请选择是否有效', trigger: 'blur' }
                ],
                reserveType: [
                    { required: true, message: '请选择储备类别', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    if(this.$route.path.indexOf('/modifyMaterial') !== -1) {
                        let res = await this.$axios.post('/materialApi'+ materialApi.updateMaterialMessage, {
                            id: this.id,
                            name: this.ruleForm.name.trim(),
                            itemType: this.ruleForm.itemType.trim(),
                            unit: this.ruleForm.unit.trim(),
                            model: this.ruleForm.model.trim(),
                            isEffective: this.ruleForm.isEffective.trim(),
                            reserveType: this.ruleForm.reserveType.trim(),
                            sort: parseInt(this.ruleForm.sort),
                            weight: parseInt(this.ruleForm.weight),
                            volume: parseInt(this.ruleForm.volume),
                            purpose: this.ruleForm.purpose.trim(),
                            time: this.ruleForm.time.trim()
                        })
                        let {code, msg} = res.data;
                        if(code === '0000') {
                            this.$message({type: 'success', message: msg})
                            this.$router.back();
                        }
                        return;
                    }
                    let res = await this.$axios.post('/materialApi'+ materialApi.addMaterial, {
                        name: this.ruleForm.name.trim(),
                        itemType: this.ruleForm.itemType.trim(),
                        unit: this.ruleForm.unit.trim(),
                        model: this.ruleForm.model.trim(),
                        isEffective: this.ruleForm.isEffective.trim(),
                        reserveType: this.ruleForm.reserveType.trim(),
                        sort: parseInt(this.ruleForm.sort.trim()),
                        weight: parseInt(this.ruleForm.weight.trim()),
                        volume: parseInt(this.ruleForm.volume.trim()),
                        purpose: this.ruleForm.purpose.trim()
                    });
                    let {code, msg} = res.data;
                    if(code === '0000') {
                        this.$message({type: 'success', message: msg})
                        this.$router.back();
                    }
                } else {
                    return false;
                }
            });
        },
        close () {
            this.$router.back();
        },
        async getMaterialMessage () {
            let res = await this.$axios.get('/materialApi'+ materialApi.getMaterialMessage, {
                params: {
                    id: this.id
                }
            });
            let { code, msg, data } = res.data;
            if( code === '0000') {
                this.ruleForm.name = data.name;
                this.ruleForm.itemType = data.item_type;
                this.ruleForm.unit = data.unit;
                this.ruleForm.model = data.model;
                this.ruleForm.isEffective = data.is_effective;
                this.ruleForm.reserveType = data.reserve_type;
                this.ruleForm.sort = data.sort;
                this.ruleForm.weight = data.weight;
                this.ruleForm.volume = data.volume;
                this.ruleForm.purpose = data.purpose;
                this.ruleForm.time = data.time;
            }
        }
    }
}
</script>

<style lang='less' scoped>
.operation-message-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .operation-message {
        width: 840px;
        border: 1px solid gray;
        border-radius: 5px;
        background: white;

        .top {
            height: 50px;
            margin: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .operation {
                font-weight: bold;
            }

            .close {
                color: gray;
                cursor: pointer;

                &:hover {
                    color: rgb(54, 54, 231);
                }
            }
        }

        .el-form {
            padding: 15px 30px;
            border-top: 2px solid gray;

            .row-container {
                display: flex;
                justify-content: space-between;

                .el-input,.el-select {
                    width: 280px;
                }
            }
        }
    }
}
</style>