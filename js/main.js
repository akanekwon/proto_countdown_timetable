(function() {
  var computeDuration;

  this.TimeTable = class TimeTable {
    constructor(src1) {
      var i, j, k, ref, ref1, rowData;
      this.src = src1;
      this.tt = [];
      this.weekday = 0;
      this.saturday = 0;
      this.sunday_holiday = 0;
      // 時刻表データを読み込む
      rowData = this.loadTimeTable(this.src).split(String.fromCharCode(10));
      for (i = j = 0, ref = rowData.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        this.tt[i] = rowData[i].split(',');
      }
// 時刻表データの見出し行を検索
      for (i = k = 0, ref1 = this.tt.length; (0 <= ref1 ? k < ref1 : k > ref1); i = 0 <= ref1 ? ++k : --k) {
        if (this.tt[i][0] === '[平日]') {
          this.weekday = i + 1;
        }
        if (this.tt[i][0] === '[土曜]') {
          this.saturday = i + 1;
        }
        if (this.tt[i][0] === '[日曜・祝日]') {
          this.sunday_holiday = i + 1;
        }
      }
    }

    getRoute() {
      return this.tt[0][0];
    }

    getStation() {
      return this.tt[0][1];
    }

    getDesc() {
      return this.tt[0][2];
    }

    // 時刻表データをXHRで読み込む
    loadTimeTable(src) {
      var Xhr;
      Xhr = new XMLHttpRequest();
      Xhr.open('GET', src, false);
      Xhr.send(null);
      return Xhr.responseText;
    }

    // timeをhh:mm形式に変換して返す（flagがあれば時刻に24足す）
    hhmm(time, flag) {
      var h, m;
      h = time.getHours();
      m = time.getMinutes();
      if (flag) {
        return String(h + 24) + ':' + String(m + 100).substring(1);
      }
      return String(h + 100).substring(1) + ':' + String(m + 100).substring(1);
    }

    // now以降の最初の時刻等を返す（flagがあれば前日の時刻表を検索）
    nexttime(now, flag) {
      var day, hh, i, j, mm, next, ref, ref1, time, yesterday;
      time = this.hhmm(now, flag);
      next = new Date(now);
      if (flag) {
        day = (now.getDay() + 6) % 7;
        yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (isHoliday(yesterday.getFullYear(), yesterday.getMonth() + 1, yesterday.getDate(), true)) {
          day = 0;
        }
      } else {
        day = now.getDay();
        if (isHoliday(now.getFullYear(), now.getMonth() + 1, now.getDate(), true)) {
          day = 0;
        }
      }
      if (0 < day && day < 6) {
        i = this.weekday;
      }
      if (day === 6) {
        i = this.saturday;
      }
      if (day === 0) {
        i = this.sunday_holiday;
      }
      for (i = j = ref = i, ref1 = this.tt.length; (ref <= ref1 ? j < ref1 : j > ref1); i = ref <= ref1 ? ++j : --j) {
        if (this.tt[i][0] > time) {
          break;
        }
      }
      // 次の時刻が見つからなかった場合の処理
      if ((!this.tt[i]) || (this.tt[i][0][0] === '[')) {
        if (flag) {
          return false;
        } else {
          // 翌日の時刻表を検索
          next.setDate(next.getDate() + 1);
          next.setHours(0, 0, 0, 0);
          return this.nexttime(next, flag);
        }
      }
      // @tt[i][0] が24時を超えていた場合は翌日の日時に修正
      if (this.tt[i][0].substring(0, 2) > '23') {
        hh = parseInt(this.tt[i][0].substring(0, 2), 10) - 24;
        if (!flag) {
          next.setDate(next.getDate() + 1);
        }
      } else {
        hh = parseInt(this.tt[i][0].substring(0, 2), 10);
      }
      mm = parseInt(this.tt[i][0].substring(3, 5), 10);
      next.setHours(hh, mm, 0, 0);
      return {
        // 次の時刻およびtt[i]を返す
        time: next,
        str: this.tt[i]
      };
    }

  };

  computeDuration = function(ms) {
    var h, m, s;
    h = String(Math.floor(ms / 3600000));
    m = String(Math.floor((ms - h * 3600000) / 60000) + 100).substring(1);
    s = String(Math.floor((ms - h * 3600000 - m * 60000) / 1000) + 100).substring(1);
    return h + ':' + m + ':' + s;
  };

  this.timetest = function() {
    var duration, elem, i, j, now, nt, ref;
    now = new Date();
    if (offset < -60 || 60 < offset) {
      alert('offset range error');
    }
    now.setMinutes(now.getMinutes() + (offset % 60));
    //時刻調整用
    //now.setTime(now.getTime() + 2*24*60*60*1000 + 8*60*60*1000 + 17*60*1000)
    document.getElementById('now').innerHTML = '出発時刻：' + now.toLocaleString();
    for (i = j = 0, ref = tables; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      nt = this.table[i].nexttime(now, true);
      if (!nt) {
        nt = this.table[i].nexttime(now, false);
      }
      //str[0]:時刻 str[1]:種別 str[2]:行先 str[3]:備考
      document.getElementById('next' + String(i + 1)).innerHTML = nt.str[0] + '発 ' + nt.str[3];
      document.getElementById('dir' + String(i + 1)).innerHTML = nt.str[2] + ' ' + nt.str[1];
      duration = nt.time - now;
      if (duration >= 0) {
        elem = document.getElementById('dur' + String(i + 1));
        elem.innerHTML = 'あと' + computeDuration(duration);
        elem.style.color = (function() {
          switch (false) {
            case !(duration < 60000):
              return 'red';
            case !(duration < 180000):
              return 'orange';
            default:
              return 'black';
          }
        })();
      }
    }
    return setTimeout((function() {
      return timetest();
    }), 1000);
  };

}).call(this);
