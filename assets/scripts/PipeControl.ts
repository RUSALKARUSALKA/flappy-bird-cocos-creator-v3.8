import { _decorator, Component, Node, CCFloat, instantiate, v3 } from 'cc';
import { Global } from './Global';
const { ccclass, property } = _decorator;

@ccclass('PipeControl')
export class PipeControl extends Component {
    private pipeUp: Node = null;
    private pipeDown: Node = null;

    @property(CCFloat)
    pipeMoveSpeed: number = -1;

    start() {
        this.pipeUp = this.node.getChildByName("PipeUp");
        this.pipeDown = this.node.getChildByName("PipeDown");
    }

    update(deltaTime: number) {
        if (!Global.gameStarted) {
            return;
        }
        this.pipeUp.setPosition(this.pipeUp.getPosition().add(v3(this.pipeMoveSpeed, 0, 0)));
        this.pipeDown.setPosition(this.pipeDown.getPosition().add(v3(this.pipeMoveSpeed, 0, 0)));
    }
}

