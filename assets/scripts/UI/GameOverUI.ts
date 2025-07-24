import { _decorator, Component, director, Label, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property(Label)
    curScoreLabel:Label = null;
    @property(Label)
    bestScoreLabel:Label = null;
    @property(Node)
    newSprite:Node = null;
    @property(Node)
    medal:Node = null;
    @property([SpriteFrame])
    medalFrames:SpriteFrame[] = []
    show(curScore: number, bestScore: number) {
        this.node.active = true;
        this.curScoreLabel.string = curScore.toString();
        this.bestScoreLabel.string = bestScore.toString();
        if(curScore >= bestScore){
            this.newSprite.active = true;
        }else{
            this.newSprite.active = false;
        }
        if(curScore >= 30){
            this.medal.getComponent(Sprite).spriteFrame = this.medalFrames[3]
        }else if(curScore >= 20){
            this.medal.getComponent(Sprite).spriteFrame = this.medalFrames[2]
        }else if(curScore >= 10){
            this.medal.getComponent(Sprite).spriteFrame = this.medalFrames[1]
        }else{
            this.medal.getComponent(Sprite).spriteFrame = this.medalFrames[0]
        }
    }
    hide() {
        this.node.active = false;
    }

    onReplayClick() {
        director.loadScene(director.getScene().name);
    }
}


