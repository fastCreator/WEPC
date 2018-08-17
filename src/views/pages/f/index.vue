<template>
  <div>
    <jw-table v-bind="table"></jw-table>
  </div>
</template>
<script>
export default {
  data () {
    let that = this
    return {
      table: {
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
        page: {
        },
        btns: [
          {
            label: '新增市场计划',
            click: function () { console.log(that) }
          }
        ],
        cols: [
          {
            label: '计划名称',
            minWidth: 300,
            fuc: (row, h, index, i) => {
              let that = this
              return {
                type: 'text',
                value: row.planName,
                bind: {
                  on: {
                    click () {
                      that.planDataDetail.planId = row.planId
                      that.bindData.show = true
                    }
                  }
                }
              }
            }
          },
          {
            label: '计划类型',
            prop: 'planType',
            minWidth: 150,
            filterMultiple: false,
            filters: [{ text: '全部', value: '' }, { text: '年度计划', value: 1 }, { text: '季度计划', value: 2 }, { text: '月度计划', value: 3 }, { text: '其他计划', value: 4 }],
            fuc (row, h) {
              return {
                type: 'text',
                value: ['年度计划', '季度计划', '月度计划', '其他计划'][row.planType - 1]
              }
            }
          },
          {
            label: '计划状态',
            prop: 'status',
            minWidth: 150,
            filterMultiple: false,
            filters: [{ text: '全部', value: '' }, { text: '计划中', value: 0 }, { text: '进行中', value: 2 }, { text: '已中止', value: 3 }, { text: '已结束', value: 4 }, { text: '已作废', value: 5 }],
            fuc (row, h) {
              return {
                type: 'text',
                value: [ '计划中', '', '进行中', '已中止', '已结束', '已作废' ][row.status]
              }
            }
          },
          {
            label: '预算金额(元)',
            minWidth: 200,
            fuc: (row, h, index, i) => {
              if (row.planType === 1 || row.planType === 4) {
                return <span>{row.price}</span>
              }
              return '¥' + (row.budgetMax - 0).toFixed(2)
            }
          },
          {
            label: '创建人',
            minWidth: 150,
            // prop: 'empPrincipalDetail.empName'
            fuc: (row, h, index, i) => {
              return <span>{row.empPrincipalDetail.empName}</span>
            }
          },
          {
            label: '创建时间',
            minWidth: 150,
            sort: 'custom',
            prop: 'createTime',
            fuc: (row, h, index, i) => {
              return this.$utils.Commom.formatDateDT(new Date(row.gmtCreate), 'yyyy-MM-dd')
            }
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
              let that = this
              let btns = {
                detail: {
                  label: '详情',
                  hide: that.root.detail,
                  click: function () {}
                },
                edit: {
                  label: '编辑',
                  click: function () {}
                },
                start: {
                  label: '启用',
                  click: () => {}
                },
                stop: {
                  label: '中止',
                  click: () => {}
                },
                invalid: {
                  label: '作废',
                  click: () => {}
                }
              }

              return {
                type: 'btns',
                btns: btns
              }
            }
          }
        ]
      }
    }
  },
  created () {},
  methods: {}
}
</script>
<style lang="less">
.opList {
  ul {
    list-style-type: none;
  }
}
</style>
