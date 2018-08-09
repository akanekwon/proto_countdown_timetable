# proto_countdown_timetable


電車の出発時刻をカウントダウンするWebアプリ


# 使い方

※ 簡易的なhttpサーバを立ち上げるため、Node.jsを事前にインストールする必要があります。
- Fork and clone  or Download this repositoty (https://github.com/akanekwon/proto_countdown_timetable) .

- cd proto_countdown_timetable
- npm install
- npm start


## 時刻表のフォーマット

ファイル形式はcsvで、1行目で路線種別、出発駅、行き先を設定し、2行目以降には[平日]、[土曜]、[日曜・祝日]、ごとに出発時刻を記入します。
出発時刻の行は3カラムで構成され、hh:mm形式の時刻、種別(各駅、快速等)、行き先 の順で記入します（時刻以外は省略可能）。


# TODO

- オフラインでも時刻表が見られるようアプリケーションキャッシュに対応する。
- 現状は次の電車の出発時刻しか分からないため、時刻表自体を表示できるようにする。


# 謝辞

祝日判定に[osamutake/japanese-holidays-js]( https://github.com/osamutake/japanese-holidays-js )を使わせてもらっています。
