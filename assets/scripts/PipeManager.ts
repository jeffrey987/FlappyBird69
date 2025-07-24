import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc';
import { Pipe } from './Pipe';
const { ccclass, property } = _decorator;

@ccclass('PipeManager')
export class PipeManager extends Component {
    @property(Prefab)
    pipePrefab: Prefab = null;

    @property
    spawnRate: number = 2;

    private timer: number = 2;
    private _canSpawn: boolean = false;

    update(deltaTime: number) {
        if(!this._canSpawn) return;
        this.timer += deltaTime;
        if(this.timer >= this.spawnRate){
            this.timer = 0;
            const pipeInst = instantiate(this.pipePrefab);
            this.node.addChild(pipeInst);
            const randomH = math.randomRangeInt(-100, 100);
            pipeInst.setWorldPosition(this.node.getWorldPosition().add3f(0, randomH, 0));
        }        
    }

    enableSpawn() {
        this._canSpawn = true;
    }

    disableSpawn() {
        this._canSpawn = false;
        this.node.children.forEach(pipe => {
            pipe.getComponent(Pipe).enabled = false;
        })
    }
}


