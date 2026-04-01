#!/usr/bin/env python3
"""
RC Update Checker
=================
GitHub Atom フィードを監視して、新しいリリースがあればメールで通知するスクリプト。
postsoni.github.io の GitHub Actions で毎日自動実行される。

監視対象:
  - ExpressLRS (本体, Configurator, Backpack)
  - Rotorflight (Firmware, Configurator, Lua Scripts, Blackbox, Ethos Suite)
  - EdgeTX (本体, SDカード)
  - RadioMaster (ELRS Firmwares)
"""

import json
import os
import smtplib
import sys
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

import feedparser

# ============================================================
# 監視対象リポジトリ一覧
# ============================================================
FEEDS = {
    "ELRS 本体": "https://github.com/ExpressLRS/ExpressLRS/releases.atom",
    "ELRS Configurator": "https://github.com/ExpressLRS/ExpressLRS-Configurator/releases.atom",
    "ELRS Backpack": "https://github.com/ExpressLRS/Backpack/releases.atom",
    "Rotorflight Firmware": "https://github.com/rotorflight/rotorflight-firmware/releases.atom",
    "Rotorflight Configurator": "https://github.com/rotorflight/rotorflight-configurator/releases.atom",
    "Rotorflight Lua Scripts (EdgeTX)": "https://github.com/rotorflight/rotorflight-lua-scripts/releases.atom",
    "Rotorflight Blackbox": "https://github.com/rotorflight/rotorflight-blackbox/releases.atom",
    "Rotorflight Ethos Suite": "https://github.com/rotorflight/rotorflight-lua-ethos-suite/releases.atom",
    "EdgeTX 本体": "https://github.com/EdgeTX/edgetx/releases.atom",
    "EdgeTX SDカード": "https://github.com/EdgeTX/edgetx-sdcard/releases.atom",
    "RadioMaster ELRS FW": "https://github.com/Radiomaster-RC/RM-ELRS-All-Firmwares/releases.atom",
}

# ============================================================
# ファイルパス
# ============================================================
SCRIPT_DIR = Path(__file__).resolve().parent
DATA_FILE = SCRIPT_DIR.parent / "data" / "last_checked.json"

# ============================================================
# 状態管理
# ============================================================

def load_state() -> dict:
    """前回チェック時の状態を読み込む"""
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_state(state: dict) -> None:
    """チェック状態を保存する"""
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


# ============================================================
# フィードチェック
# ============================================================

def check_feeds(state: dict) -> tuple[dict, list[dict]]:
    """
    全フィードをチェックし、新しいリリースを検出する。

    Returns:
        (updated_state, new_releases)
    """
    new_releases = []
    updated_state = dict(state)

    for name, url in FEEDS.items():
        print(f"  チェック中: {name} ...", end=" ")
        try:
            feed = feedparser.parse(url)
            if not feed.entries:
                print("エントリなし")
                continue

            latest = feed.entries[0]
            latest_id = latest.get("id", latest.get("link", ""))
            latest_title = latest.get("title", "（タイトルなし）")
            latest_link = latest.get("link", url.replace(".atom", ""))
            latest_updated = latest.get("updated", "")

            # pre-release かどうかを判定（タイトルに含まれる場合）
            is_prerelease = any(
                tag in latest_title.lower()
                for tag in ["pre-release", "pre_release", "rc", "beta", "alpha", "snapshot", "nightly"]
            )

            prev_id = state.get(name, {}).get("id", "")

            if latest_id != prev_id:
                release_type = "Pre-release" if is_prerelease else "正式リリース"
                print(f"★ 新着! [{release_type}] {latest_title}")
                new_releases.append({
                    "name": name,
                    "title": latest_title,
                    "link": latest_link,
                    "updated": latest_updated,
                    "type": release_type,
                })
            else:
                print("変更なし")

            updated_state[name] = {
                "id": latest_id,
                "title": latest_title,
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }

        except Exception as e:
            print(f"エラー: {e}")
            continue

    return updated_state, new_releases


# ============================================================
# メール通知
# ============================================================

def send_email(new_releases: list[dict]) -> None:
    """新しいリリース情報をメールで通知する"""
    gmail_address = os.environ.get("GMAIL_ADDRESS")
    gmail_password = os.environ.get("GMAIL_APP_PASSWORD")

    if not gmail_address or not gmail_password:
        print("警告: Gmail の環境変数が設定されていません。メール送信をスキップします。")
        return

    # 件名
    count = len(new_releases)
    subject = f"🚀 RC アップデート通知: {count}件の新リリース ({datetime.now(timezone.utc).strftime('%Y-%m-%d')})"

    # 本文（テキスト版）
    text_body = "RC関連ソフトウェアの新しいリリースが検出されました。\n"
    text_body += "=" * 60 + "\n\n"

    for r in new_releases:
        text_body += f"【{r['name']}】\n"
        text_body += f"  バージョン: {r['title']}\n"
        text_body += f"  種別: {r['type']}\n"
        text_body += f"  リンク: {r['link']}\n"
        text_body += f"  更新日時: {r['updated']}\n"
        text_body += "-" * 40 + "\n\n"

    text_body += "このメールは postsoni.github.io の RC Update Checker により自動送信されました。\n"

    # 本文（HTML版）
    html_body = """
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #2d3748; border-bottom: 2px solid #4299e1; padding-bottom: 8px;">
        🚀 RC アップデート通知
    </h2>
    <p style="color: #4a5568;">RC関連ソフトウェアの新しいリリースが検出されました。</p>
    """

    for r in new_releases:
        badge_color = "#e53e3e" if r["type"] == "正式リリース" else "#ed8936"
        html_body += f"""
        <div style="background: #f7fafc; border-left: 4px solid #4299e1; padding: 12px 16px; margin: 12px 0; border-radius: 0 4px 4px 0;">
            <h3 style="margin: 0 0 8px 0; color: #2d3748;">{r['name']}</h3>
            <p style="margin: 4px 0;">
                <span style="background: {badge_color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                    {r['type']}
                </span>
            </p>
            <p style="margin: 4px 0; color: #4a5568;"><strong>バージョン:</strong> {r['title']}</p>
            <p style="margin: 4px 0; color: #4a5568;"><strong>更新日時:</strong> {r['updated']}</p>
            <p style="margin: 4px 0;">
                <a href="{r['link']}" style="color: #4299e1; text-decoration: none;">
                    📎 リリースページを開く →
                </a>
            </p>
        </div>
        """

    html_body += """
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
    <p style="color: #a0aec0; font-size: 12px;">
        このメールは postsoni.github.io の RC Update Checker により自動送信されました。
    </p>
    </body>
    </html>
    """

    # メール作成
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = gmail_address
    msg["To"] = gmail_address
    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    # 送信
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(gmail_address, gmail_password)
            server.send_message(msg)
        print(f"✅ メール送信成功: {gmail_address}")
    except Exception as e:
        print(f"❌ メール送信失敗: {e}")
        sys.exit(1)


# ============================================================
# メイン
# ============================================================

def main():
    print("=" * 60)
    print("RC Update Checker")
    print(f"実行日時: {datetime.now(timezone.utc).isoformat()}")
    print("=" * 60)
    print()

    # 状態読み込み
    state = load_state()
    print(f"前回の状態: {len(state)} リポジトリ分のデータあり")
    print()

    # フィードチェック
    print("--- フィードチェック開始 ---")
    updated_state, new_releases = check_feeds(state)
    print()

    # 結果表示
    if new_releases:
        print(f"🎉 {len(new_releases)} 件の新しいリリースを検出!")
        print()
        for r in new_releases:
            print(f"  ★ {r['name']}: {r['title']} ({r['type']})")
        print()

        # メール送信
        print("--- メール送信 ---")
        send_email(new_releases)
    else:
        print("✅ 新しいリリースはありません。")

    # 状態保存
    save_state(updated_state)
    print()
    print(f"状態を保存しました: {DATA_FILE}")
    print("完了!")


if __name__ == "__main__":
    main()
