package  {
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.MouseEvent;
	public class SummonedMinion extends MovieClip{
		
		public var speed:int = 0;
		public var health:int = 1;
		public var physArmor:int = 0;
		public var magArmor:int = 0;
		public var attacking:Boolean = false;
		public var animationState:String = "";
		public var _targetRef:MovieClip;
		public var attack:int;
		public var dmgType:String;
		//public var halted:Boolean = false;
		
		public function SummonedMinion(xPos:int,necromancerFacing:String) {
			// constructor code
			this.x = xPos;
			this.y = 110;
			if(necromancerFacing == "left"){
				speed *= -1;
				this.scaleX = -1;
			}
			this.addEventListener(Event.ENTER_FRAME,loop);
		}
		public function loop(e:Event):void{
			if(animationState != "attack"){
				this.x += speed;
			}
			if(attacking){
				animationState = "attack";
			}else{
				animationState = "walk";
			}
			if (this.currentLabel != animationState){
				this.gotoAndStop(animationState);
			}
		}
		public function takeHit(dmg:int,type:String):void{
			if(type == "physical"){
				dmg -= physArmor;
			}
			if(type == "magical"){
				dmg -= magArmor;
			}
			health -= dmg;
			trace(health);
		}
		//public function halt(e:MouseEvent):void{
			//if(!halted){
				//halted = true;
			//}else if(halted){
				//halted = false;
			//}
		//}
	}
}
