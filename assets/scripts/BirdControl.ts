import { _decorator, Component, tween, Animation, Node, Input, Vec3, Color, input, EventTouch , EventMouse, RigidBody2D, v2, Collider2D, Contact2DType, IPhysics2DContact, find, Sprite, CCInteger} from 'cc';
import { AudioEngine } from './AudioEngine';
import {GameManager} from './GameManager';
import { ScoreDisplay } from './ScoreDisplay';
import { WebManager } from './WebManager';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export class BirdControl extends Component {
    @property(CCInteger)
    jumpForce: number = 5;

    @property(CCInteger)
    turnAngle: number = 45;

    private _rigidBody: RigidBody2D = null;
    public _uuid: string = null;

    start() {
        this._rigidBody = this.getComponent(RigidBody2D);
        let collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        this.getComponent(RigidBody2D).sleep();
    }

    update(deltaTime: number) {
        if (!GameManager.gameStarted) return;
        var velocityY = this._rigidBody.linearVelocity.y;
        var angleRate = Math.min(Math.max(velocityY, -this.jumpForce), this.jumpForce) / this.jumpForce;
        this.node.angle = -(angleRate) * -this.turnAngle;
    }

    jump() {
        this._rigidBody.linearVelocity = v2(0, this.jumpForce);
        this.getComponent(AudioEngine).play("wing");
    }

    onContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (GameManager.gameLost) {
            return;
        }
        switch (otherCollider.tag) {
            // case 0: // 忽略鸟和鸟的碰撞
            case 1:
            case 4:
            case 3:
                this.getComponent(AudioEngine).play("hit");
                GameManager.score = 0;
                // this.gameOver();
                break;
            case 2:
                this.getComponent(AudioEngine).play("score");
                GameManager.score++;
                find("Canvas/Score").getComponent(ScoreDisplay).refreshScoreDisplay();
                break;
            default:
                break;
        }
    }
}

