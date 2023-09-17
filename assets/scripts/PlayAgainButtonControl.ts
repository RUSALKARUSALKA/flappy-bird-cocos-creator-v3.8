import { _decorator, Component, Node, find } from 'cc';
import { Global } from './Global';
import { BirdControl } from './BirdControl';
const { ccclass, property } = _decorator;

@ccclass('PlayAgainButtonControl')
export class PlayAgainButtonControl extends Component {
    start() {

    }

    update(deltaTime: number) {
    }

    onBtnPlayAgainClick() {
        find("Canvas/PipeLayer").removeAllChildren();
        find("Canvas/Bird").getComponent(BirdControl).startGame();
    }
}

