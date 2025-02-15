$(document).ready(function() {
  function scoregraph() {
    var times = [];
    var scores = [];
    $.get(script_root + "/api/v1/teams/" + TEAM_ID + "/solves", function(
      solve_data
    ) {
      $.get(script_root + "/api/v1/teams/" + TEAM_ID + "/awards", function(
        award_data
      ) {
        $.get(script_root + "/api/v1/teams/" + TEAM_ID + "/rfps", function (
          rfp_data
        ) {
          var solves = solve_data.data;
          var awards = award_data.data;
          var rfps = rfp_data.data;

          var temp = solves.concat(rfps);
          var total = temp.concat(awards);

          total.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
          });

          for (var i = 0; i < total.length; i++) {
            var date = moment(total[i].date);
            times.push(date.toDate());
            try {
              if(total[i].challenge.value > 0)
                scores.push(total[i].challenge.value);
              else
                scores.push(total[i].score);
            } catch (e) {
                scores.push(total[i].value);
            }
          }
          scores = cumulativesum(scores);

          var data = [
            {
              x: times,
              y: scores,
              type: "scatter",
              marker: {
                color: colorhash(TEAM_NAME + TEAM_ID)
              },
              line: {
                color: colorhash(TEAM_NAME + TEAM_ID)
              },
              fill: "tozeroy"
            }
          ];

          var layout = {
            title: "Score over Time",
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            hovermode: "closest",
            xaxis: {
              showgrid: false,
              showspikes: true
            },
            yaxis: {
              showgrid: false,
              showspikes: true
            },
            legend: {
              orientation: "h"
            }
          };
  
          $("#score-graph").empty();
          document.getElementById("score-graph").fn =
            "CTFd_score_team_" +
            TEAM_ID +
            "_" +
            new Date().toISOString().slice(0, 19);
          Plotly.newPlot("score-graph", data, layout);
        });
      });
    });
  }

  function keys_percentage_graph() {
    var base_url = script_root + "/api/v1/teams/" + TEAM_ID;
    $.get(base_url + "/fails", function(fails) {
      $.get(base_url + "/solves", function(solves) {
        var solves_count = solves.data.length;
        var fails_count = fails.data.length;

        var graph_data = [
          {
            values: [solves_count, fails_count],
            labels: ["Solves", "Fails"],
            marker: {
              colors: ["rgb(0, 209, 64)", "rgb(207, 38, 0)"]
            },
            hole: 0.4,
            type: "pie"
          }
        ];

        var layout = {
          title: "Solve Percentages",
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          showlegend: false
        };
        if($("#keys-pie-graph").length) {
          $("#keys-pie-graph").empty();
          document.getElementById("keys-pie-graph").fn =
            "CTFd_submissions_team_" +
            TEAM_ID +
            "_" +
            new Date().toISOString().slice(0, 19);
          Plotly.newPlot("keys-pie-graph", graph_data, layout);
        }
      });
    });
  }

  function category_breakdown_graph() {
    $.get(script_root + "/api/v1/teams/" + TEAM_ID + "/solves", function(
      solve_data 
    ) {
      $.get(script_root + "/api/v1/teams/" + TEAM_ID + "/rfps", function(
        rfp_data
      ) {
        var solve = solve_data.data;
        var rfp = rfp_data.data;

        solves = solve.concat(rfp);

        var categories = [];
        for (var i = 0; i < solves.length; i++) {
          categories.push(solves[i].challenge.category);
        }

        var keys = categories.filter(function(elem, pos) {
          return categories.indexOf(elem) == pos;
        });

        var counts = [];
        for (var i = 0; i < keys.length; i++) {
          var count = 0;
          for (var x = 0; x < categories.length; x++) {
            if (categories[x] == keys[i]) {
              count++;
            }
          }
          counts.push(count);
        }

        var data = [
          {
            values: counts,
            labels: keys,
            hole: 0.4,
            type: "pie"
          }
        ];

        var layout = {
          title: "Category Breakdown",
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          legend: {
            orientation: "h"
          }
        };
        if($("#categories-pie-graph").length) {
          $("#categories-pie-graph").empty();
          document.getElementById("categories-pie-graph").fn =
            "CTFd_categories_team_" +
            TEAM_ID +
            "_" +
            new Date().toISOString().slice(0, 19);
          Plotly.newPlot("categories-pie-graph", data, layout);
        }
      });
    });
  }

  category_breakdown_graph();
  keys_percentage_graph();
  scoregraph();

  window.onresize = function() {
    Plotly.Plots.resize(document.getElementById("keys-pie-graph"));
    Plotly.Plots.resize(document.getElementById("categories-pie-graph"));
    Plotly.Plots.resize(document.getElementById("score-graph"));
  };
});
