import { _decorator, Animation, AudioClip, Collider2D, Component, Contact2DType, Input, input, IPhysics2DContact, RigidBody2D, Vec2 } from 'cc';
import { Tags } from './Tags'; // 引入标签常量（如 LAND、PIPE、PASS）
import { GameManager } from './GameManager'; // 游戏管理器，用于控制状态
import { AudioMgr } from './AudioMgr'; // 音频播放管理器

const { ccclass, property } = _decorator;

@ccclass('Bird') // 声明组件名称
export class Bird extends Component {
    @property
    rotateSpeed: number = 60; // 小鸟下落旋转速度

    @property(AudioClip)
    clickAudio: AudioClip = null; // 点击时播放的音效

    _canControl: boolean = false; // 是否可以控制小鸟

    protected onLoad(): void {
        // 注册点击屏幕事件
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

        // 绑定碰撞开始/结束事件
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    disableControl() {
        // 禁用控制（游戏暂停或结束时调用）
        this._canControl = false;
        this.getComponent(RigidBody2D).sleep(); // 关闭物理模拟
        this.getComponent(Animation).enabled = false; // 停止动画
    }

    enableControl() {
        // 启用控制（游戏开始时调用）
        this.getComponent(RigidBody2D).wakeUp(); // 启用物理模拟
        this.getComponent(Animation).enabled = true; // 开启动画
        this._canControl = true;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 当小鸟碰到地面或管道时，游戏结束
        if (otherCollider.tag === Tags.LAND || otherCollider.tag === Tags.PIPE) {
            GameManager.inst().enterGameOver();
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 小鸟通过记分区域（PASS）时加分
        if (otherCollider.tag === Tags.PASS) {
            GameManager.inst().addScore();
        }
    }

    protected onDestroy(): void {
        // 清理事件监听
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onTouchStart() {
        if (!this._canControl) return;

        // 播放点击飞跃音效
        AudioMgr.inst.playOneShot(this.clickAudio);

        // 设置向上的线性速度（跳跃）
        this.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 10);

        // 小鸟角度上扬（视觉效果）
        this.node.angle = 30;
    }

    protected update(dt: number): void {
        if (!this._canControl) return;

        // 在空中逐渐下旋（模拟重力视觉）
        if (this.node.angle >= -30) {
            this.node.angle -= this.rotateSpeed * dt;
        }
    }
}
