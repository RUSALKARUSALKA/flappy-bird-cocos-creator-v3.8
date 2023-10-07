from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import uuid

app = FastAPI()

# @app.get("/")
# async def get():
#     return HTMLResponse(html)

uuid_socket_map = dict()


@app.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_text()
        # 有玩家断开连接
        except WebSocketDisconnect:
            left_uuid = ""
            for u in uuid_socket_map:
                if uuid_socket_map[u] is websocket:
                    uuid_socket_map.pop(u)
                    left_uuid = u
                    print(f"玩家离开游戏 {left_uuid}")
                    if len(uuid_socket_map) == 0:
                        print("所有玩家均已离开游戏")
                    break
            # 通知其它玩家
            for u in uuid_socket_map:
                await uuid_socket_map[u].send_text(f"leave 玩家离开游戏 {left_uuid}")
            break
        print(f"receive data: {data}")
        # 处理玩家登录
        if data == "login":
            uid = str(uuid.uuid4())
            uuid_socket_map[uid] = websocket
            await websocket.send_text(f"login success with uuid {uid}")
            # 第一个加入游戏的人是房主
            if len(uuid_socket_map) == 1:
                await websocket.send_text(f"You are the host!")
            # 把登录信息广播给其它玩家
            print(f"全部的socket {uuid_socket_map}")
            for u in uuid_socket_map:
                if uuid_socket_map[u] is websocket:
                    continue
                await uuid_socket_map[u].send_text(f"welcome 让我们欢迎新玩家加入游戏！ {uid}")
            continue
        elif data == "query_current_players":
            await websocket.send_text(f"当前在线玩家数量 {len(uuid_socket_map)}")
            other_uuids = [u for u in uuid_socket_map if uuid_socket_map[u] is not websocket]
            t = "query_current_players " + ",".join(other_uuids)
            await websocket.send_text(t)
        # 处理其它需要广播的消息，例如玩家移动，玩家攻击，开始游戏等
        else:
            current_op_uuid = ""
            for u in uuid_socket_map:
                if uuid_socket_map[u] is websocket:
                    current_op_uuid = u
            for u in uuid_socket_map:
                if uuid_socket_map[u] is websocket:
                    continue
                await uuid_socket_map[u].send_text(data + " " + current_op_uuid)

        
