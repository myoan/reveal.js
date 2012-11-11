//export modules to bpmn
function draw_bpmnSVG(lsvg) {
  $svg = $('lsvg');
  $svg.attr('position', 'relative');
}

var BPMN = function() {
  this.$dom;
  this.nodes = [];
  this.domDict = [];
};

BPMN.prototype = {
  init: function () {
    this.$dom = $('#bpmn');
    this.$dom.svg({onLoad: draw_bpmnSVG});
    this.line = this.$dom.svg('get').group({
      stroke: 'black',
      strokeWidth: 3
    });
  },
  setNode: function(x, y, name, str, idx) {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('bpmn_node');
    createLastChild($ret, 'p', name);
    $ret.css({
      'top': (y - $ret.height()/2) + 'px',
      'left': x + 'px'
    });
    y = y - $ret.height()/2
    console.log('x = ' + x + ' y = ' + y);
    $ret.click(function() {
      Reveal.slide(4, $('#bpmn').children().index(this) - 1);
    });
    this.nodes.push($ret);
    return $ret;
  },
  connectTo: function(to, from) {
/*    var to_img = to.find('img');
    var from_img = from.find('img');
    var x1 = parseInt(to.css('left'));
    var y1 = parseInt(to.css('top'));
    var x2 = parseInt(from.css('left'));
    var y2 = parseInt(from.css('top'));
    var l = this.$dom.svg('get').line(this.line, x1, y1 - 40, x2, y2 - 40);*/
	  var l = this.$dom.svg('get').line(this.line, to, 300, from, 300);
	  console.log('to = ' + to + ' from = ' + from);
  },
  resetAnimation: function($node) {
    if($node !== undefined) {
      $node.removeClass('bpmn_running');
      $node.removeClass('bpmn_error');
      $stat = $node.children('.status');
      $stat.attr('phase', 'stop');
      $stat.empty();
    }
  },
  doAnimate_running: function($node) {
    this.resetAnimation($node);
    var $stat = createLastChild($node);
    $stat.addClass('status');
    $stat.attr('phase', 'run');
    //var $stat_img = createLastChild($stat, 'img');
    //$stat_img.attr('src', CONFIG.img_dir + '/running.png');
    //$stat_img.css({
    //    'width': '50px',
    //    'height': '50px'
    //});
    $node.addClass('bpmn_running');
  },
  doAnimate_error: function($node) {
    this.resetAnimation($node);
  },
  getDomFromIp: function(ip) {
    return DictArray_v(this.domDict, ip);
  }
}

function BPMN_init(argument) {
  var bpmn = new BPMN();
  bpmn.init();
/*  var $node_a = bpmn.setNode(200, 400, TASK_A.name, parseInt(TASK_A.idx));
  var $node_b = bpmn.setNode(450, 400, TASK_B.name, parseInt(TASK_B.idx));
  var $node_c = bpmn.setNode(700, 400, TASK_C.name, parseInt(TASK_C.idx));*/
  var sw = screen.width/3;
  console.log('sw = '+ sw);

  var $node_a = bpmn.setNode(sw-250, 400, TASK_A.name, parseInt(TASK_A.idx));
  var $node_b = bpmn.setNode(sw, 400, TASK_B.name, parseInt(TASK_B.idx));
  var $node_c = bpmn.setNode(sw+250, 400, TASK_C.name, parseInt(TASK_C.idx));
  bpmn.connectTo($node_a.offset().left - $('#bpmn').offset().left, $node_c.offset().left - $('#bpmn').offset().left);
/*  bpmn.connectTo($node_a, $node_b);
  bpmn.connectTo($node_b, $node_c);*/
  //BPMN_stat(bpmn);
}

//function BPMN_stat(bpmn) {
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
