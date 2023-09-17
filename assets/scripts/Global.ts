import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Global')
export class Global extends Component {
    public static gameStarted: boolean = false;
    public static gameLost: boolean = false;
    public static score: number = 0;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

