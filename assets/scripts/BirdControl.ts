import { _decorator, Component, tween, Animation, Node, Input, Vec3, Color, input, EventTouch , EventMouse, RigidBody2D, v2, Collider2D, Contact2DType, IPhysics2DContact, find, Sprite, CCInteger} from 'cc';
import { AudioEngine } from './AudioEngine';
import {Global} from './Global';
import { ScoreDisplay } from './ScoreDisplay';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export class BirdControl extends Component {
    @property(CCInteger)
    jumpForce: number = 5;

    @property(CCInteger)
    turnAngle: number = 45;

    private _rigidBody: RigidBody2D = null;

    start() {
        this._rigidBody = this.getComponent(RigidBody2D);
        let collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        // 注册交互事件，只有注册了之后触发才起作用
        // input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.getComponent(RigidBody2D).sleep();
    }

    update(deltaTime: number) {
        if (!Global.gameStarted) return;
        var velocityY = this._rigidBody.linearVelocity.y;
        var angleRate = Math.min(Math.max(velocityY, -this.jumpForce), this.jumpForce) / this.jumpForce;
        this.node.angle = -(angleRate) * -this.turnAngle;
    }

    onTouchStart(event: EventTouch) {
    }

    onKeyDown(event: KeyboardEvent) {
    }

    onMouseDown(event: EventMouse){
        if (Global.gameLost) {
            return;
        }
        this.startGame();
        this.jump();
    }

    startGame() {
        if (Global.gameStarted) {
            return;
        }
        Global.gameStarted = true;
        this.getComponent(Animation).play();
        let title = find("Canvas/Title");
        let gameOverLabel = find("Canvas/GameOver");
        find("Canvas/Score").getComponent(ScoreDisplay).refreshScoreDisplay();
        if (Global.gameLost)
        {
            this.tweenDisappear(gameOverLabel, 0.2);
        }
        else
        {
            this.tweenDisappear(title, 0.5);
        }
        Global.gameLost = false;
        find("Canvas/GameOver/btn_PlayAgain").setPosition(new Vec3(0, -10000, 0));

        this.node.setPosition(new Vec3(0,0,0));
        // 手动设置位置之后需要重新唤醒刚体，否则在触发碰撞等物理事件之前刚体属性不起作用
        this.getComponent(RigidBody2D).wakeUp();
    }

    gameOver() {
        Global.gameStarted = false;
        Global.gameLost = true;
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

    jump() {
        this._rigidBody.linearVelocity = v2(0, this.jumpForce);
        this.getComponent(AudioEngine).play("wing");
    }

    onContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log(`hit ${otherCollider.tag}`);
        if (Global.gameLost) {
            return;
        }
        switch (otherCollider.tag) {
            case 0:
            case 1:
            case 3:
                this.getComponent(AudioEngine).play("hit");
                Global.score = 0;
                this.gameOver();
                break;
            case 2:
                this.getComponent(AudioEngine).play("score");
                Global.score++;
                find("Canvas/Score").getComponent(ScoreDisplay).refreshScoreDisplay();
                break;
            default:
                break;
        }
    }
}

