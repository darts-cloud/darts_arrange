var DEFINE_STROKE_STYLE = 'black';
var DEFINE_STROKE_WIDTH = 2;
var DEFINE_CENTER_X = 160;
var DEFINE_CENTER_Y = 160;//
var NUMBER_MAP = {
	1 : "20",
	2 : "1",
	3 : "18",
	4 : "4",
	5 : "13",
	6 : "6",
	7 : "10",
	8 : "15",
	9 : "2",
	10 : "17",
	11 : "3",
	12 : "19",
	13 : "7",
	14 : "16",
	15 : "8",
	16 : "11",
	17 : "14",
	18 : "9",
	19 : "12",
	20 : "5"
};

/**
 *  初期表示
 */
function canvas_init() {
	// 各ナンバー描画
	for (var i = 1; i<=20; i++) {
		drawSlice(i, NUMBER_MAP[i]);
	}

	// ブル描画
	drawBull();
}

/**
 * ナンバー描画
 */
function drawSlice(num, numberName) {
	var canvas = $('canvas');
	var baseAngles = (num - 1) * 18;
	var singleColor = "";
	var multipleColor = "";
	if (num % 2 == 1) {
		singleColor="white";
		multipleColor="white";
	} else {
		singleColor="white";
		multipleColor="white";
	}
	
	// インナーシングル描画
	drawInnerSingle(singleColor, baseAngles, numberName);
	
	// アウターシングル描画
	drawOuterSingle(singleColor, baseAngles, numberName);

	// トリプル描画
	drawTriple(multipleColor, baseAngles, numberName);

	// ダブル描画
	drawDouble(multipleColor, baseAngles, numberName);
}

/**
 * インナーシングル描画
 */
function drawInnerSingle(color, baseAngles, numberName) {
	$('canvas').drawSlice({
		strokeStyle: DEFINE_STROKE_STYLE,
		strokeWidth: DEFINE_STROKE_WIDTH,
		fillStyle: color,
		name: numberName + "IS",
		layer: true,
		x: DEFINE_CENTER_Y, y: DEFINE_CENTER_Y,
		radius: 80,
		// start and end angles in degrees
		start: baseAngles - 9, end: baseAngles + 9
	});
}

/**
 * アウターシングル描画
 */
function drawOuterSingle(color, baseAngles, numberName) {
	var startX = DEFINE_CENTER_X + Math.sin((baseAngles-9) * Math.PI / 180) * 90;
	var startY = DEFINE_CENTER_Y + Math.cos((baseAngles-9) * Math.PI / 180) * -90;
	$('canvas').drawVector({
		strokeStyle: DEFINE_STROKE_STYLE,
		strokeWidth: DEFINE_STROKE_WIDTH,
		fillStyle: color,
		name: numberName + "OS",
		layer: true,
		rounded: false,
		closed: true,
		x: startX, y: startY,
		a1: baseAngles - 10, l1: 45,
		a2: baseAngles + 90, l2: 42,
		a3: baseAngles + 187 , l3: 45
	});
}

/**
 * ダブル描画
 */
function drawDouble(color, baseAngles, numberName) {
	var startX = DEFINE_CENTER_X + Math.sin((baseAngles-9) * Math.PI / 180) * 132;
	var startY = DEFINE_CENTER_Y + Math.cos((baseAngles-9) * Math.PI / 180) * -132;
	// Draw a closed path (making a triangle)
	$('canvas').drawVector({
		strokeStyle: DEFINE_STROKE_STYLE,
		strokeWidth: DEFINE_STROKE_WIDTH,
		fillStyle: color,
		name: numberName + "D",
		layer: true,
		rounded: false,
		closed: true,
		x: startX, y: startY,
		a1: baseAngles - 10, l1: 20,
		a2: baseAngles + 90, l2: 48,
		a3: baseAngles + 187 , l3: 20
	});
}

/**
 * トリプル描画
 */
function drawTriple(color, baseAngles, numberName) {
	var startX = DEFINE_CENTER_X + Math.sin((baseAngles-9) * Math.PI / 180) * 70;
	var startY = DEFINE_CENTER_Y + Math.cos((baseAngles-9) * Math.PI / 180) * -70;
	// Draw a closed path (making a triangle)
	$('canvas').drawVector({
		strokeStyle: DEFINE_STROKE_STYLE,
		strokeWidth: DEFINE_STROKE_WIDTH,
		fillStyle: color,
		name: numberName + "T",
		layer: true,
		rounded: false,
		closed: true,
		x: startX, y: startY,
		a1: baseAngles - 10, l1: 20,
		a2: baseAngles + 90, l2: 28,
		a3: baseAngles + 187 , l3: 20
	});

}

/**
 * ブル描画
 */
function drawBull() {
	// Draw a full circle
	$('canvas').drawArc({
		strokeStyle: DEFINE_STROKE_STYLE,
		strokeWidth: DEFINE_STROKE_WIDTH,
		fillStyle: 'white',
		name: "SB",
		layer: true,
		x: DEFINE_CENTER_X, y: DEFINE_CENTER_Y,
		radius: 16
	});
	// Draw a full circle
	$('canvas').drawArc({
		strokeStyle: DEFINE_STROKE_STYLE,
		strokeWidth: DEFINE_STROKE_WIDTH,
		fillStyle: 'white',
		name: "DB",
		layer: true,
		x: DEFINE_CENTER_X, y: DEFINE_CENTER_Y,
		radius: 6
	});
}
