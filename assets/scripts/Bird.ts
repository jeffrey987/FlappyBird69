import { _decorator, Animation, AudioClip, Collider2D, Component, Contact2DType, Input, input, IPhysics2DContact, RigidBody2D, Vec2 } from 'cc';
import { Tags } from './Tags';
import { GameManager } from './GameManager';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {
    @property
    rotateSpeed: number = 60;
    @property(AudioClip)
    clickAudio:AudioClip = null;
    _canControl: boolean = false;
    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    disableControl() {
        this._canControl = false;
        this.getComponent(RigidBody2D).sleep();
        this.getComponent(Animation).enabled = false;
    }

    enableControl() {
        this.getComponent(RigidBody2D).wakeUp();
        this.getComponent(Animation).enabled = true;
        this._canControl = true;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(otherCollider.tag === Tags.LAND || otherCollider.tag === Tags.PIPE){
            GameManager.inst().enterGameOver();
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(otherCollider.tag === Tags.PASS){
            GameManager.inst().addScore();
        }
    }

    protected onDestroy(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    onTouchStart() {
        if(!this._canControl) return;
        AudioMgr.inst.playOneShot(this.clickAudio)
        this.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 10)
        this.node.angle = 30;
    }
    protected update(dt: number): void {
        if(!this._canControl) return;
        if(this.node.angle >= -30){
            this.node.angle -= this.rotateSpeed * dt;
        }
    }
}


