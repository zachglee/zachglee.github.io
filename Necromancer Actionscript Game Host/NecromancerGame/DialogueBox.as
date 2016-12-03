package  {
	
	import flash.display.*;
	import flash.events.*;
	import flash.text.*;
	
	public class DialogueBox extends MovieClip{
		public static var civilianDeath1:String = "Zombies slow, but they can take a decent amount of punishment.";
		public static var civilianDeath2:String = "Ghouls are fast and deadly, but a few solid hits will do them in.";
		public static var civilianDeath3:String = "Ghosts can seldom be harmed by the sword. Fight magic with magic I say; Ghosts go down easy to mages.";
		
		public static var wisdom1:String = "A man who won't die for something is not fit to live.";
		public static var wisdom2:String = "All our knowledge merely helps us to die a more painful death than animals who know nothing.";
		public static var wisdom3:String = "Death is a very dull, dreary affair, and my advice to you is to have nothing whatsoever to do with it.";
		
		public var option1Clicked:Boolean = false;
		public var option2Clicked:Boolean = false;
		public var option3Clicked:Boolean = false;
		
		public static var civilianHowDieArray:Array = new Array(civilianDeath1,civilianDeath2,civilianDeath3);
		public static var wisdomOfTheDeadArray:Array = new Array(wisdom1,wisdom2,wisdom3);
		
		public static var civilianDeathCount:int = 0;
		public static var deadWisdomCount:int = 0;
		
		public var questionsLeft:int;
		public static var option1Text:TextField = new TextField;
		public static var option2Text:TextField = new TextField;
		public static var option3Text:TextField = new TextField;
		public static var replyText:TextField = new TextField;
		option3Text.background = true;
		option3Text.backgroundColor = 111111;
		option3Text.text = "Goodbye.";
		
		option2Text.background = true;
		option2Text.backgroundColor = 111111;
		option2Text.text = "Wisdom of the Dead";
		
		option1Text.background = true;
		option1Text.backgroundColor = 111111;
		option1Text.text = "Advice";
		
		replyText.wordWrap = true;
		public function DialogueBox(spiritResistance:int) {
			// constructor code
			if(spiritResistance == 0){
				replyText.text = "Greetings... Why have you summoned me?"
				questionsLeft = 3;
			}
			if(spiritResistance == 1){
				replyText.text = "What is it you want? I have little patience for your kind."
				questionsLeft = 2;
			}
			if(spiritResistance == 2){
				replyText.text = "Curse you, foul Necromancer! Can you not leave me to my rest?"
				questionsLeft = 1;
			}
			if(this) init();
			else addEventListener(Event.ADDED_TO_STAGE, init)
		}
		private function init(e:Event = null):void{
			this.x = 200;
			this.y = 200;
			this.addChild(option3Text);
			this.addChild(option2Text);
			this.addChild(option1Text);
			this.addChild(replyText);
			option3Text.x = -70;
			option3Text.y = -50;
			option3Text.width = 140;
			option3Text.height = 20;
			
			option2Text.x = -70;
			option2Text.y = -75;
			option2Text.width = 140;
			option2Text.height = 20;
			
			option1Text.x = -70;
			option1Text.y = -100;
			option1Text.width = 140;
			option1Text.height = 20;
			
			replyText.x = -70;
			replyText.y = -20;
			replyText.width = 145;
			replyText.height = 100;
			
			option1Text.addEventListener(MouseEvent.CLICK,option1Click);
			option2Text.addEventListener(MouseEvent.CLICK,option2Click);
			option3Text.addEventListener(MouseEvent.CLICK,option3Click);
		}
		public function option1Click(e:MouseEvent):void{
			if(!option1Clicked){
				replyText.text = civilianHowDieArray[civilianDeathCount];
				civilianDeathCount += 1;
				questionsLeft -= 1;
				if (questionsLeft <= 0){
					option2Clicked = true;
					option1Clicked = true;
				}
				//option1Clicked = true;
			}
		}
		public function option2Click(e:MouseEvent):void{
			if(!option2Clicked){
				replyText.text = wisdomOfTheDeadArray[deadWisdomCount]+"(+1 Experience)";
				Necromancer.addExp();
				deadWisdomCount += 1;
				questionsLeft -= 1;
				if (questionsLeft <= 0){
					option2Clicked = true;
					option1Clicked = true;
				}
				option2Clicked = true;
			}
		}
		public function option3Click(e:MouseEvent):void{
			removeDialogueBox();
		}
		public function removeDialogueBox():void{
			this.parent.removeChild(this);
			option1Text.removeEventListener(MouseEvent.CLICK,option1Click);
			option2Text.removeEventListener(MouseEvent.CLICK,option2Click);
			option3Text.removeEventListener(MouseEvent.CLICK,option3Click);
			//this.visible = false;
		}
	}
	
}
