import { _decorator, find, Component, Node, SpriteFrame, Sprite, Vec3, native, sys} from 'cc';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('GameStartCounter')
export class GameStartCounter extends Component {
    @property([SpriteFrame])
    scoreSpriteFrames: SpriteFrame[] = [];

    start() {
        this.getComponent(Sprite).spriteFrame = null;
    }

    update(deltaTime: number) {
        
    }

    // 异步倒计时
    startCountdown() {
        if (GameManager.countdownStart || GameManager.gameStarted) {
            return;
        }
        find("Canvas/GameStartCountdown").getComponent(Sprite).spriteFrame = this.scoreSpriteFrames[3];
        GameManager.countdownStart = true;
        const t = (sec) => new Promise(
            (r) => {
                setTimeout(() => {
                    find("Canvas/GameStartCountdown").getComponent(Sprite).spriteFrame = this.scoreSpriteFrames[sec];
                    if (sec == 0) {
                        find("Canvas/GameStartCountdown").getComponent(Sprite).spriteFrame = null;
                        GameManager.countdownOver = true;
                        GameManager.countdownStart = false;
                    }
                    r(888);
                }, 1000);
            }
        );
        return t(2).then((r) => t(1)).then((r) => t(0)).catch((e) => console.log(e));
    }
}

