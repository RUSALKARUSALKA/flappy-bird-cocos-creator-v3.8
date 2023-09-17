import { _decorator, Component, Node, Sprite, UITransform, v3 } from 'cc';
import { Global } from './Global';
const { ccclass, property } = _decorator;

@ccclass('GroundControl')
export class GroundControl extends Component {
    private g1: Node = null;
    private g2: Node = null;

    start() {
        this.g1 = this.node.getChildByName("Ground-001");
        this.g2 = this.node.getChildByName("Ground-002");
        this.g2.setPosition(v3(this.g1.position.x + this.g1.getComponent(UITransform).contentSize.width, this.g1.position.y, 0));
    }

    update(deltaTime: number) {
        if (!Global.gameStarted) {
            return;
        }
        this.g1.setPosition(v3(this.g1.position.x - 2, 0, 0));
        this.g2.setPosition(v3(this.g2.position.x - 2, 0, 0));
        
        let w = this.g1.getComponent(UITransform).contentSize.width;

        let left = this.g1.getPosition().x < this.g2.getPosition().x ? this.g1 : this.g2;
        let right = this.g1.getPosition().x < this.g2.getPosition().x ? this.g2 : this.g1;
        if (right.getPosition().x < 0)
        {
            left.setPosition(v3(right.position.x + w, 0, 0));
        }
    }
}

