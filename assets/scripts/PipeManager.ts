import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc'; // 导入 Cocos Creator 的相关模块
import { Pipe } from './Pipe'; // 导入自定义的 Pipe 类
const { ccclass, property } = _decorator; // 从装饰器模块中解构所需装饰器

@ccclass('PipeManager') // 声明 PipeManager 类是一个 Cocos 组件
export class PipeManager extends Component {
    @property(Prefab)
    pipePrefab: Prefab = null; // 预制体属性，用于生成管道对象（从编辑器中绑定）

    @property
    spawnRate: number = 2; // 管道生成间隔（单位秒）

    private timer: number = 2; // 当前计时器初始值，用于控制生成频率
    private _canSpawn: boolean = false; // 控制是否允许生成管道的标志位

    update(deltaTime: number) {
        if (!this._canSpawn) return; // 如果不允许生成，直接返回
        this.timer += deltaTime; // 累加帧间时间
        if (this.timer >= this.spawnRate) { // 达到生成间隔
            this.timer = 0; // 重置计时器
            const pipeInst = instantiate(this.pipePrefab); // 实例化一个新的管道对象
            this.node.addChild(pipeInst); // 将管道添加为当前节点的子节点
            const randomH = math.randomRangeInt(-100, 100); // 随机生成一个-100 到 100 之间的高度偏移
            pipeInst.setWorldPosition(this.node.getWorldPosition().add3f(0, randomH, 0)); // 设置管道的位置为当前节点位置加上随机高度
        }
    }

    enableSpawn() {
        this._canSpawn = true; // 开启管道生成
    }

    disableSpawn() {
        this._canSpawn = false; // 关闭管道生成
        this.node.children.forEach(pipe => {
            pipe.getComponent(Pipe).enabled = false; // 禁用所有子节点中的 Pipe 组件
        })
    }
}
