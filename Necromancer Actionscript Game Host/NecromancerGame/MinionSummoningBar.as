package  {
	
	import flash.display.*;
	import flash.events.*;
	
	public class MinionSummoningBar extends MovieClip{
		var max:int = 100;
		var current:int = 0;
		var percent:Number = current/max;
		public function MinionSummoningBar() {
			// constructor code
			this.x = 7;
			this.y = 18;
			this.addEventListener(Event.ENTER_FRAME,updateBar);
		}
		public function updateBar(e:Event):void{
			current = Necromancer.minionProgress;
			percent = current/max;
			this.scaleX = percent;
		}

	}
	
}