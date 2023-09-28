import { _decorator, Component, Node, SpriteFrame, Sprite, Vec3, native, sys} from 'cc';

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

    startCountdown() {
        function sleep(ms) {
            console.log("进入sleep");
            let ff = (tt => {
                console.log("进入ff");
                return setTimeout(tt, ms)});
            return new Promise(ff);
        }

        async function setScoreSpriteFrame(spriteFrame, duration) {
            console.log("进入这个弔函数")
            this.getComponent(Sprite).spriteFrame = spriteFrame;
            await sleep(duration);
        }

        async function startGame() {
            setScoreSpriteFrame.call(this, this.scoreSpriteFrames[3], 1000);
            setScoreSpriteFrame.call(this, this.scoreSpriteFrames[2], 1000);
            setScoreSpriteFrame.call(this, this.scoreSpriteFrames[1], 1000);
            console.log("游戏开始");
            this.getComponent(Sprite).spriteFrame = null;
        }
        console.log(startGame.bind(this)());
        console.log("游戏开始倒计时");
    }
}

