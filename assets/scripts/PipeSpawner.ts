import { _decorator, Component, Node, Prefab, instantiate, v3, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { Global } from './Global';

@ccclass('PipeSpawner')
export class PipeSpawner extends Component {

    @property(Prefab)
    pipePrefab: Prefab = null;

    @property(Number)
    maxPipeSpace: number = 200;

    private spawned: boolean = false;

    // private pipePairs: Node[] = [];

    start() {
        // this.SpawnPipePair();
    }

    update(deltaTime: number) {
        if (!Global.gameStarted) {
            return;
        }
        if (!this.spawned) {
            this.spawned = true;
            setTimeout(() => {
                this.SpawnPipePair();
                this.spawned = false;
            }, 1400); 
        }
    }

    SpawnPipePair() {
        let p = instantiate(this.pipePrefab);
        p.setPosition(v3(300, 0, 0))
        let pipeUp = p.getChildByName("PipeUp");
        let pipeDown = p.getChildByName("PipeDown");
        let h = pipeUp.getComponent(UITransform).contentSize.height;

        let upTop = 400;
        let space = 100;
        pipeUp.setPosition(v3(0, 0 + h / 2 + h/2 * Math.random() - 0.5, 0));
        pipeDown.setPosition(v3(0, pipeUp.position.y - h - space, 0));
        this.node.addChild(p);
    }
}

