// [todo] 
// [b] ボードにハイパーリンクを設定。

// =====================================
// アレンジ計算
// =====================================
// 設定
var masterOutFlag = false;
var doubleOutFlag = true;
var singleOutFlag = false;
var fatBullFlag = true;
var displayThrowDarts = false;
// 変数
var singleBullPoint = 50;
var doubleBullPoint = 50;
// 定数
var HIT_AREA_SINGLE = 1;
var HIT_AREA_DOUBLE = 2;
var HIT_AREA_TRIPLE = 3;
var BURST = "BURST";
var OUT = "OUT!!";
var NO_OUT = "NO OUT";
// 定数 - 色
var COLOR_BURST = "gray";
var COLOR_OUT = "palegreen";
var COLOR_ARRANGE_EVEN = "yellow";
var COLOR_ARRANGE_ODD = "lightpink";
var COLOR_ARRANGE_3 = "white";
var COLOR_NONE = "lightgrey";
// マップ
var ARRANGE_MAP = [32, 40, 16, 8, 50, 38, 24, 36, 28, 22, 20, 12, 10, 6, 4, 2, 34, 30, 26, 18, 14];

/** 
 * 初期処理
 */
$( function() {
	// ボード描画
	canvas_init();
	// アレンジ表作成
	createArrangeTable();

	// URL文字列取得
	var param = getParam();
	// Pulldown作成
	createPulldown(param.point);

	if (!fatBullFlag) {
		singleBullPoint = 25;
	}
    for (var i = 1; i <= 20; i++) {
		// アレンジ表、ボード表示
		displayPoint(param.point, i);
	}
	// アレンジ表、ボード表示（ブル）
	displayPointForBull(param.point, singleBullPoint);
	// 再描画
	$('canvas').drawLayers();

	$("#point").change(onChangePoint);

	var title = "01 ";
	if (fatBullFlag) {
		title = title + "ファットブル";
	} else {
		title = title + "セパブル";
	}
	if (singleOutFlag) {
		title = title + "シングルアウト";
	} else if (doubleOutFlag) {
		title = title + "ダブルアウト";
	} else if (masterOutFlag) {
		title = title + "マスターアウト";
	}
	title = title + " - アレンジ表";
	$("#title").text(title);

});

/**
 * アレンジ表作成
 */
function createArrangeTable() {
	var num = "";
	var tagTD = "";
	var tagTR = "";
	for (var i = 1; i<=10; i++) {
		num = NUMBER_MAP[i];
		tagTD = '<th>' + num + '</th>';
		tagTD = tagTD + '<td id="' + num + 'S"></td>';
		tagTD = tagTD + '<td id="' + num + 'D"></td>';
		tagTD = tagTD + '<td id="' + num + 'T"></td>';
		
		num = NUMBER_MAP[i + 10];
		tagTD = tagTD + '<th>' + num + '</th>';
		tagTD = tagTD + '<td id="' + num + 'S"></td>';
		tagTD = tagTD + '<td id="' + num + 'D"></td>';
		tagTD = tagTD + '<td id="' + num + 'T"></td>';

		tagTR = '<tr>'+tagTD+'</tr>';
		$("#arrange_table").append(tagTR);
	}
	num = NUMBER_MAP[i];
	tagTD = '<th>ー</th>';
	tagTD = tagTD + '<td>ー</td>';
	tagTD = tagTD + '<td>ー</td>';
	tagTD = tagTD + '<td>ー</td>';
		
	num = NUMBER_MAP[i + 10];
	tagTD = tagTD + '<th>BULL</th>';
	tagTD = tagTD + '<td id="SB"></td>';
	tagTD = tagTD + '<td id="DB"></td>';
	tagTD = tagTD + '<td>ー</td>';
	tagTR = '<tr>'+tagTD+'</tr>';
	$("#arrange_table").append(tagTR);	
}

/**
 * カラー取得S
 * @param {取得点数} arr 
 */
function getColor(arr) {
	var arrange2honIdx;
	var arrange2hon;
	var arrange3hon;
	if (displayThrowDarts) {
		arrange2hon = 2;
		arrange3hon = 3;
		arrange2honIdx = 1;
	} else {
		arrange2hon = 1;
		arrange3hon = 2;
		arrange2honIdx = 0;
	}
	if (arr[arrange2honIdx] == BURST) {
		return COLOR_BURST;
	}
	if (arr[arrange2honIdx] == OUT){
		return COLOR_OUT;
	}
	if (arr[arrange2honIdx] == NO_OUT) {
		return COLOR_NONE;
	}
	if (arr.length == arrange2hon){
		if (isEvenNumber(arr[arrange2honIdx])) {
			// 偶数
			return COLOR_ARRANGE_EVEN;
		} else {
			// 奇数
			return COLOR_ARRANGE_ODD;
		}
	}
	if (arr.length == arrange3hon) {
		return COLOR_ARRANGE_3;
	}
	return "";
}

/**
 * 点数表示
 * @param {残点数} zanPoint 
 * @param {HitNumber} hitNumber 
 */
function displayPoint(zanPoint, hitNumber) {
	// シングルヒット時の計算
	var arr = calc(zanPoint, hitNumber * 1, HIT_AREA_SINGLE);
	var displayNumber = getDisplayNumber(hitNumber, HIT_AREA_SINGLE);
	if (displayThrowDarts) {
		arr.unshift(displayNumber);
	}
	var color = getColor(arr);
	$("#" + displayNumber).text(getDisplayText(arr));
	$("#" + displayNumber).css({backgroundColor: color});
	$('canvas').getLayer(hitNumber + "IS").fillStyle = color;
	$('canvas').getLayer(hitNumber + "OS").fillStyle = color;

	// ダブルヒット時の計算
	arr = calc(zanPoint, hitNumber * 2, HIT_AREA_DOUBLE);
	displayNumber = getDisplayNumber(hitNumber, HIT_AREA_DOUBLE);
	if (displayThrowDarts) {
		arr.unshift(displayNumber);
	}
	color = getColor(arr);
	$("#" + displayNumber).text(getDisplayText(arr));
	$("#" + displayNumber).css({backgroundColor: color});
	$('canvas').getLayer(displayNumber).fillStyle = color;

	// トリプル計算時の計算
	arr = calc(zanPoint, hitNumber * 3, HIT_AREA_TRIPLE);
	displayNumber = getDisplayNumber(hitNumber, HIT_AREA_TRIPLE);
	if (displayThrowDarts) {
		arr.unshift(displayNumber);
	}
	color = getColor(arr);
	$("#" + displayNumber).text(getDisplayText(arr));
	$("#" + displayNumber).css({backgroundColor: color});
	$('canvas').getLayer(displayNumber).fillStyle = color;
}

/**
 * 点数表示(bull)
 * @param {残点数} zanPoint 
 * @param {*} hitNumber 
 */
function displayPointForBull(zanPoint, hitNumber) {
	// シングルブル時の計算
	var arr = calc(zanPoint, hitNumber * 1, HIT_AREA_SINGLE);
	displayNumber = getDisplayNumber(hitNumber, HIT_AREA_SINGLE);
	if (displayThrowDarts) {
		arr.unshift(displayNumber);
	}
	var color = getColor(arr);
	$("#" + displayNumber).text(getDisplayText(arr));
	$("#" + displayNumber).css({backgroundColor: color});
	$('canvas').getLayer(displayNumber).fillStyle = getColor(arr);
	if (fatBullFlag) {
		displayNumber = "DB";
		$("#" + displayNumber).text(getDisplayText(arr));
		$("#" + displayNumber).css({backgroundColor: color});
		$('canvas').getLayer(displayNumber).fillStyle = getColor(arr);
	} else {
		// ダブルブルヒット時の計算
		arr = calc(zanPoint, hitNumber * 2, HIT_AREA_DOUBLE);
		displayNumber = getDisplayNumber(hitNumber, HIT_AREA_DOUBLE);
		if (displayThrowDarts) {
			arr.unshift(displayNumber);
		}	
		color = getColor(arr);
		$("#" + displayNumber).text(getDisplayText(arr));
		$("#" + displayNumber).css({backgroundColor: color});
		$('canvas').getLayer(displayNumber).fillStyle = getColor(arr);
	}
}

/**
 * 計算処理
 * @param {残点数} zanPoint 
 * @param {取得点数} hitPoint 
 * @param {シングル/ダブル/トリプル} hitArea 
 */
function calc(zanPoint, hitPoint, hitArea) {
	// ヒットした後の残点数を計算
	var zan = zanPoint - hitPoint;

	// ==============================
	// バースト
	// ==============================
	if (zan < 0) {
		return [BURST];
	}
	if (zan == 1 && !singleOutFlag) {
		// シングルアウト出来ない場合は、1以下はバースト
		return [BURST];
	}

	// ==============================
	// アウト(1本)
	// ==============================
	if ( zan == 0 ) {
		if (masterOutFlag && hitArea == HIT_AREA_TRIPLE) {
			return [OUT];
		}
		if (doubleOutFlag) {
			if (fatBullFlag && hitPoint == 50) {
				return [OUT];
			}
			if (hitArea == HIT_AREA_DOUBLE) {
				return [OUT];
			}
		}
		if (singleOutFlag && hitArea == HIT_AREA_SINGLE) {
			return [OUT];
		}
		// バースト
		return [BURST];
	}
	
	// ==============================
	// アレンジ(2本アウト)
	// 【考え方】
	// 次のラウンドで少ない本数でアウトできる上がり目を優先
	// ==============================
	var amari = "";
	if (masterOutFlag && zan % 3 == 0) {
		amari = zan / 3;
		if (amari <= 20) {
			return [getDisplayNumber(amari, HIT_AREA_TRIPLE)];
		}
	}
	if (doubleOutFlag && zan % 2 == 0) {
		amari = zan / 2;
		if (fatBullFlag && amari == 25) {
			// ファットブルの場合
			return [getDisplayNumber(50, HIT_AREA_DOUBLE)];
		}
		if (amari <= 20 || amari == 25) {
			return [getDisplayNumber(amari, HIT_AREA_DOUBLE)];
		}
	}
	if (singleOutFlag) {
		amari = zan;
		if (!fatBullFlag && amari == 25) {
			// セパブルの場合
			return [getDisplayNumber(amari, HIT_AREA_SINGLE)];
		}
		if (amari <= 20 || amari == 50) {
			return [getDisplayNumber(amari, HIT_AREA_SINGLE)];
		}
	}
	// ==============================
	// アレンジ(3本アウト)
	// 【考え方】
	// 次のラウンドで少ない本数でアウトできる上がり目を優先
	// ==============================
	if (masterOutFlag) {
		// todo
	}
	if (doubleOutFlag) {
		// 2本目シングルアウト精査
		var map = createArrangeMap(HIT_AREA_SINGLE);
		var arr = darts3Arrange(zan, map, HIT_AREA_SINGLE);
		if (arr != null) {
			return arr;
		}
		map = createArrangeMap(HIT_AREA_DOUBLE);
		arr = darts3Arrange(zan, map, HIT_AREA_DOUBLE);
		if (arr != null) {
			return arr;
		}
		map = createArrangeMap(HIT_AREA_TRIPLE);
		arr = darts3Arrange(zan, map, HIT_AREA_TRIPLE);
		if (arr != null) {
			return arr;
		}
	}
	if (singleOutFlag) {
		// todo
	}

	return [NO_OUT];
}

/**
 * アレンジ表 表示文字列
 * @param {ヒットナンバー} hitNumber 
 * @param {ヒット後の残ポイント} hit_zanpoint 
 */
function getDisplayText(arr) {
	var idx = 1;
	if (!displayThrowDarts) {
		idx = 0;
	}
	if (arr.length <= idx) {
		return "";
	}
	if (arr[idx] == OUT || arr[idx] == BURST || arr[idx] == NO_OUT) {
		return arr[idx];
	}
	if (!Array.isArray(arr)) {
		return arr;
	}
	return arr.join("→");
}

/**
 * 偶数判定
 * @param {ヒット後の残ポイント} hit_zanpoint 
 */
function isEvenNumber(hit_zanpoint) {
	if (hit_zanpoint == "SB" || hit_zanpoint == "DB") {
		if (fatBullFlag) {
			return true;
		}
		// セパブルの場合、DBは偶数だが、難しいため、奇数と判定。
		return false;
	}
	var point = hit_zanpoint.replace("D", "");
	point = point.replace("T", "");
	point = point.replace("S", "");
	if (point % 2 != 0) {
		// 奇数
		return false;
	}
	// 偶数
	return true;
}

/**
 * ３本使用時のアレンジ計算
 * @param {2本目数字配列} numbers 
 */
function darts3Arrange(zan, numbers, hitArea) {
	var darts2point, darts3point;
	for (var idx in ARRANGE_MAP) {
		var arrVal = ARRANGE_MAP[idx];
		if (zan < arrVal) {
			continue;
		}
		darts2point = zan - arrVal;
		if ($.inArray(darts2point, numbers) < 0) {
			continue;
		}
		if (hitArea == HIT_AREA_DOUBLE) {
			darts2point = darts2point / 2;
		}
		if (hitArea == HIT_AREA_TRIPLE) {
			darts2point = darts2point / 3;
		}
		if (fatBullFlag && arrVal == 50) {
			darts3point = arrVal;
		} else {
			darts3point = arrVal / 2;
		}
		darts2point = getDisplayNumber(darts2point, hitArea);
		darts3point = getDisplayNumber(darts3point, HIT_AREA_DOUBLE);
		return [darts2point, darts3point];
	}
	return null;
}
/**
 * アレンジマップ作成
 * @param {*} hitArea 
 */
function createArrangeMap(hitArea) {
	var arr = [];
	if (hitArea == HIT_AREA_SINGLE) {
		for (var i = 1; i<=20; i++) {
			arr.push(i);
		}
		if (!fatBullFlag) {
			arr.push(25);
		}
		arr.push(50);
	}
	if (hitArea == HIT_AREA_DOUBLE) {
		for (var i = 1; i<=20; i++) {
			arr.push(i*2);
		}
		arr.push(50);
	}
	if (hitArea == HIT_AREA_TRIPLE) {
		for (var i = 1; i<=20; i++) {
			arr.push(i*3);
		}
	}
	return arr;
}

/**
 * 表示用ナンバー取得
 * @param {1} hitNumber 
 * @param {*} hitArea 
 */
function getDisplayNumber(hitNumber, hitArea) {
	if (hitArea == HIT_AREA_SINGLE) {
		if (hitNumber == singleBullPoint) {
			return "SB";
		}
		if (hitNumber == doubleBullPoint) {
			return "DB";
		}
		return hitNumber + "S";
	}
	if (hitArea == HIT_AREA_DOUBLE) {
		if (fatBullFlag && hitNumber == 50) {
			return "SB";
		}
		if (!fatBullFlag && hitNumber == 25) {
			return "DB";
		}
		return hitNumber + "D";
	}
	if (hitArea == HIT_AREA_TRIPLE) {
		return hitNumber + "T";
	}
}

function createPulldown(point) {
	
    var $select = $('#point');

	for (var i = 1; i <= 180; i++) {
		var $option = $('<option>')
        .val(i)
        .text(i)
        .prop('selected', point == i);
	    $select.append($option);
	}

}

function onChangePoint() {
	window.location.href = getUrl() + "?point=" + $(this).val();
}

function getParam() {
	var param = getUrlVars();
	if (param.point == undefined) {
		param.point = 32;
	}
	if (param.tryCount == undefined) {
		param.tryCount = 3;
	}
	if (param.try1 == undefined) {
		param.try1 = "";
	}
	if (param.try2 == undefined) {
		param.try2 = "";
	}
	if (param.try3 == undefined) {
		param.try3 = "";
	}
	return param;
}