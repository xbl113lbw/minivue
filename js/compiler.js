class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compiler(this.el)
    }

    // 编译模板，处理文本节点和元素节点
    compiler (el) {
        let childNodes = el.childNodes

        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                // 处理文本节点
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                // 处理元素节点
                this.compileElement(node)
            }

            // 判断 node 节点是否有子节点，如果有子节点，要递归调用 compiler
            if (node.childNodes && node.childNodes.length) {
                this.compiler(node)
            }
        })
    }

    // 编译元素节点，处理指令
    compileElement (node) {
        // 遍历所有属性节点
        Array.from(node.attributes).forEach(attr => {
            // 判断是否是指令
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update (node, key, attrName) {
        let updateFn = this[`${attrName}Updater`]
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }

    // 处理 v-text 指令
    textUpdater (node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }

    // 处理 v-model 指令
    modelUpdater (node, value, key) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        // 双向绑定
        node.addEventListener("input", () => {
            this.vm[key] = node.value
        })
    }

    // 文本节点，处理插值表达式
    compileText (node) {
        // 通过正则表达式匹配插值表达值 {{ msg }}
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])

            // 创建 watcher 对象，当数据改变更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }

    // 判断元素属性是否是指令
    isDirective (attrName) {
        // 判断是否是 v- 开头
        return attrName.startsWith("v-")
    }

    // 判断节点是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }

    // 判断节点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }
}