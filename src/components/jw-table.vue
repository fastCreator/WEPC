<script>
export default {
  name: 'jwTable',
  data () {
    return {
      currentPage: 1,
      currentSize: 20,
      tabIndex: this.activeTabi + '',
      radio: null,
      loading: false,
      loadingId: null,
      mostDown: true,
      sort: {},
      selectionState: {},
      selectAll: 0,
      tableShow: true,
      _height: null,
      filterShow: true
    }
  },
  props: {
    tabstyle: {
      default: 'default'
    },
    tabsRedPoint: {
      default () {
        return []
      }
    },
    activeTabi: {
      default: 0
    },
    queryBind: {
      default () {
        return {}
      }
    },
    clearBind: {
      default () {
        return {}
      }
    },
    selectTab: {},
    filters: {},
    data: {},
    page: {},
    cols: {},
    btns: {},
    tabs: {},
    bind: {},
    height: {},
    most: {},
    hasclear: {
      default: true
    },
    autoHeight: {},
    loadingMsg: {
      default: '拼命加载中'
    },
    loadingTimeOut: {
      default: 2000
    },
    rowspan: {
      default () {
        return []
      },
      require: false
    }
  },
  watch: {
    data: {
      handler: function (val, oldVal) {
        if (this.rowspan && this.rowspan.length) {
          this.$nextTick(() => {
            this.spanCol(this.rowspan)
          })
        }
      },
      deep: true,
      immediate: true
    },
    cols: {
      handler () {
        this.$flashTable()
      },
      deep: true
    },
    autoHeight () {
      this._height = this.tableHeight()
      this.$flashTable()
    },
    height (v) {
      this._height = v
      this.$flashTable()
    },
    mostDown: {
      handler (v) {
        let that = this
        if (this.mostDown) {
          this._height = this.tableHeight() || this.height
          if (this.tabstyle !== 'default' && this.$el && this.isfilterShow) {
            this._height =
              this.height - 0 + this.$el.querySelector('.filter').offsetHeight
            this.isfilterShow = false
          }
          that.$flashTable()
        } else {
          this.$nextTick(() => {
            that._height =
              this.tableHeight(
                that.$el.querySelector('.mostFilter').offsetHeight
              ) ||
              that.height - that.$el.querySelector('.mostFilter').offsetHeight
            that.$flashTable()
          })
        }
      },
      immediate: true
    },
    filterShow: {
      handler (v) {
        let height = this.$el.querySelector('.filter').offsetHeight - 0 + 16
        this.isfilterShow = true
        if (this.most) {
          this.mostDown = true
        }
        if (v) {
          this._height = this.tableHeight() || this.height
        } else {
          this._height = this.tableHeight(-height) || this.height - 0 + height
        }
        this.$flashTable()
      }
    }
  },
  computed: {},
  methods: {
    $clear () {
      this.upfilterclear()
      this.search()
    },
    $setRadio (value) {
      this.radio = value
    },
    $getRadio () {
      return this.radio
    },
    $startLoading () {
      this.$stopLoading()
      this.loadingId = window.setTimeout(() => {
        this.loading = true
      }, this.loadingTimeOut)
    },
    $stopLoading () {
      this.loading = false
      if (this.loadingId) {
        window.clearTimeout(this.loadingId)
      }
    },
    $flashTable () {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    $search () {
      this.search()
    },
    $getFilters () {},
    tableHeight (width) {
      if (!this.autoHeight) return 0
      return window.document.body.offsetHeight - this.autoHeight - (width || 0)
    },
    onresize () {
      this._height = this.tableHeight()
      this.$forceUpdate()
    },
    listResize () {
      window.addEventListener('resize', this.onresize)
    },
    closeResize () {
      window.removeEventListener('resize', this.onresize)
    },
    dealSelect () {
      this.selectAll = 0
      this.data &&
        this.data.forEach(it => {
          if (!it.$checked) {
            this.selectAll++
          }
        })
    },
    upfilterclear () {
      if (!this.filters || !this.filters.length) {
        return false
      }
      let filters = [].concat(this.filters, this.most || [])

      for (let i = 0; i < filters.length; i++) {
        let it = filters[i]
        if (it.type === 'text') {
          this.$set(it, 'value', '')
        } else if (it.type === 'el-date-picker') {
          this.$set(it, 'value', [])
        } else if (it.type === 'range') {
          this.$set(it, 'value', [])
        } else {
          this.$set(
            it,
            'value',
            it.empty ? JSON.parse(JSON.stringify(it.empty)) : null
          )
        }
      }
    },
    filterClear () {
      this.selectionState = {}
      this.sort = {}
      this.upfilterclear()
      this.currentPage = 1
      if (this.page && this.page.pageSize) {
        this.currentSize = this.page.pageSize
      } else {
        this.currentSize = 20
      }
    },
    search () {
      let filters = []
      let that = this
      if (this.filters) {
        filters = filters.concat(
          this.filters.map(function (item) {
            return {
              key: item.prop,
              value: item.value
            }
          })
        )
      }
      if (this.most) {
        filters = filters.concat(
          this.most.map(function (item) {
            return {
              key: item.prop,
              value: item.value
            }
          })
        )
      }
      this.$emit(
        'search',
        {
          filters: filters.length ? filters : null,
          page: this.currentPage,
          size: this.currentSize,
          tabIndex: this.tabIndex - 0,
          sort: that.sort
        },
        this.selectionState
      )
    },
    sortUp (props, col) {
      let that = this
      return function () {
        let index = props.$index
        if (index !== 0) {
          col
            .fuc(that.data[index - 1], that.data[index])
            .then(function () {
              let arr = that.data[index - 1]
              that.$set(that.data, index - 1, that.data[index])
              that.$set(that.data, index, arr)
            })
            .catch(function (msg) {
              that.$message({
                message: msg.message,
                type: 'warning'
              })
            })
        }
      }
    },
    sortDown (props, col) {
      let that = this
      return function () {
        let index = props.$index
        if (index !== that.data.length - 1) {
          col
            .fuc(that.data[index], that.data[index + 1])
            .then(function () {
              let arr = that.data[index + 1]
              that.$set(that.data, index + 1, that.data[index])
              that.$set(that.data, index, arr)
            })
            .catch(function (msg) {
              that.$message({
                message: msg.message,
                type: 'warning'
              })
            })
        }
      }
    },
    span (trs, cols, index, start, end) {
      function changeStyle (trs, colIndex, start, end) {
        for (let index = 0; index <= trs.length - 1; index++) {
          let td = trs[index].getElementsByTagName('td')[colIndex]
          if (index === start) {
            td.setAttribute('rowSpan', end - start + 1)
            td.style.display = null
          } else if (index > start && index <= end) {
            td.style.display = 'none'
            td.setAttribute('rowSpan', '0')
          }
        }
      }
      if (start === null || end === null) {
        start = 0
        end = trs.length - 1
      }
      let i = start
      let span = 1
      let content = trs[i].getElementsByTagName('td')[cols[index]].innerHTML
      while (i <= end) {
        let td = trs[i].getElementsByTagName('td')[cols[index]]
        if (content === td.innerHTML) {
          span++
          i++
        } else {
          changeStyle(trs, cols[index], i - span + 1, i - 1)
          if (cols.length > index + 1) {
            this.span(trs, cols, index + 1, i - span + 1, i - 1)
          }
          content = td.innerHTML
          span = 1
        }
      }
      changeStyle(trs, cols[index], i - span + 1, i - 1)
      if (cols.length > index + 1) {
        this.span(trs, cols, index + 1, i - span + 1, i - 1)
      }

      // if (current) {
      //   current.setAttribute('rowSpan', span)
      //   if (cols.length > index + 1) {
      //     this.span(trs, cols, index + 1, currentRowIndex, currentRowIndex + span - 1)
      //   }
      // }
    },
    spanCol (index) {
      if (!this.data || !this.data.length) return false
      this.spanValue = index
      let tableBodies = []
      let cols = (Array.isArray(index) ? index : [index]).sort()
      setTimeout(() => {
        this.$refs.table &&
          this.$refs.table.$children.forEach(row => {
            if (row.$options._componentTag === 'table-body') {
              tableBodies.push(row)
            }
          })
        tableBodies.forEach(row => {
          let trs = row.$el
            .getElementsByTagName('tbody')[0]
            .getElementsByTagName('tr')
          this.span(trs, cols, 0, null, null)
        })
      }, 0)
    },
    selection (v) {
      if (this.isSelect) {
        return false
      } else {
        this.isSelect = true
        this.$nextTick(() => {
          Object.assign(this.selectionState, v)
          this.search()
          this.isSelect = false
        })
      }
    }
  },
  updated () {
    this.dealSelect()
  },
  render (h) {
    let that = this
    let child = [
      getTabs(),
      getFilters(),
      getMost(),
      getButtonBefore(),
      getButton(),
      getTableBefore(),
      getTable(),
      getPagination()
    ]

    return <div class="jw-table">{child}</div>
    function getTabs () {
      if (!that.tabs || !that.tabs.length) {
        return ''
      }
      if (that.tabstyle === 'default') {
        return h(
          'el-tabs',
          {
            props: {
              activeName: that.tabIndex
            },
            on: {
              'tab-click': function (v) {
                that.tabIndex = v.name
                that.filterClear()
                that.search()
              }
            }
          },
          getTab()
        )
      } else if (that.tabstyle === 'select') {
        return h('div', { class: 'tabsSelect' }, [
          h(
            'el-select',
            {
              props: {
                value: that.tabIndex
              },
              on: {
                input (v) {
                  that.tabIndex = v
                  that.filterClear()
                  that.search()
                }
              }
            },
            that.tabs.map((it, i) =>
              h(
                'el-option',
                { key: it, props: { label: it, value: i + '' } },
                it
              )
            )
          ),
          <span class="split">|</span>,
          <span
            class="el-icon-search toggle"
            onClick={function () {
              that.filterShow = !that.filterShow
            }}
          >
            {that.filterShow ? '收起查询条件' : '展开查询条件'}
          </span>
        ])
      }
    }
    function getTab () {
      let tabs = []
      for (let i = 0; i < that.tabs.length; i++) {
        let tab = that.tabs[i]
        tabs.push(
          h('el-tab-pane', {
            props: {
              key: i + '',
              label: tab,
              name: i + ''
            }
          })
        )
      }
      return tabs
    }
    function getTableBefore () {
      return that.$slots.tableBefore || null
    }
    function getButtonBefore () {
      return that.$slots.buttonBefore || null
    }
    function getTable () {
      let table = null
      if (that.tableShow) {
        table = h(
          'div',
          {
            style: {
              height: that._height + 'px'
            }
          },
          [
            h(
              'el-table',
              merge(
                {
                  class: 'table',
                  props: {
                    border: true,
                    stripe: true,
                    data: that.data,
                    maxHeight: that._height
                  },
                  on: {
                    'sort-change' ({ column, prop, order }) {
                      that.sort = {}
                      if (prop) {
                        that.sort[prop] = order
                      }
                      that.search()
                    },
                    'filter-change' (column) {
                      that.selection(column)
                      return true
                    }
                  },
                  attrs: {
                    'element-loading-text': that.loadingMsg
                  },
                  directives: [
                    {
                      name: 'loading',
                      value: that.loading
                    }
                  ],
                  ref: 'table'
                },
                that.bind
              ),
              getTableItem(that.cols)
            )
          ]
        )
      }
      return table
    }
    function getTableItem (cols) {
      let column = []
      for (let i = 0; i < cols.length; i++) {
        let col = cols[i]
        let bind = col.bind
        if (col.hide) {
          continue
        }
        // explain
        if (col.explain) {
          bind = merge(bind, {
            props: {
              renderHeader (h, { column, $index }) {
                return [
                  h('span', column.label),
                  h('bas-popover', {
                    props: { content: col.explain, placement: 'bottom' }
                  })
                ]
              }
            }
          })
        }
        if (col.child && col.child.length) {
          column.push(
            h(
              'el-table-column',
              merge(bind, {
                props: {
                  minWidth: setMinWidth(col.label),
                  label: col.label
                }
              }),
              getTableItem(col.child)
            )
          )
        } else if (col.type === 'expand') {
          column.push(
            h(
              'el-table-column',
              merge(bind, {
                props: {
                  type: 'expand'
                },
                scopedSlots: {
                  default: function (props) {
                    return col.render(h, props)
                  }
                }
              })
            )
          )
        } else if (col.type === 'sort') {
          column.push(
            h(
              'el-table-column',
              merge(bind, {
                props: {
                  label: col.label,
                  width: 80,
                  sortable: col.sort
                },
                scopedSlots: {
                  default: function (props) {
                    var className = 'sort'
                    if (props.$index === that.data.length - 1) {
                      className += ' sortNo'
                    }
                    return (
                      <div class={className}>
                        <span
                          class="fa fa-arrow-circle-up sort-up"
                          onClick={that.sortUp(props, col)}
                          title="上移一行"
                        />
                        <span
                          class="fa fa-arrow-circle-down sort-down"
                          onClick={that.sortDown(props, col)}
                          title="下移一行"
                        />
                      </div>
                    )
                  }
                }
              })
            )
          )
        } else if (col.type === 'index') {
          column.push(
            h(
              'el-table-column',
              merge(bind, {
                props: {
                  label: col.label,
                  width: 80,
                  sortable: col.sort
                },
                scopedSlots: {
                  default: function (props) {
                    return h(
                      'span',
                      props.$index +
                        1 +
                        (that.currentPage - 1) * that.currentSize
                    )
                  }
                }
              })
            )
          )
        } else if (col.type === 'selection') {
          column.push(
            h(
              'el-table-column',
              merge(bind, {
                props: {
                  type: 'selection',
                  prop: col.prop || 'checked',
                  width: 46
                }
              })
            )
          )
        } else if (col.type === 'radio') {
          column.push(
            h(
              'el-table-column',
              merge(bind, {
                props: {
                  width: 46,
                  label: col.label,
                  'label-class-name': 'table-radio'
                },
                scopedSlots: {
                  default: function (props) {
                    return h(
                      'el-radio',
                      {
                        props: {
                          value: that.radio,
                          label: props.$index
                        },
                        class: 'cell-radio',
                        on: {
                          input (value) {
                            that.radio = value
                            that.$emit('radio', value)
                          }
                        }
                      },
                      ''
                    )
                  }
                }
              })
            )
          )
        } else if (col.type === 'checkbox') {
          let selectAll = function (value) {
            that.data.forEach(function (it) {
              it.$checked = value
            })
            if (value) {
              that.selectAll = 0
            } else {
              that.selectAll = that.data.length
            }
            if (col.input) {
              col.input(value)
            }
            that.$emit('checkboxAll', value)
          }
          column.push(
            h(
              'el-table-column',
              merge(bind, {
                props: {
                  width: col.width || 54,
                  renderHeader (h, { column, $index }) {
                    return h(
                      'el-checkbox',
                      {
                        class: 'cell-all-checkbox',
                        props: {
                          value: !that.selectAll
                        },
                        attrs: {
                          disabled: col.disabled
                        },
                        on: {
                          input: selectAll
                        }
                      },
                      col.label || ''
                    )
                  }
                },
                scopedSlots: {
                  default: function (props) {
                    return h(
                      'el-checkbox',
                      {
                        props: {
                          value: that.data[props.$index].$checked,
                          disabled: col.disabled
                        },
                        class: 'cell-checkbox',
                        on: {
                          input (value) {
                            that.data[props.$index].$checked = value
                            if (col.input) {
                              col.input(value)
                            }
                            if (value) {
                              that.selectAll--
                            } else {
                              that.selectAll++
                            }
                            that.$emit(
                              'checkbox',
                              that.data[props.$index],
                              props
                            )
                          }
                        }
                      },
                      ''
                    )
                  }
                }
              })
            )
          )
        } else {
          let obj = {
            label: col.label,
            prop: col.prop,
            width: col.width,
            minWidth: col.minWidth || setMinWidth(col.label),
            showOverflowTooltip: col.showOverflowTooltip,
            filterPlacement: 'bottom',
            sortable: col.sort,
            'render-header' () {
              if (col.header) {
                return [col.label, <bas-popover content={col.header} />]
              }
              return col.label
            }
          }
          if (col.filters) {
            obj.filters = col.filters
            obj.filterMultiple = col.filterMultiple
            obj.columnKey = col.prop
          }
          if (col.type === 'price') {
            obj.align = 'right'
          }
          column.push(
            h(
              'el-table-column',
              merge(
                {},
                {
                  props: obj,
                  scopedSlots: {
                    default: function (props) {
                      let index =
                        props.$index +
                        1 +
                        (that.currentPage - 1) * that.currentSize
                      let temp
                      if (col.fuc) {
                        temp = col.fuc(
                          props.row,
                          h,
                          index,
                          props.$index,
                          props
                        )
                      } else {
                        temp = Object.assign({}, col, {
                          type: col.type || 'text',
                          value: props.row[col.prop]
                        })
                      }
                      if (!temp) {
                        return ''
                      }
                      if (~['text', 'price', 'time'].indexOf(temp.type)) {
                        return h(
                          'span',
                          merge(temp.bind, {
                            class: {
                              nowrap: true
                            },
                            on: {
                              mouseenter (e) {
                                let cell = e.target.parentNode
                                if (cell.scrollWidth > cell.offsetWidth) {
                                  e.target.setAttribute('title', temp.value)
                                }
                              },
                              mouseleave (e) {
                                e.target.setAttribute('title', '')
                              }
                            }
                          }),
                          (function (type, value, opt) {
                            if (type === 'price') {
                              return toMoney(temp.value)
                            }
                            if (type === 'time') {
                              return that.$utils.Commom.formatDateDT(
                                value,
                                opt || 'yyyy-MM-dd'
                              )
                            }
                            return value
                          })(temp.type, temp.value, temp.option)
                        )
                      }
                      if (temp.type === 'tag') {
                        return h(
                          'el-tag',
                          { props: { type: temp.name } },
                          temp.value
                        )
                      }
                      if (temp.type === 'btns') {
                        let btns = temp.btns
                        let arr = []
                        for (let i = 0; i < btns.length; i++) {
                          let btn = btns[i]
                          if (btn.hide) continue

                          arr.push(
                            h(
                              'el-button',
                              {
                                class: btn.no ? 'nobtn' : '',
                                props: {
                                  type: 'text',
                                  disabled: btn.no
                                },
                                on: {
                                  click: function () {
                                    if (btn.confirm) {
                                      that
                                        .$msgbox({
                                          title: '提示',
                                          message: btn.confirm,
                                          showCancelButton: true,
                                          confirmButtonText: '确定',
                                          cancelButtonText: '取消'
                                        })
                                        .then(action => {
                                          btn.click()
                                        })
                                    } else {
                                      btn.click()
                                    }
                                  }
                                },
                                attrs: {
                                  title: btn.title
                                }
                              },
                              btn.label
                            )
                          )
                        }
                        // 下拉更多操作
                        let most = temp.most
                        if (most && most.options && most.options.length) {
                          // let dropdownItem = []
                          arr.push(
                            <el-dropdown
                              on-command={function (v) {
                                let confirm = false
                                for (let i = 0; i < most.options.length; i++) {
                                  let item = most.options[i]
                                  if (item.label === v && item.confirm) {
                                    confirm = item.confirm
                                    break
                                  }
                                }
                                if (confirm) {
                                  that
                                    .$msgbox({
                                      title: '提示',
                                      message: confirm,
                                      showCancelButton: true,
                                      confirmButtonText: '确定',
                                      cancelButtonText: '取消'
                                    })
                                    .then(action => {
                                      most.fuc(v)
                                    })
                                } else {
                                  most.fuc(v)
                                }
                              }}
                              trigger="click"
                              className="jw-table"
                            >
                              <span
                                class={{
                                  'el-dropdown-most': true,
                                  disabled: temp.disabled
                                }}
                                title={most.title || '更多操作'}
                              >
                                <i class="el-icon-arrow-down el-icon--right" />
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                {most.options
                                  .filter(item => !item.hide)
                                  .map(function (item) {
                                    return (
                                      <el-dropdown-item
                                        command={item.label}
                                        disabled={item.no}
                                      >
                                        <span style="font-size:14px;">
                                          {item.label}
                                        </span>
                                      </el-dropdown-item>
                                    )
                                  })}
                              </el-dropdown-menu>
                            </el-dropdown>
                          )
                        }
                        return arr.length ? arr : ''
                      }
                      return temp
                    }
                  }
                },
                bind
              )
            )
          )
        }
      }
      return column
    }

    function getPagination () {
      if (!that.page) return null
      that.currentSize = that.page.pageSize || that.currentSize
      if (that.page.currentPage) {
        that.currentPage = that.page.currentPage
      }
      return h(
        'el-pagination',
        merge(that.page.bind, {
          attrs: {
            pageSizes: that.page.pageSizes || [10, 20, 30, 50],
            pageSize: that.page.pageSize || 20,
            currentPage: that.page.currentPage || that.currentPage,
            total: that.page.total,
            layout: that.page.layout || 'total,sizes,prev,pager,next,jumper'
          },
          on: {
            'size-change': function (size) {
              that.currentSize = size
              that.search()
            },
            'current-change': function (page) {
              that.currentPage = page
              that.search()
            }
          }
        }),
        ''
      )
    }
    function getButton () {
      let btns = []
      if (that.btns) {
        for (let i = 0; i < that.btns.length; i++) {
          let btn = that.btns[i]
          if (btn.hide) {
            continue
          }
          if (btn.option) {
            let item = []
            for (let i = 0; i < btn.option.length; i++) {
              item.push(
                <el-dropdown-item command={btn.option[i]}>
                  {btn.option[i]}
                </el-dropdown-item>
              )
            }
            btns.push(
              h(
                'el-dropdown',
                {
                  on: {
                    command: btn.command || noon
                  },
                  props: {
                    trigger: 'click'
                  }
                },
                [
                  <el-button type="primary">
                    {btn.label}
                    <i class="el-icon-caret-bottom el-icon--right" />
                  </el-button>,
                  <el-dropdown-menu slot="dropdown">{item}</el-dropdown-menu>
                ]
              )
            )
          } else {
            let bind = merge(btn.bind, {
              props: {
                type: btn.type || 'primary',
                icon: btn.icon || ''
              },
              on: {
                click: btn.click || noon
              }
            })
            btns.push(h('el-button', bind, btn.label || ''))
          }
        }
      }
      if (btns.length) {
        return <div class="btns">{btns}</div>
      } else {
        return ''
      }
    }
    function getMost () {
      let arr = []
      that.most &&
        that.most.forEach(function (item) {
          arr.push(filterItem(item))
        })
      return h(
        'div',
        {
          class: {
            most: true,
            mostFilter: true,
            noSenior: !that.most,
            none: that.mostDown
          }
        },
        arr
      )
    }
    function getFilters () {
      if (!that.filters) {
        return ''
      }
      let filters = []
      for (let i = 0; i < that.filters.length; i++) {
        filters.push(filterItem(that.filters[i]))
      }
      let find = []
      find.push(
        h(
          'el-button',
          merge(
            {
              props: {
                type: 'primary'
              },
              on: {
                click: function () {
                  that.currentPage = 1
                  that.search()
                }
              }
            },
            that.queryBind
          ),
          '查询'
        )
      )

      if (that.hasclear) {
        find.push(
          h(
            'el-button',
            merge(
              {
                on: {
                  click: function () {
                    that.$clear()
                  }
                }
              },
              that.clearBind
            ),
            '清空'
          )
        )
      }

      filters.push(h('span', { class: 'find' }, find))

      if (that.most && that.most.length) {
        var toggleCaret = function () {
          that.mostDown = !that.mostDown
        }
        if (that.mostDown) {
          filters.push(
            <span onClick={toggleCaret} class="caret el-icon-caret-bottom">
              高级查询
            </span>
          )
        } else {
          filters.push(
            <span onClick={toggleCaret} class="caret el-icon-caret-top">
              收起
            </span>
          )
        }
      }
      return h(
        'div',
        {
          class: {
            filter: true,
            noSenior: !(that.most || that.tabstyle !== 'default'),
            tabstyle: that.tabstyle !== 'default'
          },
          style: { display: that.filterShow ? null : 'none' }
        },
        filters
      )
    }
    function filterItem (filter) {
      let type = filter.type
      let options = filter.options
      let value = filter.value
      let title = filter.title
      let input = function (v, name) {
        that.$set(filter, 'value', v)
      }
      let inputName = function (name) {
        return function (v) {
          that.$set(filter.value, name, v)
        }
      }
      let model = merge(
        {
          on: {
            input: input
          },
          nativeOn: {
            keyup: function (e) {
              if (e.keyCode === 13) {
                that.currentPage = 1
                that.search()
              }
            }
          },
          props: {
            value: value
          },
          class: ['filter-item']
        },
        filter.bind
      )
      // if (type === 'title') {
      //   return h('span', merge({
      //     class: ['title']
      //   }, filter.bind), filter.name)
      // } else
      let ret = null
      if (type === 'text') {
        ret = h('el-input', model)
      } else if (type === 'select') {
        let opts = []
        for (let i = 0; i < options.length; i++) {
          let it = options[i]
          opts.push(
            h('el-option', {
              props: {
                label: it.label,
                value: it.value
              }
            })
          )
        }
        if (filter.remote) {
          model.props.remoteMethod = function (v) {
            if (v && v.trim()) {
              filter.remoteMethod(v)
            } else {
              filter.options = []
              input('')
            }
          }
          model.props.filterable = true
          model.props.remote = true
        }
        ret = h('el-select', model, opts)
      } else if (type === 'range') {
        ret = h('span', { class: 'range filter-item' }, [
          <el-input
            type="number"
            value={value[0]}
            on-input={inputName(0)}
            placeholder={filter.placeholder ? filter.placeholder[0] : ''}
          />,
          <span>-</span>,
          <el-input
            type="number"
            value={value[1]}
            on-input={inputName(1)}
            placeholder={filter.placeholder ? filter.placeholder[1] : ''}
          />
        ])
      } else {
        ret = h(type, model)
      }
      if (title) {
        ret = h('span', { class: 'itemSpan' }, [
          <span class="title">{title}</span>,
          ret
        ])
      }
      return ret
    }
  },
  created () {
    this.dealSelect()
    if (this.autoHeight) {
      this._height = this.tableHeight()
      this.listResize()
    }
  },
  mounted () {},
  beforeDestroy () {
    if (this.autoHeight) {
      this.closeResize()
    }
  }
}

function merge () {
  var one = arguments[0]
  for (let i = 1; i < arguments.length; i++) {
    one = mer(one, arguments[i])
  }
  return one
  function mer (obj1, obj2) {
    let obj = Object.assign({}, obj2)
    for (let key in obj1) {
      if (typeof obj[key] === 'object') {
        if (obj[key] instanceof Array) {
          obj[key] = [].concat(obj1[key], obj[key])
        } else {
          obj[key] = Object.assign({}, obj1[key], obj[key])
        }
      }
    }
    return Object.assign({}, obj1, obj)
  }
}

function setMinWidth (label) {
  return label.length * 15 + 36 + 'px'
}

// 将数字转换成金额显示
function toMoney (num) {
  if (!num && num !== 0) return ''
  if (typeof num === 'string') {
    num -= 0
  }
  num = num.toFixed(2)
  // num = parseFloat(num)
  num = num.toLocaleString()
  return '￥' + num // 返回的是字符串23,245.12保留2位小数
}

function noon () {}
</script>
<style lang="less">
    .jw-table .none{
  display: none;
}
.jw-table .alignRight{
  text-align: right;
}
.jw-table .filter .find{
  display: inline-block;
  width: 160px;
  height: 52px;
}
.jw-table .filter-item {
  width: 204px;
  display: inline-block;
  margin-bottom: 16px;
}

.jw-table .filter-item+.filter-item, .jw-table .filter button {
  margin-left: 10px;
}

.jw-table .btns {
  margin-bottom: 16px;
}

.jw-table .el-pagination {
  float: right;
  margin-top: 16px;
}

.jw-table .nobtn {
  color: #ccc !important;
  cursor: not-allowed;
}

.jw-table .cell>span+.el-button {
  margin-left: 10px;
}

.jw-table .cell>span+* {
  margin-left: 10px;
}

.jw-table .cell>*+span {
  margin-left: 10px;
}

.jw-table *+.el-dropdown {
  margin-left: 10px;
}

.jw-table .cell .el-dropdown {
  color: #20a0ff;
}

.jw-table .nowrap {
  white-space: nowrap
}

.jw-table .el-table__body-wrapper tr.el-table__row:nth-of-type(1) .sort-up, .jw-table .el-table__body-wrapper .sortNo .sort-down {
  color: #ccc;
  cursor: not-allowed;
}

.jw-table .sort {
  font-size: 18px;
  cursor: pointer;
}

.jw-table .sort .sort-down {
  margin-left: 10px;
}

.jw-table .cell-radio {
  margin-left: -4px;
}

.jw-table .el-table__empty-block {
  min-height: 200px;
  width: 100% !important;
}

.jw-table .title {
  margin-right: 10px;
  display: inline-block;
  width: 74px;
  text-align: right;
}

.jw-table .noSenior .title {
  display: inline;
}

.jw-table .noSenior .itemSpan:nth-child(n+2) .title {
  margin-left: 10px;
}

.jw-table .caret {
  margin-left: 10px;
  color: #bfcbd9;
  cursor: pointer;
}

.jw-table .caret:hover {
  color: #20a0ff
}

.jw-table .most .range {
  height: 36px;
  display: inline-block;
}

.jw-table .most .range .el-input {
  width: 92px;
}

.jw-table .most .range span {
  display: inline-block;
  width: 20px;
  text-align: center;
}

.jw-table .itemSpan {
  display: inline-block;
}

.el-table-filter__list .el-table-filter__list-item:first-child {
  display: none;
}

.jw-table .el-table .cell {
  white-space: nowrap;
}

.jw-table .el-dropdown-most {
  cursor: pointer;
  display: inline-block;
  border: 1px solid #4db3ff;
  border-radius: 6px;
  padding: 4px 3px 2px;
  text-align: center;
  line-height: 1;
  font-size: 12px;
}

.jw-table .el-dropdown-most.disabled{
  border: 1px solid #ccc;
  color: #ccc;
  pointer-events: none;
}

.jw-table .el-dropdown-most .el-icon--right {
  margin-left: 0px;
}

.jw-table input[type=number] {
  -moz-appearance: textfield;
}

.jw-table input[type=number]::-webkit-inner-spin-button, .jw-table input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.jw-table .itemSpan .title {
  font-size: 14px;
}

.jw-table .filter .caret {
  font-size: 14px;
  color: #20a0ff
}

.jw-table .el-dropdown-menu__item {
  font-size: 14px;
}

.jw-table .tabsSelect {
  display: block;
  height: 50px;
}

.jw-table .tabsSelect .split {
  margin: 0 20px;
  color: #E4E4E4;
}

.jw-table .tabsSelect .toggle {
  color: #20A0FF;
  cursor: pointer;
}

.jw-table .el-table .lock .el-table-column--selection .el-checkbox {
  display: none;
}

.jw-table .el-table .tabsSelect .el-select {
  width: inherit
}

.jw-table .filter.tabstyle {
  background: #EFF2F7;
  padding-top: 16px;
  position: relative;
  margin-bottom: 16px;
}

.jw-table .filter.tabstyle:before {
  content: "\E60C";
  font-family: element-icons!important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #EFF2F7;
  position: absolute;
  top: -11px;
  left: 310px;
}

.jw-table .filter.tabstyle .filter-item{
  width:220px;
}

.jw-table .btn-text{
  color: #409eff;
  cursor: pointer;
}

.jw-table .btn-text:hover{
  color: #66b1ff;
  cursor: pointer;
}

.jw-table .el-table .cell .bas-popover .fa-question-circle{
  margin-left: 6px;
}
.jw-table .el-table .cell .el-tooltip{
  margin-right: 0;
}
.jw-table thead th>.cell{
  text-overflow: clip;
}
.jw-table .table-radio .cell{
  padding-left: 10px;
}

</style>
