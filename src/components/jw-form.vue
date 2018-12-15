<script>
export default {
  name: 'jw-form',
  props: {
    readItem: {
      default () {
        return {}
      }
    },
    read: {
      default: null
    },
    data: {},
    value: {},
    bind: {},
    components: {},
    hide: {
      default () {
        return {}
      }
    },
    groupHide: {
      default () {
        return {}
      }
    },
    rules: {
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      myValue: JSON.parse(JSON.stringify(this.value)),
      oldValue: JSON.stringify(this.value)
    }
  },
  watch: {
    value: {
      handler (v) {
        this.myValue = clone(v)
      },
      deep: true
    }
  },
  created () {
  },
  methods: {
    $setValueField (key, value) {
      this.myValue[key] = value
    },
    $setValue (v) {
      this.oldValue = JSON.stringify(v)
      this.myValue = clone(v)
    },
    $hasChange () {
      let rgx = /"\w+":null,?/g
      return JSON.stringify(this.myValue).replace(rgx, '') === this.oldValue.replace(rgx, '')
    },
    $getValue () {
      return this.myValue
    },
    $validate (cb) {
      this.$refs.form.validate(cb)
    },
    $validateField (prop, cb) {
      this.$refs.form.validateField(prop, cb)
    },
    $resetFields () {
      this.$refs.form.resetFields()
    }
  },
  computed: {

  },
  render (h) {
    let that = this
    let bind = that.bind
    if (bind.props.rules && bind.props.rules.auto) {
      let r = bind.props.rules
      for (let key in r) {
        if (key !== 'auto') {
          r[key] = formItemRuleConfig(r[key])
        }
      }
      r.auto = false
    }
    if (that.read) {
      bind = JSON.parse(JSON.stringify(that.bind))
      delete bind.props.rules
    }
    return h(
      'div',
      {
        class: ['jw-form', that.read ? 'read' : '']
      },
      [
        h(
          'el-form',
          merge(
            {
              props: {
                model: that.myValue,
                size: 'small'
              },
              ref: 'form'
            },
            bind
          ),
          getItems()
        )
      ]
    )

    function getItems () {
      return that.data.map((item, i) => getItem(item, (item.prop || 0) + i + ''))
    }

    function getItem (item, key) {
      if (that.hide[item.prop] || (item.group && that.groupHide[item.group])) {
        return null
      }
      if (item.tag === 'title') {
        return getTitle(item)
      } else if (item.tag === 'btns' && !that.read) {
        return getBtns(item, key)
      } else if (item.tag === 'agree' && !that.read) {
        return getAgree(item, key)
      } else if (item.tag === 'error') {
        return getError(item, key)
      }
      let components = getComponents(item)
      let question = null
      if (item.question) {
        question = <template slot='label'>{item.label}<bas-popover style='margin-left:6px;' content={item.question} placement='top' /></template>
      }
      if (components !== false) {
        return h('el-form-item', merge({
          key: key,
          props: {
            label: item.question ? null : item.label,
            prop: item.prop
          }}, item.itemBind), [].concat(question, components))
      } else {
        return null
      }
    }

    function getTitle (item) {
      return h('div', merge({}, item.bind, {class: {'el-form-item': true}}), [
        h('div', merge({}, item.bind, {class: {title: true, 'el-icon-document': true}}), item.label),
        item.fuc ? item.fuc(h) : null
      ])
    }

    function getBtns (opts, key) {
      let btns = (opts.btns || []).map(opt => h('el-button', merge({}, opt.bind), opt.name))
      if (opts.fuc) {
        btns.push(h('el-button', merge({
          props: {type: 'primary'},
          on: {click () {
            if (opts.before) {
              opts.before((json) => {
                for (let key in json) {
                  that.$setValueField(key, json[key])
                }
              }, that)
            }
            that.$validate((isok) => { opts.fuc(isok, that.myValue) })
          }}
        }, opts.bind), opts.label || '取消'))
      }
      return h('el-form-item', {class: 'write', key: key}, btns)
    }

    function getAgree (item, key) {
      return h('el-form-item', {key: key}, [
        h('el-checkbox', {
          props: {
            value: that.myValue[item.prop]
          },
          on: {
            input (v) {
              that.$emit('change', item.prop, v)
              that.myValue[item.prop] = v
            }
          }
        }, item.label)
      ])
    }

    function getError (item, key) {
      return h('el-form-item', {key: key}, [
        <span class='el-form-item__error' style='margin-top: -12px;'>{item.label}</span>
      ])
    }

    function getComponents (item) {
      if (that.readItem[item.prop]) {
        return item.read.call(that, h, that.myValue[item.prop])
      }
      if (that.read && !item.write) {
        return item.read ? item.read.call(that, h, that.myValue[item.prop]) : getReadComponent(item)
      } else {
        let render = item.render ? item.render.call(that, h, item, that.myValue) : []
        return [].concat(getComponent(item), render)
      }
    }

    function getComponent (item) {
      let child = null
      let value = item.value || that.myValue[item.prop]
      if (item.tag === 'text') {
        return <span>{value}</span>
      }
      if (item.options) {
        let getOpt = (name, opt) => {
          return h(
            name,
            merge(opt.bind, {
              props: {
                label: opt.value
              }
            }),
            opt.label
          )
        }
        if (item.tag === 'el-checkbox-group') {
          child = item.options.map(opt => getOpt('el-checkbox', opt))
        } else if (item.tag === 'el-radio-group') {
          child = item.options.map(opt => getOpt('el-radio', opt))
        } else {
          child = item.options.map(opt => (
            <el-option label={opt.label} value={opt.value} />
          ))
        }
      }
      if (item.slots) {
        child = item.slots(h)
      }
      let max = ruleHasProp(that.bind.props.rules, item.prop, 'max')
      let mergeOpt = {}
      let opts = {
        props: {
          value: value
        },
        class: {
          'v-number': max && item.max
        },
        on: {
          input (v) {
            if (mergeOpt.props.type === 'number') {
              v = v - 0
            }
            that.$emit('change', item.prop, v)
            that.myValue[item.prop] = v
          }
        },
        directives: []
      }
      mergeOpt = merge(opts, item.bind)

      if (max && item.max) {
        opts.directives.push({
          name: 'jw-number',
          value: max
        })
      }
      return h(item.tag, mergeOpt, child)
    }

    function getReadComponent (item) {
      let value = that.myValue[item.prop]
      let text = ['el-input', 'text', 'input-choose']
      if (~text.indexOf(item.tag)) {
        return value
      }
      let orgin = ['el-checkbox-group', 'el-radio-group', 'el-rate']
      if (~orgin.indexOf(item.tag) || item.write) {
        item.write = true
        return getComponents(item)
      }
      if (item.tag === 'el-address') {
        return value.join('/')
      }
      if (item.read === false) {
        return false
      }
      if (~['btns'].indexOf(item.tag)) {
        return false
      }
      return value
    }
  }
}
function ruleHasProp (rules, prop, attr) {
  let value = false
  if (rules && rules[prop]) {
    let rule = rules[prop]
    if (Array.isArray(rules[prop])) {
      for (let i = 0; i < rule.length; i++) {
        let item = rule[i]
        if (item[attr]) {
          value = item[attr]
          break
        }
      }
    } else {
      value = rule[attr]
    }
  }
  return value
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

function clone (Obj) {
  var buf
  if (Obj instanceof Date) {
    return Obj
  }
  if (Obj instanceof Array) {
    buf = [] // 创建一个空的数组
    var i = Obj.length
    while (i--) {
      buf[i] = clone(Obj[i])
    }
    return buf
  } else if (Obj instanceof Object) {
    buf = {} // 创建一个空对象
    for (var k in Obj) { // 为这个对象添加新的属性
      buf[k] = clone(Obj[k])
    }
    return buf
  } else {
    return Obj
  }
}
/**
 * 表格输入框验证规则配置
 * @param required 是否必填
 * @param max 最大长度限制
 * @param validator 进行校验的方法
 * @param type 类型
 * @param regx 正则表达式
 * @param msg 特定的message
 * @returns {Array}
 */

function formItemRuleConfig ({ required, max, validator, type, regx, msg }) {
  console.log(111111111)
  const err = {
    empty: '不能为空，请输入',
    format: '格式错误，请输入',
    length: function (num) {
      return '字数已超过最大限制' + num
    }
  }
  let ruleConfigArr = []
  if (required) {
    ruleConfigArr.push({
      required: true,
      message: err.empty,
      trigger: 'blur'
    })
  }
  if (max) {
    ruleConfigArr.push({
      max: max,
      message: err.length(max),
      trigger: 'change'
    })
    ruleConfigArr.push({
      max: max,
      message: err.length(max),
      trigger: 'blur'
    })
  } else {
    ruleConfigArr.push({
      message: '',
      trigger: 'blur'
    })
    ruleConfigArr.push({
      message: '',
      trigger: 'change'
    })
  }
  if (validator) {
    ruleConfigArr.push({
      trigger: 'blur',
      validator: validator
    })
  }
  if (regx) {
    ruleConfigArr.push({
      trigger: 'blur',
      validator: function (rule, value, cb) {
        if (!regx.test(value)) {
          msg ? cb(new Error(msg)) : cb(new Error(err.format))
        }
        cb()
      }
    })
  }
  if (type) {
    ruleConfigArr.map(item => {
      item.type = type
    })
  }
  return ruleConfigArr
}
</script>
<style lang="less">
.el-dialog{
  .jw-form{
    .el-form-item__content{
      .el-input{
        width:360px;
      }
    }
  }
}
.jw-form{
  .el-upload__tip{
    margin-top:0;
  }
  .el-icon-document:before {
    content: ".";
    display: inline-block;
    background: #409EFF;
    color:transparent;
    width: 4px;
    height: 20px;
  }
  &.read .el-form-item{
    pointer-events: none;
  }
  &.read .write{
    pointer-events: initial;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
  }
  input[type="number"]{-moz-appearance:textfield;}
  .title{
    font-size:18px;
    font-weight: bold;
  }
  .el-icon-document:before{
    margin-right: 8px;
  }
  .el-form-item{
     &.min{
      .el-address,.el-textarea,.el-textarea,.input-tree,.bas-select-close,&>.input-choose,&>.el-date-editor,&>.el-input-select,&>.el-select,.el-input{
        width:200px;
      }
    }
    &.mid{
      .el-address,.el-textarea,.el-textarea,.input-tree,.bas-select-close,&>.input-choose,&>.el-date-editor,&>.el-input-select,&>.el-select,.el-input{
        width:460px;
      }
    }
    &.max{
      .el-address,.el-textarea,.el-textarea,.input-tree,.bas-select-close,&>.input-choose,&>.el-date-editor,&>.el-input-select,&>.el-select,.el-input{
        width:700px;
      }
    }
  }
  .el-form-item__content{
    &>.el-input,&>.el-date-editor,&>.el-textarea,&>.input-tree,&>.el-select,&>.bas-address,&>.el-cascader{
      width:460px;
    }
    &>.el-address,&>.bas-select-close,&>.input-choose,&>.el-input-select{
      width:700px;
    }
    &>.el-rate{
      margin-top:8px;
    }
  }
  .el-input-select .el-select{
    width:100%;
    .el-input{
      width:100%;
    }
  }
}
</style>
