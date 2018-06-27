//var tables = 1;
var table = [];
var JapaneseHolidays = JapaneseHolidays;

/** */
class TimeTable {
  constructor(src) {
    this.src = src;
    this.tt = [];
    this.weekday = 0;
    this.saturday = 0;
    this.sunday_holiday = 0;

    // 時刻表データを読み込む
    const rowData = this.loadTimeTable(this.src).split(String.fromCharCode(10));
    for(let i = 0, end = rowData.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      this.tt[i] = rowData[i].split(',');
    }

    // 時刻表データの見出し行を検索
    for(let i = 0, end1 = this.tt.length, asc1 = 0 <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
      //
      if(this.tt[i][0] === '[平日]') {
        this.weekday = i + 1;
      }
      if(this.tt[i][0] === '[土曜]') {
        this.saturday = i + 1;
      }
      if(this.tt[i][0] === '[日曜・祝日]') {
        this.sunday_holiday = i + 1;
      }
    }
  }

  /** */
  getRoute() {
    return this.tt[0][0];
  }

  /** */
  getStation() {
    return this.tt[0][1];
  }

  /** */
  getDesc() {
    return this.tt[0][2];
  }

  // 時刻表データをXHRで読み込む
  loadTimeTable(src) {
    const Xhr = new XMLHttpRequest();
    Xhr.open('GET', src, false);
    Xhr.send(null);
    return Xhr.responseText;
  }

  // timeをhh:mm形式に変換して返す（flagがあれば時刻に24足す）
  hhmm(time, flag) {
    const h = time.getHours();
    const m = time.getMinutes();
    if(flag) {
      return String(h + 24) + ":" + String(m + 100).substring(1);
    }
    return String(h + 100).substring(1) + ":" + String(m + 100).substring(1);
  }

  // now以降の最初の時刻等を返す（flagがあれば前日の時刻表を検索）
  nexttime(now, flag) {
    let i;
    let day;
    let asc, end;
    const time = this.hhmm(now, flag);
    const next = new Date(now);

    if(flag) {
      day = (now.getDay() + 6) % 7;
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if(JapaneseHolidays.isHoliday(new Date(yesterday.getFullYear(), yesterday.getMonth() + 1, yesterday.getDate()), true)) {
        day = 0;
      }
    } else {
      day = now.getDay();
      if(JapaneseHolidays.isHoliday(new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()), true)) {
        day = 0;
      }
    }

    if((0 < day) && (day < 6)) {
      i = this.weekday;
    }
    if(day === 6) {
      i = this.saturday;
    }
    if(day === 0) {
      i = this.sunday_holiday;
    }

    for(i = i, end = this.tt.length, asc = i <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      if(this.tt[i][0] > time) {
        break;
      }
    }

    // 次の時刻が見つからなかった場合の処理
    if((!this.tt[i]) || (this.tt[i][0][0] === '[')) {
      if(flag) {
        return false;
      } else {
        // 翌日の時刻表を検索
        next.setDate(next.getDate() + 1);
        next.setHours(0, 0, 0, 0);
        return this.nexttime(next, flag);
      }
    }

    // tt[i][0] が24時を超えていた場合は翌日の日時に修正
    let hh;
    if(this.tt[i][0].substring(0, 2) > '23') {
      hh = parseInt(this.tt[i][0].substring(0, 2), 10) - 24;
      if(!flag) {
        next.setDate(next.getDate() + 1);
      }
    } else {
      hh = parseInt(this.tt[i][0].substring(0, 2), 10);
    }
    const mm = parseInt(this.tt[i][0].substring(3, 5), 10);
    next.setHours(hh, mm, 0, 0);

    // 次の時刻およびtt[i]を返す

    return {
      time: next,
      str: this.tt[i]
    };
  }
};

/** */
const computeDuration = function(ms) {
  const h = String(Math.floor(ms / 3600000));
  const m = String(Math.floor((ms - (h * 3600000)) / 60000) + 100).substring(1);
  const s = String(Math.round((ms - (h * 3600000) - (m * 60000)) / 1000) + 100).substring(1);
  return `${h}:${m}:${s}`;
};

/** */
const dayOfTheWeek = function(day) {
  const week = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];

  if(JapaneseHolidays.isHoliday(new Date(day.getFullYear(), day.getMonth() + 1, day.getDate()), true)) {
    return '(祝)';
  } else {
    return week[day.getDay()];
  }
};

const updateTime = function(...arg) {
  const now = new Date();
  // document.getElementById("now").innerHTML = `現在時刻：${now.toLocaleString()}${dayOfTheWeek(now)}`;

  let nt = table[0].nexttime(now, true, arg[0]);
  if(!nt) {
    nt = table[0].nexttime(now, false, arg[0]);
  }


  //str[0]:時刻 str[1]:種別 str[2]:行先 str[3]:備考
  document.getElementById('next').innerHTML = `${nt.str[0]}発 ${nt.str[3]}`;
  document.getElementById('dir').innerHTML = `${nt.str[2]} ${nt.str[1]}`;

  let duration = nt.time - now;
  if(duration >= 0) {
    const elem = document.getElementById('dur');
    elem.innerHTML = `あと ${computeDuration(duration)}`;

    elem.style.color = (duration < 60000) && 'red' ||
      (duration < 180000) && 'orange' || 'black';
  }

  return setTimeout((() => updateTime(arg[0])), 1000);
};


window.addEventListener('DOMContentLoaded', function() {
  const s = document.getElementById('select');

  s.addEventListener('change', function(e) {

    table[0] = new TimeTable(e.target.value);

    document.getElementById('route').innerHTML = table[0].getRoute();
    document.getElementById('station').innerHTML = table[0].getStation();
    document.getElementById('desc').innerHTML = table[0].getDesc();
    updateTime();
  });
});
