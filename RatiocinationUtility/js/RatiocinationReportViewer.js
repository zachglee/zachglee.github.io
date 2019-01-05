// -------- V I E W -------- //

//configuration object which is highlightKey -> (a function) ??? -> [css string to add to span styling for that text]
var HIGHLIGHT_STYLES = {
  sentence: {
    state: 0,
    styleGenerator: function(interval, text, state) {
      var COLORS = ["#f00020", "#1dad01", "#3a6ca8", "#8a2be2"];
      var css = "color: " + COLORS[state % COLORS.length] + ";"
      this.state += 1; 
      return css;
    }
  },
  firstWordOfSentence: {
    state: null, //this function is not dependent on state
    styleGenerator: function(interval, text, state) {
      return "font-weight: bold;";
    }
  },
  toBeWord: {
    state: null, //this function is not dependent on state
    styleGenerator: function(interval, text, state) {
      return "text-decoration: underline;";
    }
  },
  bannedWord: {
    state: null, //this function is not dependent on state
    styleGenerator: function(interval, text, state) {
      return "text-decoration: line-through;";
    }
  }
}

var STAT_RENDERERS = {
  sentenceLengthDistribution: function(statsJson) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var sentenceLengths = Object.keys(statsJson).map(function(sentenceLength) {
      return sentenceLength + "-word";
    })
    var sentenceLengthFrequencies = Object.keys(statsJson).map(function(key) {
      return statsJson[key]; //just doing this as a workaround because some browsers don't support Object.values()
    })
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sentenceLengths,//["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: 'Sentence Length Distribution',
                data: sentenceLengthFrequencies,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'frequency'
                    }
                }]
            }
        }
    });
    return "";
    /*var finalHTML = "";
    Object.keys(statsJson).forEach(function(key) {
      finalHTML += "<div>" + key + "-word sentences: " + JSON.stringify(statsJson[key]) + "</div>";
    });
    return finalHTML;*/
  }
}

//returns html which represents how the stats object on the given rationcination report should be rendered
function renderedStatsHTML(rcReport) {
  var stats = rcReport.stats;
  var finalHTML = "";
  Object.keys(stats).forEach(function(key) {
    finalHTML += STAT_RENDERERS[key](stats[key]);
  });
  return finalHTML;
}

//takes in a RatiocinationReport, spits out HTML with the results nicely rendered
function renderedTextHTML(rcReport) {

  //generate the list of charStyles
	var text = rcReport.rawText;

	var charStyles = new Array(text.length).fill(null) //TODO make this an array of the same length as the text string, populated by empty lists to start
	Object.keys(rcReport.highlights).forEach(function(key) {
		var intervals = rcReport.highlights[key];
		intervals.forEach(function(interval) {
      var styleObj = HIGHLIGHT_STYLES[key];
      var style = styleObj.styleGenerator(interval, text, styleObj.state);
			for (var i = interval.begin; i < interval.end; i++) {
        if (charStyles[i]) {
          charStyles[i].push(style); //say that the char at this index should be styled with this key's style
        } else {
          charStyles[i] = [style];
        }
			}
		})
	})

  //generate the HTML render text, based on charStyles
  var finalHTML = "";
  for (var i = 0; i < charStyles.length; i++) {
    var curCharStyle = charStyles[i];
    var prevCharStyle = charStyles[i-1] ? charStyles[i-1] : null;
    var curChar = text.slice(i, i+1);

    //add close span tag if the cur style is ever a change from the previous style
    if (!arraysEqual(prevCharStyle, curCharStyle)) {
      finalHTML += "</span>";
    }
    //add open span tag if the cur style is a change from the previous style and curCharStyle is non-null
    if (curCharStyle && !arraysEqual(prevCharStyle, curCharStyle)) {
      var spanHTML = "<span style='";
      curCharStyle.forEach(function(cssStyle) {//add the css styling
        //var highlightStyle = HIGHLIGHT_STYLES[highlightType];
        //spanHTML += highlightStyle.styleGenerator(highlightStyle.state); //one category at a time
        spanHTML += cssStyle;
      })
      spanHTML += ""
      spanHTML += "'>"
      finalHTML += spanHTML;
    }
    //add the char
    finalHTML += curChar
  }
  finalHTML += "</span>";
  return finalHTML;
}