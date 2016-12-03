package
{
	import flash.display.MovieClip;
	import flash.events.Event;

	public class StandardEnemy extends MovieClip
	{
		private var life:int = 3;
		
		public function StandardEnemy(xLocation:int, yLocation:int)
		{
			// constructor code
			x = xLocation;
			y = yLocation;
			stop();

			addEventListener(Event.ENTER_FRAME, loop);
		}

		public function loop(e:Event):void{
			if(currentLabel == "dead"){
				removeSelf();
			}
		}
		
		public function takeHit():void
		{
			if(life <= 0){
				this.gotoAndPlay("dying");
			}else{
				life -= 1;
			}
		}

		public function removeSelf():void
		{
				removeEventListener(Event.ENTER_FRAME, loop); //stop the loop
				this.parent.removeChild(this); //tell this object's "parent object" to remove this object
		}

	}

}
