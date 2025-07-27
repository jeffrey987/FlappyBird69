import { _decorator, AudioClip, Component, Label, Node, Script } from 'cc'; // 引入 Cocos Creator 引擎的核心模块
import { Scroll } from './Scroll'; // 滚动背景类
import { PipeManager } from './PipeManager'; // 管道管理器
import { GameData } from './GameData'; // 游戏数据管理类（用于计分等）
import { GameOverUI } from './UI/GameOverUI'; // 游戏结束界面控制类
import { Bird } from './Bird'; // 小鸟控制类
import { AudioMgr } from './AudioMgr'; // 音频播放管理类

const { ccclass, property } = _decorator; // 解构装饰器

enum GameState {
    Ready,     // 准备状态
    Playing,   // 游戏进行中
    GameOver   // 游戏结束
}

@ccclass('GameManager') // 声明为 Cocos 组件
export class GameManager extends Component {
    private static _inst: GameManager = null; // 静态单例实例
    public static inst() {
        return this._inst; // 获取单例
    }

    @property
    moveSpeed: number = 100; // 游戏中背景和地面的移动速度

    @property(Scroll)
    land: Scroll = null; // 地面滚动组件

    @property(Bird)
    bird: Bird = null; // 小鸟实例

    @property(Scroll)
    bg: Scroll = null; // 背景滚动组件

    @property(PipeManager)
    pipeManager: PipeManager = null; // 管道生成管理器

    @property(Node)
    gamingUI: Node = null; // 游戏界面节点

    @property(Label)
    scoreLabel: Label = null; // 显示分数的文本标签

    @property(GameOverUI)
    gameOverUI: GameOverUI = null; // 游戏结束UI组件

    @property(AudioClip)
    bgAudio: AudioClip = null; // 背景音乐

    @property(AudioClip)
    gameOverAudio: AudioClip = null; // 游戏结束音效

    curState: GameState = GameState.Ready; // 当前游戏状态，初始为准备状态

    protected onLoad(): void {
        GameManager._inst = this; // 在加载时设置单例
    }

    start() {
        this.enterReady(); // 进入准备状态
        AudioMgr.inst.play(this.bgAudio); // 播放背景音乐
    }

    enterReady() {
        this.curState = GameState.Ready; // 设置为准备状态
        this.bird.disableControl(); // 禁止鸟的控制
        this.bg.disableMove(); // 禁止背景移动
        this.land.disableMove(); // 禁止地面移动
        this.pipeManager.disableSpawn(); // 停止生成管道
        this.gamingUI.active = false; // 隐藏游戏中UI
        this.gameOverUI.hide(); // 隐藏结束界面
        console.log("初始化") // 打印日志
    }

    enterPlaying() {
        // 开始游戏
        this.curState = GameState.Playing; // 设置为游戏进行状态
        this.bird.enableControl(); // 启用鸟的控制
        this.bg.enableMove(); // 启用背景移动
        this.land.enableMove(); // 启用地面移动
        this.pipeManager.enableSpawn(); // 开启管道生成
        this.gameOverUI.hide(); // 隐藏结束界面
        this.gamingUI.active = true; // 显示游戏中UI
    }

    enterGameOver() {
        if (this.curState === GameState.GameOver) return; // 防止重复进入结束状态
        AudioMgr.inst.playOneShot(this.gameOverAudio); // 播放游戏结束音效
        this.curState = GameState.GameOver; // 设置为游戏结束状态
        this.bird.disableControl(); // 禁用鸟的控制
        this.bg.disableMove(); // 停止背景移动
        this.land.disableMove(); // 停止地面移动
        this.pipeManager.disableSpawn(); // 停止生成管道
        this.gameOverUI.show(GameData.getScore(), GameData.getBestScore()); // 显示游戏结束界面，传入当前和历史最高分
        GameData.saveScore(); // 保存当前得分
    }

    addScore(count: number = 1) {
        if (this.curState === GameState.GameOver) return; // 游戏结束不再加分
        GameData.addScore(count); // 增加分数
        this.scoreLabel.string = GameData.getScore().toString(); // 更新分数字符串
    }
}
