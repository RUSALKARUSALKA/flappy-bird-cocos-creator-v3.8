import { _decorator, Component, Node, Input, input, EventTouch , EventMouse, RigidBody2D, v2, Collider2D, Contact2DType, IPhysics2DContact} from 'cc';
import { AudioEngine } from './AudioEngine';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export class BirdControl extends Component {
    private _rigidBody: RigidBody2D = null;

    start() {
        this._rigidBody = this.getComponent(RigidBody2D);
        let collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        // 注册交互事件，只有注册了之后触发才起作用
        // input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        console.log("小鸟start完成");
    }

    update(deltaTime: number) {
        
        // console.log("123");
    }

    onTouchStart(event: EventTouch) {
        console.log("aaaa");
    }

    onKeyDown(event: KeyboardEvent) {
        console.log(999);
    }

    onMouseDown(event: EventMouse){
        console.log("jump");
        this.jump();
    }

    jump() {
        this._rigidBody.linearVelocity = v2(0, 5);
        this.getComponent(AudioEngine).play("wing");
    }

    onContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log(`hit ${otherCollider}`);
    }
}

