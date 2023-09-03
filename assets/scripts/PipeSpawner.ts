import { _decorator, Component, Node, Prefab, instantiate, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PipeSpawner')
export class PipeSpawner extends Component {

    @property(Prefab)
    public pipePrefab: Prefab = null;

    @property(Number)
    maxPipeSpace: number = 200;

    // private pipePairs: Node[] = [];

    start() {
        this.SpawnPipePair();
    }

    update(deltaTime: number) {
        
    }

    SpawnPipePair() {
        let p = instantiate(this.pipePrefab);
        p.setPosition(v3(50, 0, 0))
        let pipeUp = p.getChildByName("PipeUp");
        let pipeDown = p.getChildByName("PipeDown");
        console.log(pipeUp.getPosition());
        console.log(pipeDown.getPosition());
        pipeUp.setPosition(pipeUp.getPosition().add(v3(0, -300, 0)));
        pipeDown.setPosition(pipeDown.getPosition().add(v3(0, 500, 0)));
        this.node.addChild(p);
    }
}

