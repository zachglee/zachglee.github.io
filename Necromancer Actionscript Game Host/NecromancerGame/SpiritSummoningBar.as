package  {
	
	import flash.display.*;
	import flash.events.*;
	
	public class SpiritSummoningBar extends MovieClip{
		var max:int = 100;
		var current:int = 0;
		var percent:Number = current/max;
		public function SpiritSummoningBar() {
			// constructor code
			this.x = 7;
			this.y = 7;
			this.addEventListener(Event.ENTER_FRAME,updateBar);
		}
		public function updateBar(e:Event):void{
			current = Necromancer.spiritProgress;
			percent = current/max;
			this.scaleX = percent;
		}

	}
	
}

