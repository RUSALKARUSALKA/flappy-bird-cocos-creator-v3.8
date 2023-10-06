import { _decorator, Component, find, Node } from 'cc';
import { BirdControl } from './BirdControl';
import { GameManager } from './GameManager';
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
            // 查询当前已经在房间中的小鸟，为它们创建实例
            this.sendWebSocketData("query_current_players");
        };

        this.socket.onmessage = (event) => {
            console.log('Received message:', event.data);
            if (event.data.toString().indexOf("uuid") != -1) {
                console.log("登录成功");
                const webUuid = event.data.toString().split(" ").pop();
                console.log("uuid:", webUuid);
                // 登录成功，创建一个小鸟
                // 在Canvas中添加一个小鸟node
                find("Canvas/GameManager").getComponent(GameManager).initMyBird(webUuid);
                console.log(`创建我的小鸟成功 ${webUuid}`);
            }
            else if (event.data.toString().indexOf("jump") != -1) {
                const webUuid = event.data.toString().split(" ").pop();
                console.log(`收到玩家 ${webUuid} 的跳跃指令`);
                find("Canvas/GameManager").getComponent(GameManager).letBirdJump(webUuid);
            }
            else if (event.data.toString().indexOf("query_current_players") != -1) {
                console.log("查询当前玩家");
                // 查询当前已经在房间中的小鸟，为它们创建实例
                const players = event.data.toString().split(" ").pop().split(",");
                console.log("当前房间中已有的玩家：", players);
                for (let i = 0; i < players.length; i++) {
                    if (players[i] != "") {
                        find("Canvas/GameManager").getComponent(GameManager).initOtherBird(players[i]);
                    }
                }
            }
            else if (event.data.toString().indexOf("welcome") != -1) {
                console.log("有新玩家加入");
                const newPlayer = event.data.toString().split(" ").pop();
                console.log("newPlayer:", newPlayer);
                find("Canvas/GameManager").getComponent(GameManager).initOtherBird(newPlayer);
            }
            else if (event.data.toString().indexOf("leave") != -1) {
                const leftPlayer = event.data.toString().split(" ").pop();
                console.log(`玩家离开了 ${leftPlayer}`);
                find("Canvas/GameManager").getComponent(GameManager).removeOtherBird(leftPlayer);
            }
            else if (event.data.toString().indexOf("host") != -1) {
                console.log("你是房主，好屌哦~单击开始游戏！");
                find("Canvas/GameManager").getComponent(GameManager).isHost = true;
            }
            else if (event.data.toString().indexOf("start") != -1) {
                console.log("房主发起了游戏开始的指令！做好准备！");
                find("Canvas/GameManager").getComponent(GameManager).startGame();
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