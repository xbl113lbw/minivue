class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        // data 中的属性名称
        this.key = key
        // 回调函数负责更新视图
        this.cb = cb

        // 把 watcher 对象记录到 Dep 类的静态属性 target 中
        Dep.target = this
        // 触发 get 方法，在 get 方法中会调用 addSub
        this.oldValue = vm[key]
        Dep.target = null
    }

    // 当数据发生变化的时候更新视图
    update () {
        // 首先获取最新的数据（update 调用时数据已经发生了变化）
        let newValue = this.vm[this.key]
        if (newValue === this.oldValue) return
        this.cb(newValue)
    }
}
