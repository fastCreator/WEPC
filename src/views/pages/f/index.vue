<template>
  <div>
    <jw-table
      v-bind="table"
      @search="search"
      ref="table"
    ></jw-table>
    <jw-dialog-form
      v-bind="form"
      :visible.sync="form.visible"
      ref="form"
    ></jw-dialog-form>
  </div>
</template>
<script>
export default {
  data () {
    let that = this
    return {
      table: {
        data: [],
        autoHeight: 260,
        filters: [
          {
            type: 'text',
            prop: '',
            title: '计划名称',
            value: '',
            bind: {
              attrs: {
                placeholder: '请输入计划名称'
              }
            }
          }
        ],
        page: {},
        btns: [
          {
            label: '新增市场计划',
            click: function () {
              that.add()
            }
          }
        ],
        cols: [
          {
            label: '计划名称',
            prop: 'plan'
          },
          {
            label: '操作',
            minWidth: 120,
            bind: {
              props: {
                fixed: 'right'
              }
            },
            fuc: (row, h, index, i) => {
              let btns = [
                {
                  label: '编辑',
                  no: false,
                  hide: false,
                  click: (row, h, index, i) => { that.edit(row, h, index, i) }
                },
                {
                  label: '删除',
                  confirm: '你确定删除吗？',
                  click: (row, h, index, i) => { that.delete(row, h, index, i) }
                }
              ]
              return {
                type: 'btns',
                btns: btns
              }
            }
          }
        ]
      },
      form: {
        title: '标题',
        visible: false,
        form: {
          read: false,
          bind: {
            props: {
              labelWidth: '150px',
              rules: {
                auto: true,
                input: {
                  required: true
                },
                select: {
                  required: true
                },
                upload: {
                  required: true,
                  type: 'array'
                }
              }
            }
          },
          data: [
            {
              tag: 'el-input',
              label: '输入框',
              prop: 'input',
              bind: {
                props: {
                  placeholder: '请输入注释'
                }
              }
            },
            {
              tag: 'el-select',
              label: '下拉框',
              prop: 'select',
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
              tag: 'jw-upload',
              label: '上传图片',
              prop: 'upload'
            },
            {
              tag: 'btns',
              label: '提交', // 不传默认提交
              fuc (isok, value) {
                console.log(value)
              }
            }
          ],
          hide: {
            ptext: true
          },
          value: {
            input: '',
            select: '',
            upload: []
          }
        }
      }
    }
  },
  mounted () {
    this.$refs.table.search()
  },
  methods: {
    search (d) {
      this.table.data = [
        {
          plan: '计划一'
        }
      ]
    },
    delete (row, h, index, i) {
      console.log('删除')
    },
    edit (row, h, index, i) {
      this.form.visible = true
      setTimeout(() => {
        this.$refs.form.$setValue({
          input: '摄入自',
          select: '',
          upload: ['f15344094106606600284001']
        })
      }, 0)
    },
    add () {
      this.form.visible = true
    }
  }
}
</script>
<style lang="less">
</style>
