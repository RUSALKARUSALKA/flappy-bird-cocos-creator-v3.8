import { _decorator, Component, Node, Prefab, instantiate, v3, UITransform, CCInteger } from 'cc';
const { ccclass, property } = _decorator;
import { GameManager } from './GameManager';

@ccclass('PipeSpawner')
export class PipeSpawner extends Component {

    @property(Prefab)
    pipePrefab: Prefab = null;

    @property(CCInteger)
    maxPipeSpace: number = 200;

    private spawned: boolean = false;
    private heightPositions: number[] = [0.2, 0.3, 0.1, 0.5, 0.6, 0.4, 0.7, 0.9, 0.6];
    private currentHeightIndex: number = 0;

    start() {
        console.log(this.heightPositions);
    }

    update(deltaTime: number) {
        if (!GameManager.gameStarted) {
            return;
        }
        if (!this.spawned) {
            this.spawned = true;
            setTimeout(() => {
                // 为了图省事，这里用一个固定的伪随机序列表示管道的高度位置
                this.SpawnPipePair(this.heightPositions[this.currentHeightIndex]);
                this.currentHeightIndex = (this.currentHeightIndex + 1) % this.heightPositions.length;
                this.spawned = false;
            }, 1400); 
        }
    }

    SpawnPipePair(pos) {
        let p = instantiate(this.pipePrefab);
        p.setPosition(v3(300, 0, 0))
        let pipeUp = p.getChildByName("PipeUp");
        let pipeDown = p.getChildByName("PipeDown");
        let h = pipeUp.getComponent(UITransform).contentSize.height;

        let upTop = 400;
        let space = 100;
        // pipeUp.setPosition(v3(0, 0 + h / 2 + h/2 * Math.random() - 0.5, 0));
        pipeUp.setPosition(v3(0, 0 + h / 2 + h/2 * pos - 0.5, 0));
        pipeDown.setPosition(v3(0, pipeUp.position.y - h - space, 0));
        this.node.addChild(p);
        // 保持队列最大长度为3
        if (this.node.children.length > 3) {
            this.node.removeChild(this.node.children[0]);
        }
    }
}

