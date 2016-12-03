package  {
	
	import flash.display.*;
	import flash.events.*;
	
	public class SummonedSpirit extends MovieClip{
		
		private var fading:Boolean = false;
		private var rising:Boolean = true
		public var _spiritResistance:int;
		private var spoken:Boolean = false;
		
		public function SummonedSpirit(xPos,spiritResistance) {
			// constructor code
			this.x = xPos;
			this.y = -5;
			this.alpha = 0;
			_spiritResistance = spiritResistance;
			addEventListener(Event.ENTER_FRAME,summonedSpiritLoop);
			this.addEventListener(MouseEvent.CLICK,spiritTalk);
		}
		public function summonedSpiritLoop(e:Event):void{
			if(!fading){
				this.alpha += 0.03;
			}
			if(fading){
				this.alpha -= 0.03;
			}
			if(this.alpha >= 1){
				fading = true;
			}
			if(this.alpha <= 0.5){
				fading = false;
			}
			if(rising){
				this.y -= 0.2;
			}
			if(!rising){
				this.y += 0.2;
			}
			if(this.y <= -10){
				rising = false;
			}
			if(this.y >= 0){
				rising = true;
			}
		}
		public function spiritTalk(e:MouseEvent):void{
			if(!spoken){
				var dialogueBox:DialogueBox = new DialogueBox(_spiritResistance);
				stage.addChild(dialogueBox);
				spoken = true;
			}
		}
	}
	
}
