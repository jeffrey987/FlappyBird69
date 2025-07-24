import { _decorator, Component, input, Input, Node } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameReadyUI')
export class GameReadyUI extends Component {
    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart() {
        GameManager.inst().enterPlaying();
        this.node.active = false;
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
}


