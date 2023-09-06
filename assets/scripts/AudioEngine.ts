import { _decorator, Component, Node, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioEngine')
export class AudioEngine extends Component {
    @property(AudioClip)
    wing: AudioClip = null;

    @property(AudioClip)
    hit: AudioClip = null;

    @property(AudioClip)
    die: AudioClip = null;

    @property(AudioClip)
    score: AudioClip = null;

    private audioSouce: AudioSource = null;

    protected onLoad(): void {
        this.audioSouce = this.getComponent(AudioSource);
    }

    play(name) {
        this.audioSouce.playOneShot(this[name], 1);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

