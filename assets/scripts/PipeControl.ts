import { _decorator, Component, Node, instantiate, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PipeControl')
export class PipeControl extends Component {
    private pipeUp: Node = null;
    private pipeDown: Node = null;

    @property(Number)
    pipeMoveSpeed: number = -1;

    start() {
        this.pipeUp = this.node.getChildByName("PipeUp");
        this.pipeDown = this.node.getChildByName("PipeDown");
    }

    update(deltaTime: number) {
        this.pipeUp.setPosition(this.pipeUp.getPosition().add(v3(this.pipeMoveSpeed, 0, 0)));
        this.pipeDown.setPosition(this.pipeDown.getPosition().add(v3(this.pipeMoveSpeed, 0, 0)));
    }
}
