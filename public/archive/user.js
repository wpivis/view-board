var gridLights = [];
var svg = d3.select("#container").append("svg")
			.attr("width",410)
			.attr("height",410)
			.style("border","1px solid black");

for(var colNum=0;colNum<7;colNum++) {
	for(var rowNum=0;rowNum<7;rowNum++) {
		svg.append("rect").attr("width","50")
							.attr("height","50")
							.attr("x",colNum*50+colNum*10)	
							.attr("y",rowNum*50+rowNum*10)
							.attr("id",function(d,i) {
								return (1+7*rowNum+colNum).toString();
							})
							.attr("fill","green")
							.on("mousedown",function() {
								var dataPoint = [d3.select(this).attr("id"),d3.select(this).attr("x")/60,d3.select(this).attr("y")/60];
								d3.select(this).classed("selected",true);
								gridLights.push(dataPoint);
							})
							.on("mouseover",function() {
								if(d3.select(this).classed("selected")!=true && gridLights.length!=0) {
									d3.select(this).classed("selected",true);
									var dataPoint = [d3.select(this).attr("id"),d3.select(this).attr("x")/60,d3.select(this).attr("y")/60];
									gridLights.push(dataPoint);
								}
							})
							.on("mouseup",function() {
								svg.selectAll("rect.selected").classed("selected",false);
								console.log(gridLights);
								//sendToServer();
								gridLights=[];
							});
	}
}

var sendToServer = function() {
	$.post( "/userInput",gridLights).done(function(data) {
		alert("Server said:"+data);
	});
}