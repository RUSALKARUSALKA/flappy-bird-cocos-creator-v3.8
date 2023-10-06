import { _decorator, Component, tween, instantiate, Animation, Node, Input, Vec3, Color, input, EventTouch , EventMouse, RigidBody2D, v2, Collider2D, Contact2DType, IPhysics2DContact, find, Sprite, CCInteger, Prefab} from 'cc';
import { AudioEngine } from './AudioEngine';
import { ScoreDisplay } from './ScoreDisplay';
import { WebManager } from './WebManager';
import { GameStartCounter } from './GameStartCounter';
import { BirdControl } from './BirdControl';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    public static gameStarted: boolean = false;
    public static gameLost: boolean = false;
    public static score: number = 0;
    public static countdownStart: boolean = false;
    public static countdownOver: boolean = false;
    private _webManager: WebManager = null;
    private myBird: Node = null;
    private otherBirds: {[key: string]: Node} = {};

    @property(Prefab)
    birdPrefab: Prefab = null;

    start() {
        // 注册交互事件，只有注册了之后触发才起作用
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this._webManager = find("Canvas/WebManager").getComponent(WebManager);
        this.myBird = find("Canvas/Bird");
    }

    onTouchStart(event: EventTouch) {
        if (GameManager.gameLost) {
            return;
        }
        // 游戏开始倒计时
        find("Canvas/GameStartCountdown").getComponent(GameStartCounter).startCountdown(()=>{
            this.startGame();
            this.myBird.getComponent(BirdControl).jump();
            this._webManager.sendWebSocketData("jump");
        });
        if (!GameManager.countdownOver) {
            return;
        }
        
        // this.startGame();
        this.myBird.getComponent(BirdControl).jump();
        this._webManager.sendWebSocketData("jump");
    }

    onKeyDown(event: KeyboardEvent) {
    }

    onMouseDown(event: EventMouse){
        this.onTouchStart(null);
        // if (GameManager.gameLost || !GameManager.countdownOver) {
        //     return;
        // }
        // this.startGame();
        // this.myBird.getComponent(BirdControl).jump();
        // this._webManager.sendWebSocketData("jump");
    }

    update(deltaTime: number) {
        
    }

    initMyBird(uuid: string) {
        this.myBird = instantiate(this.birdPrefab);
        console.log("构造我的小鸟成功");
        find("Canvas").addChild(this.myBird);
        this.myBird.getComponent(BirdControl)._uuid = uuid;
    }

    initOtherBird(uuid: string) {
        let otherBird = instantiate(this.birdPrefab);
        console.log("构造其他小鸟成功");
        console.log(`其它小鸟的名字 ${otherBird.name}`);
        otherBird.name = "Bird" + uuid;
        find("Canvas").addChild(otherBird);
        otherBird.getComponent(BirdControl)._uuid = uuid;
        // 其它玩家的小鸟是半透明的
        otherBird.getComponent(Sprite).color = new Color(255, 255, 255, 122);
        this.otherBirds[uuid] = otherBird;
    }

    removeOtherBird(uuid: string) {
        find("Canvas").removeChild(this.otherBirds[uuid]);
        delete this.otherBirds[uuid];
    }

    letBirdJump(uuid: string) {
        this.otherBirds[uuid].getComponent(BirdControl).jump();
    }

    startGame() {
        if (GameManager.gameStarted) {
            return;
        }
        
        if (!GameManager.countdownOver) {
            return;
        }

        GameManager.gameStarted = true;
        // 所有小鸟都开始播放飞翔动画
        this.myBird.getComponent(Animation).play();
        for (let key in this.otherBirds) {
            this.otherBirds[key].getComponent(Animation).play();
        }
        let title = find("Canvas/Title");
        let gameOverLabel = find("Canvas/GameOver");
        find("Canvas/Score").getComponent(ScoreDisplay).refreshScoreDisplay();
        if (GameManager.gameLost)
        {
            this.tweenDisappear(gameOverLabel, 0.2);
        }
        else
        {
            this.tweenDisappear(title, 0.5);
        }
        GameManager.gameLost = false;
        find("Canvas/GameOver/btn_PlayAgain").setPosition(new Vec3(0, -10000, 0));

        this.node.setPosition(new Vec3(0,0,0));
        // 手动设置位置之后需要重新唤醒刚体，否则在触发碰撞等物理事件之前刚体属性不起作用
        this.myBird.getComponent(RigidBody2D).wakeUp();
        for (let key in this.otherBirds) {
            this.otherBirds[key].getComponent(RigidBody2D).wakeUp();
        }
    }

    gameOver() {
        GameManager.gameStarted = false;
        GameManager.gameLost = true;
        let gameOverLabel = find("Canvas/GameOver");
        this.getComponent(AudioEngine).play("die");
        this.getComponent(Animation).stop();
        gameOverLabel.setPosition(new Vec3(0, 50, 0));
        // this.tweenDisappear(gameOverLabel, 0.5, true);
        gameOverLabel.getComponent(Sprite).color = new Color(255, 255, 255, 255);
        gameOverLabel.getChildByName("btn_PlayAgain").setPosition(new Vec3(0, 50, 0));
    }

    tweenDisappear(node: Node, duraion: number, div: boolean = false) {
        // ! v3.8有bug，不能用tween改变color
        // tween(find("Canvas/Title").getComponent(Sprite).color).to(1, new Color(0, 0, 0, 0)).start();
        tween(node).to(duraion, {}, {onUpdate: (target, ratio) => {
            // 透明度渐变由于上边说的那个bug的存在，只能放到update里手动实现
            let c = node.getComponent(Sprite).color;
            // 这个ratio表示缓动的当前进度，从0到1
            ratio = div ? ratio : 1 - ratio;
            c = new Color(c.r, c.g, c.b, 255 * ratio);
            node.getComponent(Sprite).color = c;
        }}).start(); 
    }

}

