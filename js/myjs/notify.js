function notify_setValue(val) {
  document.AskNotifier.onBtn.value = val;
}

function zabbix_notify_info(str) {
  if (spinner !== undefined) {
    spinner.stop();
  }
  $.pnotify({
    title: 'Dscript Log',
    text: str,
    addclass: 'custom',
    icon: 'picon picon-32 picon-fill-color',
    opacity: .8,
    nonblock: true,
    nonblock_opacity: .2
  });
}

function dscript_notify_info(str) {
  if (spinner !== undefined) {
    spinner.stop();
  }
  $.pnotify({
    title: 'Dscript Log',
    text: str,
    addclass: 'custom',
    icon: 'picon picon-32 picon-fill-color',
    opacity: .8,
    nonblock: true,
    nonblock_opacity: .2
  });
}

function riskdb_notify_info(str) {
  $.pnotify({
    title: 'RiskDB Log',
    text: str,
    addclass: 'error',
    icon: 'picon picon-32 picon-fill-color',
    opacity: .8,
    nonblock: true,
    nonblock_opacity: .2
  });
}

var global_notice;

function form_template(body, to) {
  var body_array = body.split(/\(|\)/);
  var sentence = body_array[0];
  var $notify_body = $('#form_notice');
  var recv_words = body_array[1].replace(',', '').split(' ');
  var allow_word = recv_words[1];
  var allow_word = recv_words[3];
  console.log(sentence + '(' + to + '): [' + allow_word + ', ' + deny_word + ']');
  var html = '\
  <form class="pf-form pform_custom" action method="post">\
   <img src="./img/dscript_logo.png" width="80px" style="float: left; margin-left: -50px;"></img>\
   <div>\
     <div class="pf-element pf-heading">\
       <h5>' + sentence + '</h5>\
     </div>\
     <div class="pf-element pf-buttons pf-centered" style="position: relative; margin: 0 auto 0 auto;">\
       <button class="pf-button btn" type="button" onclick="notifier_allow_script(' + to + ');">' + allow_word + '</button>\
       <button class="pf-button btn btn-primary" type="button" onclick="notifier_deny_script(' + to + ');">' + deny_word + '</button>\
     </div>\
   </div>\
  </form>';
  $notify_body.html(html);
  return $notify_body;
}

function zabbix_form_notify(str, to) {
  global_notice = $.pnotify({
    text: form_template(str, to).html(),
    opacity: .9,
    addclass: 'custom',
    width: '290px',
    hide: false,
    closer: false,
    sticker: false,
    insert_brs: false,
  });
  return false;
}

function notifier_allow_script(to) {
  $.ajax({
      url: to,
      type : 'POST',
      data : 'Y',
      error:function(){},
      complete:function(data){
        global_notice.pnotify_remove();
      },
      dataType:'text'
  });
  return false;
}

function notifier_deny_script(to) {
  $.ajax({
      url: to,
      type : 'POST',
      data : 'N',
      error:function(){},
      complete:function(data){
        global_notice.pnotify_remove();
      },
      dataType:'text'
  });
  return false;
}
