import { _decorator, AudioClip, Component, Label, Node, Script } from 'cc';
import { Scroll } from './Scroll';
import { PipeManager } from './PipeManager';
import { GameData } from './GameData';
import { GameOverUI } from './UI/GameOverUI';
import { Bird } from './Bird';
import { AudioMgr } from './AudioMgr';

const { ccclass, property } = _decorator;
enum GameState {
    Ready,
    Playing,
    GameOver
}
@ccclass('GameManager')
export class GameManager extends Component {
    private static _inst:GameManager = null;
    public static inst() {
        return this._inst
    }
    @property
    moveSpeed:number = 100;

    @property(Scroll)
    land:Scroll = null;
    @property(Bird)
    bird:Bird = null;
    @property(Scroll)
    bg:Scroll = null;
    @property(PipeManager)
    pipeManager:PipeManager = null;

    @property(Node)
    gamingUI:Node = null;
    @property(Label)
    scoreLabel:Label = null;
    @property(GameOverUI)
    gameOverUI:GameOverUI = null;
    @property(AudioClip)
    bgAudio:AudioClip = null;
    @property(AudioClip)
    gameOverAudio:AudioClip = null;

    curState: GameState = GameState.Ready;

    protected onLoad(): void {
        GameManager._inst = this;
    }

    start() {
        this.enterReady();
        AudioMgr.inst.play(this.bgAudio);
    }

    enterReady() {
        this.curState = GameState.Ready;
        this.bird.disableControl();
        this.bg.disableMove();
        this.land.disableMove();
        this.pipeManager.disableSpawn();
        this.gamingUI.active = false;
        this.gameOverUI.hide();
        console.log("初始化")
    }

    enterPlaying() {
        //开始游戏
        this.curState = GameState.Playing;//修改游戏状态
        this.bird.enableControl();//小鸟开启控制
        this.bg.enableMove();
        this.land.enableMove();
        this.pipeManager.enableSpawn();
        this.gameOverUI.hide();
        this.gamingUI.active = true;
    }

    enterGameOver() {
        if(this.curState === GameState.GameOver) return;
        AudioMgr.inst.playOneShot(this.gameOverAudio);
        this.curState = GameState.GameOver
        this.bird.disableControl();
        this.bg.disableMove();
        this.land.disableMove();
        this.pipeManager.disableSpawn();
        this.gameOverUI.show(GameData.getScore(), GameData.getBestScore());
        GameData.saveScore();
    }

    addScore(count: number = 1) {
        if(this.curState === GameState.GameOver) return;
        GameData.addScore(count);
        this.scoreLabel.string = GameData.getScore().toString();
    }
}


