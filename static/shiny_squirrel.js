var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, 60])
    .range([0, width]);

var x_axis_scale = d3.scale.linear()
    .domain([0, 60])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 90])
    .range([height, 0]);

var yService = d3.scale.linear()
    .domain([0, 15])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x_axis_scale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var yAxisServiceGraph = d3.svg.axis()
    .scale(yService)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.pos); })
    .y(function(d) { return yService(d.count); });

var total_graph = d3.select("#total-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var service_graph = d3.select("#service-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var count_list = [];
var service_list = [];
var color_list = ['teal', 'orangered', 'mediumseagreen',
                  'mediumturquoise', 'gold', 'limegreen',
                  'aquamarine', 'blueviolet', 'brown',
                  'cornflowerblue', 'crimson', 'darkkhaki',
                  'forestgreen', 'limegreen'];

function circle_transform(item) {
  var scaled_pos = x(item.pos);
  var scaled_cnt = yService(item.count);
  return "translate(" + scaled_pos + "," + scaled_cnt + ")";
}

function get_count() {
  var data = [];

  count_list.forEach(function (item, idx, arr) {
      var p = Object();
      p.pos = idx;
      p.total_count = +item.total_count;
      p.packet_ids = item.packet_ids;
      p.quality = item.quality;
      data.push(p);
  });

  return data;
}

function get_count_for_service(service) {
  var data = [];

  count_list.forEach(function (item, idx, arr) {
    if (idx < 40) {
      var p = Object();
      p.pos = idx;
      p.count = +0;
      if ("services" in item) {
        if (service in item.services) {
          p.count = +item.services[service];
        }
      }
      if (p.count > 0) {
        data.push(p);
      }
    }
  });

  return data;
}

function packet_click(packet) {
  var countline = d3.select("#packets");
  countline.selectAll("li").remove();
  if (packet.packet_ids.length == 0) {
    countline.append("li").text("No logs found for that data point.");
    return;
  }

  var sorted_logs_url = "/sorted-logs?";
  packet.packet_ids.forEach(function (item) {
    sorted_logs_url = sorted_logs_url + "ids=" + item + "&";
  });
  d3.json(sorted_logs_url, function(error, data) {
    if (error) throw error;

    data["sorted-logs"].lines.forEach(function (line) {
      countline.append("li")
        .attr("class", "list-group-item")
        .attr("class", get_line_class(line[1]))
        .text(line[0]);
    });
  });
}

function initialize(graph, group_id, yAxisFunc) {
  graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("y", 6)
      .attr("dy", "2.25em")
      .text("seconds");

  graph.append("g")
      .attr("class", "y axis")
      .call(yAxisFunc)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("logs lines");

  graph.append("g")
      .attr("id", group_id);
}

function get_bar_class(data) {
  if (data.quality < 0.24) {
    return "bar-red";
  } else if (data.quality < 0.266 ) {
    return "bar-orange";
  } else if (data.quality < 0.28) {
    return "bar-yellow";
  }
  return "bar";
}

function get_line_class(quality) {
  cl = "list-group-item";
  if (quality < 0.24) {
    cl += " line-red";
  } else if (quality < 0.266 ) {
    cl += " line-orange";
  } else if (quality < 0.28) {
    cl += " line-yellow";
  }
  return cl;
}

function update() {
  var data = get_count();
  d3.select("#total-countline").selectAll("rect").remove();
  data.forEach(function (item) {
    d3.select("#total-countline")
        .append("rect")
          .datum(item)
          .attr("class", get_bar_class)
          .attr("x", function (d) { return x(d.pos); })
          .attr("width", width/60)
          .attr("y", function (d) { return y(d.total_count); })
          .attr("height", function (d) { return height - y(d.total_count); })
          .on("click", packet_click);
  });
}

function update_line_and_circles() {
  var services = service_list.slice(0, 10);
  var legend = d3.select("#service-countline").selectAll(".legend").data(services);

  legend.enter().append("g")
          .attr("class", "legend")
          .attr("transform", function (d, i) {return "translate(0," + i * 20 + ")"; });

  legend.exit().remove();

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return color_list[i % color_list.length]; });

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {return d; });

  d3.select("#service-countline").selectAll("path").remove();
  services.forEach(function (item, idx) {
    var data = get_count_for_service(item);
    d3.select("#service-countline").append("path")
          .datum(data)
          .attr("class", "line")
          .style("stroke", color_list[idx % color_list.length])
          .attr("d", line);
    data.forEach(function (item) {
      d3.select("#service-countline").append("path")
            .datum(item)
            .attr("transform", circle_transform(item))
            .attr("class", "circle")
            .attr("d", d3.svg.symbol().size(40))
            .style("fill", color_list[idx % color_list.length]);
    });
  });
}

initialize(total_graph, "total-countline", yAxis);
initialize(service_graph, "service-countline", yAxisServiceGraph);

setInterval(function() {
  d3.json("/count-packets", function(error, data) {
      if (error) throw error;

      var new_count_list = [];
      data["count-packets"]["history"].forEach(function (item) {
        var p = Object();
        p.total_count = item.count;
        p.packet_ids = item.ids;
        p.quality = item.quality;
        p.services = item["service-counts"];
        Object.keys(p.services).forEach(function (item) {
          if (service_list.indexOf(item) === -1) {
            service_list.push(item);
          }
        });
        new_count_list.unshift(p);
      });

      count_list = new_count_list

      update();
      update_line_and_circles();
  });
}, 1500);
