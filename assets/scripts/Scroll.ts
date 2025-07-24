import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Scroll')
export class Scroll extends Component {
    @property(Node)
    target1: Node = null;
    @property(Node)
    target2: Node = null;
    _canMove: boolean = false;
    private scrollSpeed: number;
    start() {
        this.scrollSpeed = GameManager.inst().moveSpeed;
    }
    enableMove() {
        this._canMove = true;
    }
    disableMove() {
        this._canMove = false;
    }
    update(deltaTime: number) {
        if(!this._canMove) return;
        const moveDistance = -this.scrollSpeed * deltaTime;
        this.target1.setPosition(this.target1.getPosition().add3f(moveDistance, 0, 0));
        this.target2.setPosition(this.target2.getPosition().add3f(moveDistance, 0, 0));
        if(this.target1.getPosition().x < -730){
            this.target1.setPosition(this.target2.getPosition().add3f(728, 0, 0));
        }
        if(this.target2.getPosition().x < -730){
            this.target2.setPosition(this.target1.getPosition().add3f(728, 0, 0));
        }
    }
}


