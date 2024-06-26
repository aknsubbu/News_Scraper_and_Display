from typing import Union
from fastapi import FastAPI, WebSocket
import json
import asyncio

app = FastAPI()

@app.get("/pingServer")
def pingServer():
    return {"message": "The server is online"}

seen_articles = set()

async def read_json_continuously(websocket: WebSocket):
    file_path = 'data.json'
    while True:
        try:
            with open(file_path, 'r') as f:
                lines = f.readlines()
                for line in lines:
                    if line.startswith('//'):
                        continue
                    article = json.loads(line)
                    article_url = article['url']
                    if article_url not in seen_articles:
                        seen_articles.add(article_url)
                        await websocket.send_json(article)
                        print(f"New article sent: {article['title']}")
        except Exception as e:
            print(e)
        await asyncio.sleep(5)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        await read_json_continuously(websocket)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await websocket.close()