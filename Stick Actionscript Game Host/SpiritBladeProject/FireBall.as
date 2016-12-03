package  {
	import flash.display.MovieClip
	import flash.events.Event
	public class FireBall extends MovieClip {
		public var fireBallSpeed:int = 10;
		public function FireBall(wizard:Wizard,wizardFacing:String) {
			if(wizardFacing == "right"){
				this.x = wizard.x;
				fireBallSpeed = 10;
			}
			if(wizardFacing == "left"){
				this.x = wizard.x;
				this.scaleX = -1;
				fireBallSpeed = -10;
			}
			addEventListener(Event.ENTER_FRAME,fireBallLoop);
			this.y = wizard.y-30;
			Wizard.fireBallsArray.push(this);
		}
		public function fireBallLoop(e:Event):void{
			this.x += fireBallSpeed
			if (this.x > 550 || this.x < 0){
				var fireBallIndex = Wizard.fireBallsArray.indexOf(this);
				removeFireBall(fireBallIndex);
			}
		}
		public function removeFireBall(fireBallIndex:int):void {
    		removeEventListener(Event.ENTER_FRAME, fireBallLoop);
    		this.parent.removeChild(this);
			Wizard.fireBallsArray.splice(fireBallIndex,1);
		}


	}
	
}
