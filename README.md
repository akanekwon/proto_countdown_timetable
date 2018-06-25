# proto_countdown_timetable
====

電車の出発時刻をカウントダウンするWebアプリ


# 使い方

- git clone git@github.com:akanekwon/proto_countdown_timetable.git

- access to index.html


## 時刻表のフォーマット

ファイル形式はcsvで、1行目で路線種別、出発駅、行き先を設定し、2行目以降には[平日]、[土曜]、[日曜・祝日]、ごとに出発時刻を記入します。
出発時刻の行は4カラムで構成され、hh:mm形式の時刻、種別(各駅、快速等)、行き先、備考 の順で記入します（時刻以外は省略可能）。


# TODO

- オフラインでも時刻表が見られるようアプリケーションキャッシュに対応する
- 現状は次の電車の出発時刻しか分からないため、時刻表自体を表示できるようにする
- 表示する路線や路線数をアプリ上で変更可能にする
