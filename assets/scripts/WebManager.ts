import { _decorator, Component, find, Node } from 'cc';
import { BirdControl } from './BirdControl';
const { ccclass, property } = _decorator;

@ccclass('WebManager')
export class WebManager extends Component {
    private socket: WebSocket = null;
    private serverURL: string = "ws://192.168.8.2:8000/";

    start() {
        this.initWebSocketConnection();
    }

    update(deltaTime: number) {
        
    }

    // 初始化 WebSocket 连接
    initWebSocketConnection() {
        this.socket = new WebSocket(this.serverURL);

        this.socket.onopen = (event) => {
            console.log('WebSocket connected!');
            // 可以在此处发送初始数据到服务器
            this.sendWebSocketData("login");
        };

        this.socket.onmessage = (event) => {
            console.log('Received message:', event.data);
            if (event.data.toString().indexOf("uuid") != -1) {
                console.log("登录成功");
                const webUuid = event.data.toString().split(" ").pop();
                console.log("uuid:", webUuid);
            }
            else if (event.data.toString().indexOf("jump") != -1) {
                console.log("收到跳跃指令");
                console.log(find("Canvas/Ground"));
                find("Canvas/Bird").getComponent(BirdControl).jump();
                // this.node.emit("jump");
            }
        };

        this.socket.onerror = function(event) {
            console.error("WebSocket 错误：", event);
            // 获取错误信息并显示
            console.log("错误类型:", event.type);
            console.log("WebSocket 对象:", event.target);
          };

        this.socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
        };
    }

    // 发送数据到服务器
    sendWebSocketData(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(data);
        }
        else {
            console.warn('WebSocket is not open: failed to send data', data);
        }
    }

    // 关闭 WebSocket 连接
    closeWebSocketConnection() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

// export let webManager = new WebManager();
// webManager.initWebSocketConnection();