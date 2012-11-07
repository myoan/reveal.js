/*
 * editor is embedded into:
 * <textarea id="editor">hello, world</textarea>
 */

var yoan_dscript_editors = [];

function Editor_init() {
  var i = 0;
  $.each($('.editor'), function() {
    yoan_dscript_editors.push(createEditor($(this)));
  });
  Editor_refresh();
}

function createEditor($dom) {
		var editor = CodeMirror(function(elt) {
			$dom.replaceWith(elt);
			}, {
				value: $dom.val(),
				lineNumbers: true,
				mode: "text/x-konoha"
			});
		var libs = {
			setLineColor : function(line,count){
					editor.setLineClass(line - 1,"SGreen");
			},
			setLineError : function(line) {
				editor.setLineClass(line - 1, null);
				editor.setLineClass(line - 1,"SRed");
			},
			setLineClear : function(line) {
				editor.setLineClass(line - 1, null);
			}
		};
		var log = { getLog : function(data,index){
			//var data = (JSON.stringify({ "Method": "RequestDSE","Script" : editor.getValue()}));
			$.ajax({
				//url:'cgi-bin/zabbixlog.php',
				url:'cgi-bin/zabbixpol.php',
				type:'POST',
				data: {"JSON" : data},
				error:function() { $("#error_log").text("error") },
				complete:function(res_data) {
					var res_json = JSON.parse(res_data.responseText);
					var t = 100;
					var script_flag = true;
					var idx = index;
					console.log(res_json.Value.length);
					for(var i = index +1; i < res_json.Value.length; i++) {
					console.log(i);
						var value = res_json.Value[i];
						var key = i;
						if(value === null) {
							continue;
						}
						//index = key;
						if(value.ScriptName === ".\/dse.k") {
							continue;
						}
						switch(value.Method) {
						case "Alert":
              $('#myModal').modal();
						case "DScriptResult":
							setTimeout( function() {
								libs.setLineColor(value.ScriptLine,value.Count);
							},t);
							break;
						case "StartTask":
							break;
						case "EndTask":
							script_flag = false;
							return false;
						case "DScriptMessage":
              zabbix_notify_info(value.Body.replace(/\#(.+)$/, ""));
							$("#error_log").append(value.Body.replace(/\#(.+)$/, ""));
              break;
						case "DScriptAsk":
              if (value.Ip !== undefined) {
                zabbix_form_notify(value.Body.replace(/\#(.+)$/, ""), value.Ip);
              }
							break;
						default :
							$("#error_log").append(JSON.stringify(value) + "\n");
							if(value.ScriptLine !== undefined) {
								setTimeout( function() {
									libs.setLineError(value.ScriptLine);
								},t);
							}
						}
						t += 100;
						idx = i;
					}
					if(script_flag) {
							setTimeout( function() {
								log.getLog(data, idx);
							},1000);
					}
				},
				dataType:'json'
			});
		}
		};
	$("#exec").click(function(){
    Spinner_start();
		var data = {
			'Method': 'SendDSE',
      'Name': $('#script_select option:selected').val(),
			'Script': editor.getValue(),
			'Option': '',
			'To': $('#ip_select option:selected').val(),
			'From': '127.0.0.1:80',
			'event': 'D-Task'
		};
    console.log('----------------------------');
    console.log(data);
		$.ajax({
			url:'cgi-bin/checkKillSender.cgi',
			//url:'cgi-bin/testSender.cgi',
			//url:'cgi-bin/DCtrlSender.cgi',
			type : 'POST',
			data : data,
			error:function(){$("#log1").text("error1"); },
			complete:function(data){
					log.getLog(data.responseText,0);
			},
			dataType:'json'
		});
	});
  $("#agreedExec").click(function(){
		var data = {
			'Method': 'SendDSE',
      'Name': $('#script_select option:selected').val(),
			'Script': editor.getValue(),
			'Option': '',
			'To': $('#ip_select option:selected').val(),
			'From': '127.0.0.1:80',
			'event': 'D-Task'
		};
    console.log('----------------------------');
    console.log(data);
		$.ajax({
			url:'cgi-bin/storedScriptSender.cgi',
			type : 'POST',
			data : data,
			error:function(){$("#log1").text("error1"); },
			complete:function(data){
				log.getLog(data.responseText);
			},
			dataType:'json'
		});
	});
	return editor;
};


function Editor_refresh() {
  for(var i = 0; i < yoan_dscript_editors.length; i++) {
    yoan_dscript_editors[i].refresh();
  }
  setTimeout( function() {
    Editor_refresh();
  },10000);
}
