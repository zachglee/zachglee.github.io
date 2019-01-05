//A Processor is a function: String RatiocinationReport -> Side Effect
// - RatiocinationReport gets modified with the new info this processing provides
// - The String is the raw text to process (does not modify text)

//A RatiocinationReport has a:
// - rawText
// - map of [category of highlight] -> [substring indices]
// - stats object

//Ratiocinator
// - has a bunch of processors which are [Text -> Side Effect on the produced RatiocinationReport]

class Ratiocinator {
	constructor(processors) {
		this.processors = processors;
	}

	//return a RatiocinationReport of the given text, processed with this Ratiocinator's processors
	getRatiocinationReport(text) {
		var ratiocinationReport = {
			rawText: text, //the raw text that was processed
			highlights: {}, //map describing what sections are highlighted and for what reasons
			stats: {}
		}
		for (var i = 0; i < this.processors.length; i++) {
			this.processors[i](text, ratiocinationReport);
		}
		return ratiocinationReport;
	}
}