class Observer {
    constructor(data) {
        this.walk(data)
    }

    // 遍历对象的所有属性
    walk (data) {
        // 判断 data 是否是对象
        if (!data || typeof data !== "object") return
        // 遍历 data 对象的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    // 通过 Object.defineProperty 把属性转换为 getter 和 setter
    // 此处传递第三个参数 val，而不使用 obj[key] 的原因是为了防止死递归（vue.js _proxyData 方法）
    defineReactive (obj, key, val) {
        let that = this
        // 负责收集依赖，并发送通知
        let dep = new Dep()
        // 如果 val 是对象，把 val 内部的属性也转换成响应书数据
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () {
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set (newValue) {
                if (newValue === val) return
                val = newValue
                that.walk(newValue)
                // 发送通知
                dep.notify()
            }
        })
    }
}