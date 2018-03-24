// [todo] 
// [b] 3本のダーツを使用すること。
// [b] ボードにハイパーリンクを設定。
// [b] ボードに数字を表示。
// [b] ソース管理
// [c] ファットブル、セパブル設定の追加
// [c] シングル、ダブル、トリプルアウト設定の追加

// =====================================
// アレンジ計算
// =====================================
// 定数
var HIT_AREA_SINGLE = 1;
var HIT_AREA_DOUBLE = 2;
var HIT_AREA_TRIPLE = 3;
var BURST = "BURST";
var OUT = "OUT!!";
// 定数 - 色
var COLOR_BURST = "gray";
var COLOR_OUT = "palegreen";
var COLOR_ARRANGE_EVEN = "yellow";
var COLOR_ARRANGE_ODD = "lightpink";
var COLOR_NONE = "white";

$( function() {
	// ボード描画
	canvas_init();
	// アレンジ表作成
	createArrangeTable();

	var param = getUrlVars();
	$("#point").text(param.point);

        for (var i = 1; i <= 20; i++) {
		displayPoint(param.point, i);
	}
	displayPointForBull(param.point, 25);
	// 再描画
	$('canvas').drawLayers();
});

function calc(zanPoint, hitPoint, hitArea) {
	var zan = zanPoint - hitPoint;
	var masterOutFlag = false;
	var doubleOutFlag = true;
	var singleOutFlag = false;
	// ==============================
	// バースト
	// ==============================
	if (zan < 0) {
		return BURST;
	}
	if (zan == 1 && !singleOutFlag) {
		// シングルアウト出来ない場合は、1以下はバースト
		return BURST;
	}

	// ==============================
	// アウト
	// ==============================
	if ( zan == 0 ) {
		if (masterOutFlag && hitArea == HIT_AREA_TRIPLE) {
			return OUT;
		}
		if (doubleOutFlag && hitArea == HIT_AREA_DOUBLE) {
			return OUT;
		}
		if (singleOutFlag && hitArea == HIT_AREA_SINGLE) {
			return OUT;
		}
		// バースト
		return BURST;
	}
	
	// ==============================
	// アレンジ
	// 【考え方】
	// 次のラウンドで少ない本数でアウトできる上がり目を優先
	// ==============================
	var amari = "";
	if (masterOutFlag && zan % 3 == 0) {
		amari = zan / 3;
		if (amari <= 20) {
			return amari + "T";
		}
	}
	if (doubleOutFlag && zan % 2 == 0) {
		amari = zan / 2;
		if (amari == 25) {
			// todo:セパブル、ファットブルの考慮
			// todo:MasterOutの考慮
			return "DB";
		}
		if (amari <= 20) {
			return amari + "D";
		}
	}
	if (singleOutFlag) {
		amari = zan;
		if (amari == 25 || amari == 50) {
			// todo:セパブル、ファットブルの考慮
			return "SB";
		}
		if (amari <= 20) {
			return amari + "S";
		}
	}
	return "";
}

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

function getColor(hit_zanpoint) {
	if (hit_zanpoint == BURST) {
		return COLOR_BURST;
	}
	if (hit_zanpoint == OUT){
		return COLOR_OUT;
	}
	if (hit_zanpoint != ""){
		if (isEvenNumber(hit_zanpoint)) {
			// 偶数
			return COLOR_ARRANGE_EVEN;
		} else {
			// 奇数
			return COLOR_ARRANGE_ODD;
		}
	}
	return COLOR_NONE;
}

function displayPoint(point, hitNumber) {
	var hit_zanpoint = calc(point, hitNumber * 1, HIT_AREA_SINGLE);
	var color = getColor(hit_zanpoint);
	$("#" + hitNumber + "S").text(getDisplayText(hitNumber + "S", hit_zanpoint));
	$("#" + hitNumber + "S").css({backgroundColor: color});
	$('canvas').getLayer(hitNumber + "IS").fillStyle = color;
	$('canvas').getLayer(hitNumber + "OS").fillStyle = color;

	hit_zanpoint = calc(point, hitNumber * 2, HIT_AREA_DOUBLE);
	color = getColor(hit_zanpoint);
	$("#" + hitNumber + "D").text(getDisplayText(hitNumber + "D", hit_zanpoint));
	$("#" + hitNumber + "D").css({backgroundColor: color});
	$('canvas').getLayer(hitNumber + "D").fillStyle = color;

	hit_zanpoint = calc(point, hitNumber * 3, HIT_AREA_TRIPLE);
	color = getColor(hit_zanpoint);
	$("#" + hitNumber + "T").text(getDisplayText(hitNumber + "T", hit_zanpoint));
	$("#" + hitNumber + "T").css({backgroundColor: color});
	$('canvas').getLayer(hitNumber + "T").fillStyle = color;
}

function displayPointForBull(point, hitNumber) {
	var hit_zanpoint = calc(point, hitNumber * 1, HIT_AREA_SINGLE);
	var color = getColor(hit_zanpoint);
	$("#SB").text(getDisplayText("SB", hit_zanpoint));
	$("#SB").css({backgroundColor: color});
	$('canvas').getLayer("SB").fillStyle = getColor(hit_zanpoint);

	hit_zanpoint = calc(point, hitNumber * 2, HIT_AREA_DOUBLE);
	color = getColor(hit_zanpoint);
	$("#DB").text(getDisplayText("DB", hit_zanpoint));
	$("#DB").css({backgroundColor: color});
	$('canvas').getLayer("DB").fillStyle = getColor(hit_zanpoint);

//	hit_zanpoint = calc(point, i * 3, HIT_AREA_TRIPLE);
//	$("#" + hitNumber).text(hit_zanpoint);
//	$('canvas').getLayer(i + "T").fillStyle = getColor(hit_zanpoint);
}

function getDisplayText(hitNumber, hit_zanpoint) {
	if (hit_zanpoint == OUT || hit_zanpoint == BURST || hit_zanpoint == "") {
		return hit_zanpoint;
	}
	return hitNumber + " → " + hit_zanpoint;
}

function isEvenNumber(hit_zanpoint) {
	if (hit_zanpoint == "SB" || hit_zanpoint == "DB") {
		// DBは偶数だが、難しいため、奇数と判定。
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