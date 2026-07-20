# app/utils/logger.py
import datetime
import json

def log(node, state):
    print("\n" + "=" * 60)
    print(f"[{datetime.datetime.now()}] NODE: {node}")
    print("=" * 60)

    print(json.dumps(state, indent=2, ensure_ascii=False, default=str))
    print("=" * 60 + "\n")