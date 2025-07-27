import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager'; // 引入游戏管理器，用于获取统一移动速度
const { ccclass, property } = _decorator;

@ccclass('Scroll') // 声明为 Scroll 组件
export class Scroll extends Component {
    @property(Node)
    target1: Node = null; // 第一个滚动节点（如背景图片1）

    @property(Node)
    target2: Node = null; // 第二个滚动节点（如背景图片2）

    _canMove: boolean = false; // 是否允许滚动的标志
    private scrollSpeed: number; // 滚动速度（由 GameManager 提供）

    start() {
        this.scrollSpeed = GameManager.inst().moveSpeed; // 获取全局移动速度
    }

    enableMove() {
        this._canMove = true; // 启用滚动
    }

    disableMove() {
        this._canMove = false; // 禁用滚动
    }

    update(deltaTime: number) {
        if (!this._canMove) return; // 不滚动时跳出

        const moveDistance = -this.scrollSpeed * deltaTime; // 根据帧率计算每帧移动距离（负值表示向左）

        // 更新两个滚动目标的位置
        this.target1.setPosition(this.target1.getPosition().add3f(moveDistance, 0, 0));
        this.target2.setPosition(this.target2.getPosition().add3f(moveDistance, 0, 0));

        // 如果 target1 移动到画面外（x 小于 -730），将其移到 target2 的右侧，形成循环
        if (this.target1.getPosition().x < -730) {
            this.target1.setPosition(this.target2.getPosition().add3f(728, 0, 0));
        }

        // 如果 target2 移动到画面外（x 小于 -730），将其移到 target1 的右侧
        if (this.target2.getPosition().x < -730) {
            this.target2.setPosition(this.target1.getPosition().add3f(728, 0, 0));
        }
    }
}
