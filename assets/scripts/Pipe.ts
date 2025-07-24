import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Pipe')
export class Pipe extends Component {
    
    private moveSpeed: number;
    start() {
        this.moveSpeed = GameManager.inst().moveSpeed;
    }

    update(deltaTime: number) {
        this.node.setPosition(this.node.getPosition().add3f(-this.moveSpeed * deltaTime, 0, 0))
        if(this.node.getPosition().x < -900){
            this.node.destroy();
        }
    }
}


