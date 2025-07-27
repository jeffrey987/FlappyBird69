import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager'; // 引入 GameManager，用于获取移动速度
const { ccclass, property } = _decorator;

@ccclass('Pipe') // 声明 Pipe 是一个 Cocos 组件
export class Pipe extends Component {

    private moveSpeed: number; // 管道移动速度

    start() {
        this.moveSpeed = GameManager.inst().moveSpeed; // 从 GameManager 单例中获取全局移动速度
    }

    update(deltaTime: number) {
        // 每帧将管道沿 x 轴向左移动，速度 = moveSpeed × deltaTime（保证不同帧率下移动一致）
        this.node.setPosition(this.node.getPosition().add3f(-this.moveSpeed * deltaTime, 0, 0));

        // 如果管道位置小于 -900（已飞出屏幕左侧），销毁该管道对象以释放内存
        if (this.node.getPosition().x < -900) {
            this.node.destroy();
        }
    }
}
