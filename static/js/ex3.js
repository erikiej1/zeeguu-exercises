/** Custom exercise formatching 3 words. Inherited from Exercise.js
 *  @initialize it using: new Ex3();
 *  @customize it by using prototypal inheritance 
**/

function Ex3(data,index,size){
	this.init(data,index,size);
	
	/** @Override */
	this.cacheCustomDom = function(data,index,size){
		this.$to 					= this.$elem.find("#ex-to");
		this.$context 				= this.$elem.find("#ex-content");
		this.$showSolution 			= this.$elem.find("#show_solution");
		this.$btn1 					= this.$elem.find("#btn1");
		this.$btn2 					= this.$elem.find("#btn2");
		this.$btn3 					= this.$elem.find("#btn3");	
		this.$btn4 					= this.$elem.find("#btn4");
		this.$btn5 					= this.$elem.find("#btn5");
		this.$btn6 					= this.$elem.find("#btn6");
	};
	
	//this.get = () => { return this["$btn1"]; };
	
	/** @Override */
	this.bindUIActions = function(){
		//Bind UI action of Hint/Show solution to the function		
		this.$showSolution.on("click", this.giveHint.bind(this));
		
		//Bind UI action of Check answer to the function
		//this.$checkAnswer.on("click", _this.checkAnswer.bind(this));
		
		//Bind UI action of button 1 click to the function
		this.$btn1.on("click", this.selectChoice.bind(this,1));
		
		//Bind UI action of button 2 click to the function
		this.$btn2.on("click", this.selectChoice.bind(this,2));
		
		//Bind UI action of button 3 click to the function
		this.$btn3.on("click", this.selectChoice.bind(this,3));
		
		//Bind UI action of button 4 click to the function
		this.$btn4.on("click", this.selectChoice.bind(this,4));
		
		//Bind UI action of button 5 click to the function
		this.$btn5.on("click", this.selectChoice.bind(this,5));
		
		//Bind UI action of button 6 click to the function
		this.$btn6.on("click", this.selectChoice.bind(this,6));
		
	};
	
	
	
	this.selectChoice = function(btnID){
		// if no button was previously selected, select it now
		if(this.chosenButton == -1){
			this.chosenButton = btnID;
		}else{
			// otherwise check the selection
			this.check(btnID);
		}
	};
	
	// Disables correctly selected buttons
	this.successDisableBtn = function(btnID){
		var elem = $("#btn"+btnID);
		elem.prop('disabled', true);
		elem.addClass("btn-success");
	};
	
	//Checks if a button is disabled
	this.isDisabled = function(btnID){
		var elem = $("#btn"+btnID);
		return elem.is(':disabled');
	};
	
	// Checks answers
	this.check = function(btnID){
	
		if(this.checkCondition(btnID)){
			
			// Disable buttons		
			this.successDisableBtn(btnID);
			this.successDisableBtn(this.chosenButton);
			
			this.correctAnswers ++;
			this.endExercise();
			
		}else{
			this.wrongAnswerAnimation();
		}
		this.chosenButton = -1;	
	};
	
	this.endExercise = function(){
		// check if all the answers were given
		if(this.successCondition(0)){
			// Proceed to next exercise
			this.checkAnswer(0);
			
			// Prepare the document
			this.prepareDocument();
			
			// Reset buttons, answers, hints
			this.resetBtns();
			this.correctAnswers = 0;
			this.hints = 0;
		}
	};
	
	// Checks the selected buttons
	this.checkCondition = function(btnID){
		if((answers.indexOf(btnID) == -1)|| (choices.indexOf(this.chosenButton) == -1)){
			return (choices.indexOf(btnID) == answers.indexOf(this.chosenButton));
		}else{
			return (answers.indexOf(btnID) == choices.indexOf(this.chosenButton));
		}
	};
	
	/** @Override */
	this.successCondition = function(a){
		return (this.correctAnswers >= 3); 
	};
	
	// Resets all the disabled buttons
	this.resetBtns = function(){
		for(var idx = 1; idx<=6; idx++){
			var elem = $('#btn'+idx);
			elem.prop('disabled', false);
			elem.removeClass("btn-success");
		}
	};
	
	/** @Override */
	this.next = function (){	
		this.populateButtons();
	};
	
	// Populates the buttons
	this.populateButtons = function(){	
		//Random options
		var idxs = this.randomNumsInRange(2,this.data.length-1);
		var _this = this;
		// random numbers between 1 and 3
	    choices  = this.arrayWithRandomNumsUpTo(3);
		 
		// random numbers between 4 and 6
		 answers = this.arrayWithRandomNumsUpTo(3);
		for (var i=0; i<answers.length; i++){
			answers[i] = answers[i] + 3;
		}
		
		//Populate buttons
		function match2Buttons(choice, answer, valueFrom, valueTo) {
			_this["$btn"+choice].text(valueFrom);
			_this["$btn"+answer].text(valueTo);
		}
		
		match2Buttons(choices[0],answers[0],this.data[this.index].from,this.data[this.index].to);
		match2Buttons(choices[1],answers[1],this.data[idxs[0]].from,this.data[idxs[0]].to);
		match2Buttons(choices[2],answers[2],this.data[idxs[1]].from,this.data[idxs[1]].to);
	};
	
	
	// Gives a hint by disabling a correct match
	this.giveHint = function (){
		// Only one hint is possible
		if(this.hints < 1){
			// Disable buttons
			if(this.disableHintButtons(0)) return;
			if(this.disableHintButtons(1)) return;
			if(this.disableHintButtons(2)) return;
		}
		
	};
	
	// Disables the buttons given in the hint
	this.disableHintButtons = function(idx){
		if(!this.isDisabled(answers[idx])){
			this.successDisableBtn(choices[idx]);
			this.successDisableBtn(answers[idx]);
			this.correctAnswers++;
			this.hints++;
			this.endExercise();
			return true;
		}
		return false;
	};
	
	/** Generates an array of random numbers of given size
	* @param size: defines how many random numbers we want
	*				the resulted random numbers will in the range of [1,size]
	*/
	this.arrayWithRandomNumsUpTo = function(size){
		var arr = [];	
		while(arr.length < size){
			var randomnumber = Math.ceil(Math.random()*size);	
			if((arr.indexOf(randomnumber) > -1)) continue;
			arr[arr.length] = randomnumber;
		}		
		return arr;
	};
	
	/** Generates an array of random numbers of given size
	* @param size:  defines how many random numbers we want
	* @param range: defines the upper limit of the numbers: [1,range]
	*/
	this.randomNumsInRange = function(size,range){
		var arr = [];	
		while(arr.length < size){
			var randomnumber = Math.ceil(Math.random()*range);	
			//console.log(this.index + " : " + randomnumber);
			if((arr.indexOf(randomnumber) > -1) || randomnumber==this.index) continue;
			arr[arr.length] = randomnumber;
		}		
		return arr;
	};
	
};

Ex3.prototype = Object.create(Exercise.prototype, {
	constructor: Ex3,
	/************************** SETTINGS ********************************/	
	description: {value: "Match each word with its translation"},
	customTemplateURL: {value: 'static/template/ex3.html'},
	choices: 	 { writable: true, value:[1,2,3]},				// arr of indexes of possible choices
	answers: 	{ writable: true, value:[1,2,3]},				// arr of indexes of possible answers
	chosenButton: { writable: true, value:-1},  	// ID of currently selected button; -1 means no button is selected
	correctAnswers: { writable: true, value:0},	// number of correct answers
	hints: {writable:true, value:0}				// max number of possible hints is 1
	/*******************************************************************/
});
