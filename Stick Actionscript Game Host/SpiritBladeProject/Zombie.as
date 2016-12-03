package  {
	import flash.display.MovieClip;
	import flash.events.Event;
	public class Zombie extends MovieClip{
		public var zombieSpeed:int = -1;
		public static var zombieLife:int = 100;
		public function Zombie(wizard:Wizard) {
			// constructor code
			this.x = 500;
			this.y = 351;
			addEventListener(Event.ENTER_FRAME,zombieLoop);
		}
		public function zombieLoop(e:Event):void{
			this.x += zombieSpeed
		}
		public function zombieTakeHit(hitType:String,zombieIndex:int):void{
			if (hitType == "fireBall"){
				zombieLife -= 50;
			}
			if (hitType == "lightningBolt"){
				
			}
			if(zombieLife <= 0){
				removeZombie(zombieIndex);
			}
		}
		public function removeZombie(zombieIndex:int):void{
			removeEventListener(Event.ENTER_FRAME, zombieLoop);
    		this.parent.removeChild(this);
			MainClass.zombiesArray.splice(zombieIndex,1)
		}

	}
	
}
