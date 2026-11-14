/* ============================================================
   SALON LUMEN（見本）  更新用ファイル（制作者が設定します）
   お店の人は このファイルではなく「更新シート（Googleスプレッドシート）」を直します。
   sheetUrl が空のときは 下の内容がそのまま表示されます。
   ============================================================ */
window.SITE = {
  name: "SALON LUMEN（見本）",
  tel: "000-0000-0000",                       // ダミー
  reserveUrl: "https://example.com/reserve",  // ネット予約ページのURL（ダミー）
  lineUrl: "https://line.me/R/ti/p/@dummy-id",
  reviewUrl: "https://g.page/r/DUMMY-REVIEW-ID/review",
  sheetUrl: "",                               // 公開CSVのURL（READMEの手順で設定）
  address: "東京都○○区1-2-3 見本ビル3F（ダミー）",
  access: "○○駅 徒歩3分（ダミー）",
  firstOff: 0.1,                              // 初回の割引（0.1 = 10%OFF）

  hours: [
    { day: "月・水・木・金", time: "10:00〜20:00" },
    { day: "土・日・祝",     time: "9:00〜19:00" },
    { day: "火",             time: "定休日" }
  ],

  news: [
    { date: "2026-10-22", title: "11月の予約受付を開始しました", body: "人気の土日は お早めにどうぞ。" },
    { date: "2026-10-08", title: "秋のトリートメントキャンペーン", body: "カラーと同時の方は トリートメントを1,000円引きにします。" },
    { date: "2026-09-20", title: "スタイリスト募集のお知らせ", body: "見学も歓迎です。" }
  ],

  // price は数字だけ。time の「分」の数字は 診断ツールの所要時間にも使われます。
  prices: [
    { name: "カット",           time: "60分",  price: 5500,  note: "シャンプー・ブロー込み" },
    { name: "カラー",           time: "90分",  price: 7700,  note: "" },
    { name: "パーマ",           time: "120分", price: 9900,  note: "" },
    { name: "トリートメント",   time: "30分",  price: 4400,  note: "人気No.1" },
    { name: "縮毛矯正",         time: "150分", price: 16500, note: "くせ毛の方に" },
    { name: "ヘッドスパ",       time: "30分",  price: 3300,  note: "" }
  ]
};
