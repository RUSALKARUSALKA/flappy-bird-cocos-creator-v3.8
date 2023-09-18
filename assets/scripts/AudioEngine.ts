import { _decorator, Component, Node, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioEngine')
export class AudioEngine extends Component {
    // 注意，音频文件在苹果手机上似乎无法加载.ogg格式，否则在加载过程中控制台会报 failed to load Web Audio null 错误。.wav格式可以正常加载。
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

