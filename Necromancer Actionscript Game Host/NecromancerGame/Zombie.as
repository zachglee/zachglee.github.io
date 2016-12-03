package  {
	
	import flash.events.Event;
	
	public class Zombie extends SummonedMinion{

		public var attackMoved:Boolean = false;

		public function Zombie(xPos:int,necromancerFacing:String) {
			// constructor code
			physArmor = 1;
			magArmor = 0;
			speed = 2;
			attack = 5;
			dmgType = "physical";
			super(xPos,necromancerFacing);
			health = 50;
			addEventListener(Event.ENTER_FRAME,zombieLoop);
		}
		public function zombieLoop(e:Event):void{
			if (this.currentLabel == "attack"){
				if(zombieAnimationAttack.currentLabel == "attackEnd"){
					attacking = false;
				}
				if(zombieAnimationAttack.currentLabel == "attackHit"){
					if(this.hitTestObject(_targetRef)){
						_targetRef.takeHit(attack,dmgType);
					}
				}
			}
			if(health <= 0){
				remove();
			}
		}
		public function remove():void{
			removeEventListener(Event.ENTER_FRAME,zombieLoop);
			//removeEventListener(Event.ENTER_FRAME,loop);
			this.parent.removeChild(this);
		}
		public function zombieAttack(targetRef):void{
			attacking = true;
			_targetRef = targetRef;
			if(!attackMoved){
				this.x += speed;
				attackMoved = true;
			}
		}
	}
}
