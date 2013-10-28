/**
 * TouchTheNumberクラス
 * @constructor
 */
var TouchTheNumber = function() {
  console.log('This is TouchTheNumber Constructor.');
  /** @type {Number} 行数 */
  this.rows = 0;
  /** @type {Number} 列数 */
  this.cols = 0;
  /** @type {Element} ゲームのルート要素 */
  this.rootEl = document.getElementById('root');
  /** @type {Element} ゲームフィールド要素 */
  this.fieldEl = document.getElementById('field');
  /** @type {Element} スタート画面要素 */
  this.introEl = document.getElementById('intro');
  /** @type {Element}イベント破棄用にnumber要素をプールする配列 */
  this.numberElements = [];
};

/**
 * ゲームを初期化
 */
TouchTheNumber.prototype.init = function() {
  //行と列の数を設定
  this.rows = 2;
  this.cols = 2;
  //初期値をセット
  this.currentNumber = 1;
  //Root要素に画面サイズを付与
  Utils.setWindowSize(this.rootEl);

  //イントロ画面
  this.intro();
};

/**
 * ゲームのリセット
 */
TouchTheNumber.prototype.reset = function() {
  this.currentNumber = 1;
};

/**
 * ゲームのイントロ
 */
TouchTheNumber.prototype.intro = function() {
  this.reset();
  this.fieldEl.style.display = 'none';
  this.introEl.style.display = 'block';
  this.introEl.appendChild(this.createIntroView());
};

/**
 * ゲームのスタート
 */
TouchTheNumber.prototype.start = function() {
  this.introEl.style.display = 'none';
  this.fieldEl.style.display = 'block';
  this.fieldEl.appendChild(this.createFieldView(this.rows, this.cols));
};

/**
 * ゲームのクリア
 */
TouchTheNumber.prototype.clear = function() {
  this.intro();
};

/**
 * フィールドを作成
 * @param {Number} rows 行数 y
 * @param {Number} cols 列数 x
 * @return {Element}
 */
TouchTheNumber.prototype.createFieldView = function(rows, cols) {
  var maxNumber = rows * cols;
  var numbers = Utils.createNumberArray(maxNumber);
  var shuffledNumbers = Utils.shuffleArray(numbers);
  var fieldEl = document.createElement('table');
  for(var y = 0; y < rows; y++) {
    var trEl = document.createElement('tr');
    for(var x = 0; x < cols; x++) {
      var tdEl = document.createElement('td');

      //Set Number
      tdEl.textContent = shuffledNumbers.shift();

      //Set Style
      tdEl.style['width']       = 300 / cols - 4 + 'px';
      tdEl.style['height']      = 300 / rows - 4 + 'px';
      tdEl.style['line-height'] = 300 / rows - 4 + 'px';

      //Append
      trEl.appendChild(tdEl);

      //Set Event
      var self = this;
      tdEl.addEventListener('click', function(e){
        self.clicked(e, self);
      });

      //hold this Element
      this.numberElements.push(tdEl);
    }
    fieldEl.appendChild(trEl);
  }

  return fieldEl;
};

/**
 * クリックした際の処理
 * @param e
 */
TouchTheNumber.prototype.clicked = function(e, opt_this) {
  var self = opt_this || window;
  var target = e.currentTarget;
  if(target.textContent == self.currentNumber) {
    target.removeEventListener('click', arguments.callee, false);
    target.className = 'disable';
    if(self.currentNumber === (self.cols * self.rows)) {
      self.fieldEl.innerHTML = '';
      self.clear();
    } else {
      self.currentNumber++;
    }
  }
};

/**
 * スタート画面を作成
 * @return {Element}
 */
TouchTheNumber.prototype.createIntroView = function() {
  //スタート画面を作る
  var element = document.createElement('div');
  var introBtnElText = '<div class="btn start centering">スタート</div>';
  element.innerHTML = introBtnElText;
  var introBtnEl = element.children[0];
  var self = this;
  introBtnEl.addEventListener('click', function(e) {
    var target = e.currentTarget;
    self.start();
    target.removeEventListener('click', arguments.callee, false);
    self.introEl.innerHTML = '';
  });

  return introBtnEl;

};
