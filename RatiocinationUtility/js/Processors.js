//PROCESSORS

// -------- S T A T S -------- //

var statSentenceLengthDistribution = function(text, rcReport) {
  //Map of Int -> Percentage
  //rcReport.stats.sentenceLengthDistribution
  var sld = {}; //sld = sentence length distribution
  rcReport.stats["sentenceLengthDistribution"] = sld;
  var sentences = text.split(/[.;!?]+[\s]+/).forEach(function(sentence) {
    //count words in sentence
    var words = sentence.split(/\W+/);
    //increase the count of sentences that have this many words by 1 (or set it to 1 if we had no entry previously)
    if (!sld[words.length.toString()]) {
      sld[words.length.toString()] = 1;
    } else {
      sld[words.length.toString()] += 1;
    }
  });

}

// -------- H I G H L I G H T E R S -------- //

var getBannedWords = function(text, rcReport) {
  //get all the words
  var words = text.match(/\w+/);

  rcReport.highlights["bannedWord"] = [];

  //BANNED_WORDS is defined in the Configuration.js file
  for (var i = 0; i < BANNED_WORDS.length; i++) {
    var curWord = BANNED_WORDS[i];

    var startSearchHere = 0;
    var foundIdx = text.toLowerCase().regexIndexOf(new RegExp("\\b" + curWord + "\\b"), startSearchHere);
    while (foundIdx >= 0) {
      var substringIndices = {begin: foundIdx, end: foundIdx + curWord.length, text: text.slice(foundIdx, foundIdx + curWord.length)};
      rcReport.highlights["bannedWord"].push(substringIndices);
      startSearchHere = foundIdx + curWord.length;
      foundIdx = text.toLowerCase().regexIndexOf(new RegExp("\\b" + curWord + "\\b"), startSearchHere);
    }
  }

}

var getSentences = function(text, rcReport) {
	rcReport.highlights["sentence"] = [];
	var sentences = text.split(/[.;!?]+[\s]+/).forEach(function(sentence) {
		var beginIdx = text.indexOf(sentence);
		var endIdx = beginIdx + sentence.length;
		var substringIndices = {begin: beginIdx, end: endIdx, text: sentence};
		rcReport.highlights["sentence"].push(substringIndices);
	});
}

var getFirstWordOfSentences = function(text, rcReport) {
	rcReport.highlights["firstWordOfSentence"] = [];
	
var sentences = text.split(/[.;!?]+[\s]+/).forEach(function(sentence) {
		var beginIdx = text.indexOf(sentence);
		var words = sentence.split(/\W+/);
		if (words.length > 0) {
			var firstWord = words[0];
			var substringIndices = {begin: beginIdx, end: beginIdx+firstWord.length, text: firstWord};
			rcReport.highlights["firstWordOfSentence"].push(substringIndices);
		}
	});
}

var getToBeWords = function(text, rcReport) {
	rcReport.highlights["toBeWord"] = [];
	var TO_BE_WORDS = ["is", "are", "am", "was", "were", "be"]

	for (var i = 0; i < TO_BE_WORDS.length; i++) {
		var curWord = TO_BE_WORDS[i];

		var startSearchHere = 0;
		var foundIdx = text.toLowerCase().regexIndexOf(new RegExp("\\b" + curWord + "\\b"), startSearchHere);
		while (foundIdx >= 0) {
			var substringIndices = {begin: foundIdx, end: foundIdx + curWord.length, text: text.slice(foundIdx, foundIdx + curWord.length)};
			rcReport.highlights["toBeWord"].push(substringIndices);
			startSearchHere = foundIdx + curWord.length;
			foundIdx = text.toLowerCase().regexIndexOf(new RegExp("\\b" + curWord + "\\b"), startSearchHere);
		}
	}
}