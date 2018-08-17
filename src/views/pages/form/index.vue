<template>
  <div>
    <jw-form v-bind="form"></jw-form>
  </div>
</template>
<script>
export default {
  data () {
    let that = this
    return {
      form: {
        read: false,
        bind: {
          props: {
            labelWidth: '150px',
            rules: {
              auto: true,
              pinput: {
                max: 50,
                required: true,
                message: '最多50个字'
              },
              pselect: {
                required: true,
                validator: function (rule, value, callback) {
                  if (value === 'shanghai') {
                    callback()
                  } else {
                    callback(new Error('只能选择上海'))
                  }
                }
              },
              ptextarea: {
                message: '不能超过100个字',
                max: 100
              }
            }
          }
        },
        data: [
          {
            tag: 'title',
            label: '标题',
            fuc (h) {
              return h('span', {style: 'margin-left:10px;'}, '自定义内容区域')
            }
          },
          {
            tag: 'text',
            label: '姓名',
            prop: 'ptext'
          },
          {
            tag: 'el-rate',
            label: '等级(详情可编辑)',
            itemBind: {
              class: 'write'
            },
            prop: 'prate'
          },
          {
            tag: 'el-input',
            label: '输入框',
            prop: 'pinput',
            bind: {
              props: {
                placeholder: '请输入注释'
              }
            },
            render (h) {
              return [h('span', 'tag标签后面接着渲染')]
            },
            read (h, value) {
              return '详情转态时用来render自定义显示'
            }
          },
          {
            tag: 'el-input',
            bind: {
              props: {
                type: 'textarea'
              }
            },
            label: '多行框',
            question: '这是什么?',
            prop: 'ptextarea',
            max: true
          },
          {
            tag: 'el-select',
            label: '下拉框',
            prop: 'pselect',
            options: [
              {
                value: 'shanghai',
                label: '上海'
              },
              {
                value: 'beijing',
                label: '北京'
              }
            ]
          },
          {
            tag: 'el-checkbox-group',
            label: '多选框组',
            prop: 'pcheckboxGroup',
            options: [
              {
                value: 'shanghai',
                label: '上海',
                bind: {
                  props: {
                    disabled: true
                  }
                }
              },
              {
                value: 'beijing',
                label: '北京'
              }
            ]
          },
          {
            tag: 'el-radio-group',
            label: '单选框组',
            write: true,
            prop: 'pradioGroup',
            options: [
              {
                value: 'shanghai',
                label: '上海'
              },
              {
                value: 'beijing',
                label: '北京'
              }
            ]
          },
          {
            label: '自定义',
            prop: 'puser',
            render (h, store, value) {
              // this 指向组件内部
              // 推荐使用watch或者计算属性控制
              return ['render函数']
            }
          },
          {
            tag: 'agree',
            prop: 'pagree',
            label: '连续添加'
          },
          {
            tag: 'btns',
            label: '自动提交', // 不传默认提交
            fuc (value) {
            },
            // bind: {}, // 写的话，自由定义
            btns: [
              {
                bind: {
                  on: {
                    click () {
                    }
                  }
                },
                name: '按钮一'
              }
            ]
          }
        ],
        hide: {
          ptext: true
        },
        value: {
          ptext: '张三',
          prate: 1,
          pinput: '输入框',
          ptextarea: '',
          pselect: 'shanghai',
          pcheckboxGroup: ['shanghai'],
          pradioGroup: 'shanghai',
          puser: '自定义的值',
          pagree: true
        }

      }
    }
  },
  created () {},
  methods: {}
}
</script>
<style lang="less">
</style>
