-function (w) {
  var doc = w.document;
  var fn = {};
  fn.audio = function () {
    var ctl = document.createElement("audio");
    var ret = {};
    ret.ended = true;
    ret.load = function (url) {
      this.playing = false;
      this.ended = true;
      ctl.src = url;
    };
    ret.play = function () {
      if (this.ended) {
        ctl.load();
      }
      ctl.play();
    };
    ret.pause = function () {
      ctl.pause();
    };
    ret.playing = false;
    ret.status = function () {
      return { current: ctl.currentTime, duration: ctl.duration };
    };
    ret.onended = function () { };
    ret.onplay = function () { };
    ret.onpause = function () { };
    ret.onupdate = function () { };
    ctl.addEventListener('play', function (e) {
      console.log("audio.playing");
      ret.ended = false;
      ret.playing = true;
      if (typeof (ret.onplay) == "function") {
        ret.onplay();
      }
    }, false);
    ctl.addEventListener('pause', function (e) {
      console.log("audio.paused");
      ret.ended = false;
      ret.playing = false;
      if (typeof (ret.onpause) == "function") {
        ret.onpause();
      }
    }, false);
    ctl.addEventListener('ended', function (e) {
      console.log("audio.ended");
      ret.ended = true;
      ret.playing = false;
      if (typeof (ret.onended) == "function") {
        ret.onended();
      }
    }, false);
    ctl.addEventListener('error', function (e) {
      console.log("audio.error");
      ret.ended = true;
      ret.playing = false;
      if (typeof (ret.onended) == "function") {
        ret.onended();
      }
    }, false);
    ctl.addEventListener('timeupdate', function (e) {
      if(typeof(ret.onupdate)=="function"){
        ret.onupdate();
      }
    }, false);
    function events(name) {
      ctl.addEventListener(name, function (e) {
        console.log("audio.%s", name);
        console.log(e);
      }, false);
    }
    function events(name) { };
    events('loadstart');
    events('progress');
    events('suspend');
    events('abort');
    //events('error');
    events('stalled');
    //events('play');
    //events('pause');
    events('loadedmetadata');
    events('loadeddata');
    events('waiting');
    events('playing');
    events('canplay');
    events('canplaythrough');
    events('seeking');
    events('seeked');
    //events('timeupdate');
    //events('ended');
    events('ratechange');
    events('ratechange');
    events('durationchange');
    events('volumechange');
    return ret;
  };
  fn.fire = function (o, evt) {
    var evt = o.events[evt];
    if (typeof (evt) == "function") {
      evt();
    }
  }
  w.Audio = function(){
    return fn.audio();
  }
}(window);
