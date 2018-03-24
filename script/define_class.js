// console.log(require('util').inherits.toString()); より
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}
// 定数
var CONST_TARGET_15 = "15";
var CONST_TARGET_16 = "16";
var CONST_TARGET_17 = "17";
var CONST_TARGET_18 = "18";
var CONST_TARGET_19 = "19";
var CONST_TARGET_20 = "20";
var CONST_TARGET_BULL = "21";
var CONST_PLAYER1 = "PLAYER1";
var CONST_PLAYER2 = "PLAYER2";

// ============================
// データクラス
// ============================
var Score = function () {
  this.Score = 0;
  this.Position = {};
  this.Position[CONST_TARGET_15] = 0;
  this.Position[CONST_TARGET_16] = 0;
  this.Position[CONST_TARGET_17] = 0;
  this.Position[CONST_TARGET_18] = 0;
  this.Position[CONST_TARGET_19] = 0;
  this.Position[CONST_TARGET_20] = 0;
  this.Position[CONST_TARGET_BULL] = 0;
}
var HitData = function () {
  this.TargetArea = "";
  this.HitArea = "";
  this.Mark = 0;
}

// ============================
// CPUベースクラス
// ============================
var BaseCpu = function (_player) {
  this.Player = _player;
}
BaseCpu.prototype.throwDarts = function(target, mpr) {
}

// ============================
// rating1クラス
// ============================
var Rating1 = function (_player) {
  BaseCpu.call(this, _player);
}
// 継承
inherits(Rating1, BaseCpu);
// ダーツを投げる（オーバーライド）
Rating1.prototype.throwDarts = function(target, mpr) {
  // this.point.ThrowCount++;
  var random = getRandomInt(1, 100);
  var target = this.getTarget_();
  var mark = 0;
  if (random < 40) {
    mark = 0;
  } else if (random < 80) {
    mark = 1;
  } else if (random < 90) {
    mark = 2;
  } else {
    mark = 3;
  }
  var hit = new HitData();
  hit.TargetArea = target;
  hit.HitArea = target;
  hit.Mark = mark;
  
  // 記録
  board.Hit(target, mark, this.Player);
  
	return hit;
}

// ターゲット決定
Rating1.prototype.getTarget_ = function() {
  switch(true) {
    case this.point.Position[CONST_TARGET_20] < 3:
      return CONST_TARGET_20;
    case this.point.Position[CONST_TARGET_19] < 3:
      return CONST_TARGET_19;
    case this.point.Position[CONST_TARGET_18] < 3:
      return CONST_TARGET_18;
    case this.point.Position[CONST_TARGET_17] < 3:
      return CONST_TARGET_17;
    case this.point.Position[CONST_TARGET_16] < 3:
      return CONST_TARGET_16;
    case this.point.Position[CONST_TARGET_15] < 3:
      return CONST_TARGET_15;
    case this.point.Position[CONST_TARGET_BULL] < 3:
      return CONST_TARGET_BULL;
  }
}

// ============================
// CricketBoardクラス
// ============================
var CricketBoard = function () {
  this.Player1Score = new Score();
  this.Player2Score = new Score();
  this.ThrowCount = 0;
  this.Round = 0;
}
CricketBoard.prototype =  {
  Hit : function (target, mark, player) {
    var selfPoint = null;
    var enemyPoint = null;
    if (player == CONST_PLAYER1) {
      selfPoint = this.player1Score;
      enemyPoint = this.player2Score;
    } else if(player == CONST_PLAYER2) {
      selfPoint = this.player2Score;
      enemyPoint = this.player1Score;
    }
    
    // 投げる回数アップ
    this.ThrowCount++;
    
    // マーク付け足し
    var mrk = selfPoint.Position[target] + mark;
    var ovrMark = 0;
    if (mrk > 3) {
      ovrMark = mrk - 3;
      mrk = 3;
    }
    selfPoint.Position[target] = mrk;
    if (ovrMark == 0) {
      // 取得ポイントなし
      return;
    }
    if (enemyPoint.Position[target] > 3) {
      // 相手が既にクローズ済
      return;
    }

    var point = 0;
    switch(target) {
      case CONST_TARGET_20:
         point = mrk * 20;
      case CONST_TARGET_19:
         point = mrk * 19;
      case CONST_TARGET_18:
         point = mrk * 18;
      case CONST_TARGET_17:
         point = mrk * 17;
      case CONST_TARGET_16:
         point = mrk * 16;
      case CONST_TARGET_15:
         point = mrk * 15;
      case CONST_TARGET_BULL:
         point = mrk * 25;
    }
    selfPoint.Score = point;
  },
  NextRound : function() {
    // TODO turnchangeの概念が必要
    this.Round++;
    this.throwCount = 0;
    return this.point.Round;
  }
}
