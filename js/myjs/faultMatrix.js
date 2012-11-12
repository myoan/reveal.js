//export modules to arch
function draw_MatrixSVG(lsvg) {
  $svg = $('lsvg');
  $svg.attr('position', 'relative');
}

var Matrix = function() {
  this.$dom;
  this.$table;
  this.nodes = [];
  this.domDict = [];
  this.flag_usr = (1 << 0);
  this.flag_sys = (1 << 1);
  this.flag_sft = (1 << 2);
  this.flag_ext = (1 << 3);

};

Matrix.prototype = {
  init: function() {
        this.$dom = $('#fault_matrix');
    this.$dom.svg({onLoad: draw_MatrixSVG});
    this.line = this.$dom.svg('get').group({
      stroke: 'black',
      strokeWidth: 3
    });

    this.$table = $('#fault_table');
  },
  createSoftwareFault: function() {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('matrix_cell');
    $ret.addClass('software_fault');
    $ret.css({
        'background': '#aa4400',
        'top': '10px',
        'left': '0px',
    });
    createLastChild($ret, 'p', 'Soflware Fault');
    createLastChild($ret, 'p', '(bugs, design mistake)');
  },
  createUserFault: function() {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('matrix_cell');
    $ret.addClass('user_fault');
    $ret.css('bg', '#00aa00');
    $ret.css({
        'background': '#00aa00',
        'top': '10px',
        'left': '220px',
    });
    createLastChild($ret, 'p', 'User Fault');
    createLastChild($ret, 'p', '(user mistake)');
  },
  createSystemFault: function() {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('matrix_cell');
    $ret.addClass('system_fault');
    $ret.css({
        'background': '#aa0000',
        'top': '170px',
        'left': '0px',
    });
    createLastChild($ret, 'p', 'System Fault');
    createLastChild($ret, 'p', '(OS error, hardware error)');
  },
  createExternalFault: function() {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('matrix_cell');
    $ret.addClass('external_fault');
    $ret.css({
        'background': '#aa00aa',
        'top': '170px',
        'left': '220px',
    });
    createLastChild($ret, 'p', 'External Fault');
    createLastChild($ret, 'p', '(external error');
  },
  setAxis: function() {
    var svg = this.$dom.svg('get');
    var w = parseInt(this.$dom.css('width'));
    var h = parseInt(this.$dom.css('height'));
    var l = svg.line(this.line, 0, h / 2, w, h / 2);
    var l = svg.line(this.line, w / 2, 0, w / 2, h);
  },
  drawMatrix: function() {
    var $software = this.createSoftwareFault();
    var $user = this.createUserFault();
    var $system = this.createSystemFault();
    var $extern = this.createExternalFault();
    this.setAxis();
  },
  addLine: function(data) {
	var elem = $("<tr></tr>");
	elem.append('<td>' + data['api'] +'</td>');
	elem.append('<td>' + data['file'] +'</td>');
	elem.append('<td>' + data['line'] +'</td>');
	elem.append('<td>' + data['diag'] +'</td>');
	this.$table.append(elem);
	//$(".matrix_cell.user_fault").css('background', '#000000');
	
    //line.addClass('fault_line');
    //var line = createLastChild(line, 'p', str);
    //var matrix = createLastChild(line);
    ////console.log(flag);
    //if (flag & this.flag_usr != 0) {
    //  //console.log(flag & this.flag_usr)
    //  var usr = createLastChild(matrix);
    //  usr.addClass('fault_line_User');
    //}
    //if ((flag & this.flag_sys) != 0) {
    //  //console.log(flag & this.flag_sys)
    //  var sys = createLastChild(matrix);
    //  sys.addClass('fault_line_System');
    //}
    //if ((flag & this.flag_sft) != 0) {
    //  //console.log(flag & this.flag_sft)
    //  var sft = createLastChild(matrix);
    //  sft.addClass('fault_line_Soft');
    //}
    //if ((flag & this.flag_ext) != 0) {
    //  //console.log(flag & this.flag_ext)
    //  var ext = createLastChild(matrix);
    //  ext.addClass('fault_line_Ext');
    //}
  },
  resetAnimation: function($node) {
  },
  doAnimate_running: function($node) {
  },
  doAnimate_error: function($node) {
  },
};

function Matrix_init(data) {
  var matrix = new Matrix();
  matrix.init();
  matrix.drawMatrix();
  // TODO use bootstrap Table-hover
  /*
  var data = [ {
	'file' : 'hoge.k',
	'line' : '12',
	'api' : 'System.fopen()',
	'diag' : 'SoftwareFault',
  }, {
	'file' : 'hoge.k',
	'line' : '13',
	'api' : 'System.fopen()',
	'diag' : 'SoftwareFault',
  }, {
	'file' : 'hoge.k',
	'line' : '14',
	'api' : 'System.fopen()',
	'diag' : 'SoftwareFault',
  } ];
*/
  for (var i = 0; i < data.length; i++) {
	  matrix.addLine(data[i]);
  }
  // Matrix_stat(matrix);
}

//function Matrix_stat(matrix) {
//  var data = '';
//  var json;
//  $.ajax({
//    url: CONFIG.cgi_dir + '/arch_state_controller.php',
//    type:'POST',
//    data: data,
//    error:function() {},
//    complete:function(data) {
//      var json = jQuery.parseJSON(data.responseText);
//      var value = json.Value[json.Value.length-1];
//      var $node = $(arch.getDomFromIp(value.Ip));
//      if(value.State === undefined) {
//        value.State = 'not working';
//      }
//      else if(value.State === 'start' && $node.attr('phase') !== 'run') {
//        arch.doAnimate_running($node);
//      }
//      else if(value.State === 'end') {
//        if (value.Result === 'success') {
//          arch.resetAnimation($node);
//        }
//        else {
//          //arch.doAnimate_error($node);
//          arch.resetAnimation($node);
//        }
//      }
//      setTimeout( function() {
//        Arch_stat(arch);
//      },1000);
//    },
//    dataType:'json'
//  });
//}
