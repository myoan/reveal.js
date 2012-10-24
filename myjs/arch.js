//export modules to archi
var archi = {};

(function() {
    //	config
    var server_height = (window.innerHeight / 5);
    var server_width = (window.innerWidth / 12);
    var layout_height = (window.innerHeight * 0.6);
    var layout_width = (window.innerWidth * 0.6);

    function new_$line($canvas, from, to) {
        $line_context = $canvas[0].getContext("2d");
        $line_context.beginPath();
        $line_context.lineWidth = 2;
        $line_context.strokeStyle = "D3D3D3";
        $line_context.moveTo(from[0], from[1]);
        $line_context.lineTo(to[0], to[1]);
        $line_context.stroke();
    }
    function new_$img(src) {
        $new_img = $("<img/>");
        $new_img.attr("src", src);
        return $new_img;
    }
    function new_$node(id, imgsrc) {
        var $new_node = $("<div/>");
        $new_node
			.attr("id", id)
			.css("padding", 0);
        $new_node.append(new_$img(imgsrc)
                         .attr("id", id + "_img")
                         .attr("height", server_height)
                         .attr("widhth", server_width)
                         .css({"display" : "inline-block",
							   "border" : "none",
							   "top" : 0,
							   "padding" : "0px",
							   "margin" : "0px",
							   "-webkit-box-shadow" : "none",
							   "box-shadow" : "none",
							  }));
        var $description = $("<div/>")
			.css("font-size", "large")
            .css({"display" : "inline-block"});
        $new_node.append($description);
        $description.append($("<div/>")
							.attr("id", id + "_name")
							.css({"padding" : "2px",
								  "top" : 0,
//								  "height" : "20px",
								  "text-align" : "left",
								 })
							.text("name:" + id)
                           );
        $description.append($("<div/>")
							.attr("id", id + "_state")
							.css({"padding" : "2px",
								  "top" : 0,
//								  "height" : "20px",
								  "text-align" : "left",
								 })
							.text("state:waiting") // FIX ME !!
                           );
        return $new_node;
    }
    function architecture_init(id) {
        var $load_balancer = new_$node("lb", "architecture/pic/server.png");
        var $web_server1 = new_$node("ws1", "architecture/pic/server.png");
        var $web_server2 = new_$node("ws2", "architecture/pic/server.png");
        var $db_server = new_$node("dbs", "architecture/pic/server.png");

//for debug
//         $load_balancer.css("background-color", "darkred")
//         $web_server1.css("background-color", "cyan")
//         $web_server2.css("background-color", "darkgreen")
//         $db_server.css("background-color", "gold")
//

        var $layout = $("<div/>")
			.css({"position" : "relative",
				  "z-index" : 0});
        $layout.attr("height", layout_height);
        $layout.attr("width", layout_width);
        $layout.append($load_balancer
					   .attr("width", layout_width))
        $layout.append($web_server1
					   .attr("width", layout_width / 2)
					   .css("float", "left"))
        $layout.append($web_server2
					   .attr("width", layout_width / 2)
					   .css("float", "right"))
        $layout.append($db_server
					   .attr("width", layout_width)
					   .css("clear", "both"))

		$new_canvas = $("<canvas/>")
			.attr("width", layout_width)
			.attr("height", layout_height)
			.css({"position" : "absolute",
				  "top" : "0",
				  "left" : "0",
				  "z-index" : "1"});
		$layout.append($new_canvas);
		var server_height_tmp = server_height + 13
		new_$line($new_canvas, [server_width / 2, server_height_tmp], [layout_width / 2 - server_width / 2, server_height_tmp / 3]);
		new_$line($new_canvas, [server_width / 2, server_height_tmp * 2], [layout_width / 2 - server_width / 2, server_height_tmp * (3 - 1/3)]);
		new_$line($new_canvas, [layout_width / 2 + server_width, server_height_tmp / 3], [layout_width, server_height_tmp]);
		new_$line($new_canvas, [layout_width / 2 + server_width + 50, server_height_tmp * (3 - 1/3)], [layout_width, server_height_tmp * 2]);
// 		new_$line($new_canvas, [layout_width / 9, layout_height / 2.5], [layout_width / 3.6, layout_height / 5]);
// 		new_$line($new_canvas, [layout_width / 9, layout_height / 1.37], [layout_width / 3.6, layout_height / 1.1]);
//         new_$line($new_canvas, [layout_width / 2, layout_height / 1.05], [layout_width / 1.5, layout_height / 1.38]);
//         new_$line($new_canvas, [layout_width / 1.65, layout_height / 3.0], [layout_width / 1.5, layout_height / 2.45]);

        $new_arch = $(".arch");
        $new_arch.append($layout);

        return $new_arch;
    }
    function add_$section($new_section) {
        $(".slides").append($new_section);
    }
    function to_running_state($node) {
		node_id = $node.attr("id");

		node_img_id = "#" + node_id + "_img";
		$(node_img_id).addClass("animated shake");
		$(node_img_id).css({
			"-webkit-animation-iteration-count" : "infinite",
			"-moz-animation-iteration-count" : "infinite"
		});

		node_state_id = "#" + node_id + "_state";
		$(node_state_id).text("state:running");
    }
    function to_error_state($node) {
		node_id = $node.attr("id");

		node_img_id = "#" + node_id + "_img";
		$(node_img_id).addClass("animated flash");
		$(node_img_id).css({
			"-webkit-animation-iteration-count" : "infinite",
			"-moz-animation-iteration-count" : "infinite"
		});

		node_state_id = "#" + node_id + "_state";
		$(node_state_id).text("state:error");
    }
    function to_waiting_state($node) {
		node_id = $node.attr("id");

		node_img_id = "#" + node_id + "_img";
		$(node_img_id).css({
			"-webkit-animation-iteration-count" : "0",
			"-moz-animation-iteration-count" : "0"
		});

		node_state_id = "#" + node_id + "_state";
		$(node_state_id).text("state:waiting");
    }

//export function
	archi.architecture_init = architecture_init;
	archi.add_$section = add_$section;
	archi.to_running_state = to_running_state;
	archi.to_error_state = to_error_state;
	archi.to_waiting_state = to_waiting_state;

//dubug
	console.log("#######################################");
    console.log("window.innerHeight:" + window.innerHeight);
    console.log("window.innerWidth:" + window.innerWidth);
    console.log("server_height:" + server_height);
    console.log("server_width:" + server_width);
    console.log("layout_height:" + layout_height);
    console.log("layout_width:" + layout_width);
    console.log("#######################################");
})();

//sample code
var $architecture = archi.architecture_init();
// archi.to_running_state($("#ws1"));
// archi.to_error_state($("#ws2"));
// archi.to_error_state($("#dbs"));
// archi.to_waiting_state($("#dbs"));
