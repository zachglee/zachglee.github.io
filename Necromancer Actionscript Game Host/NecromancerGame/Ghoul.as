package  {
	
	import flash.events.*;
	
	public class Ghoul extends SummonedMinion{

		public var attackMoved:Boolean = false;

		public function Ghoul(xPos,necromancerFacing:String) {
			// constructor code
			physArmor = 0;
			magArmor = 0;
			speed = 4;
			attack = 10;
			dmgType = "physical"
			super(xPos,necromancerFacing);
			health = 25;
			addEventListener(Event.ENTER_FRAME,ghoulLoop);
		}
		public function ghoulLoop(e:Event):void{
			if (this.currentLabel == "attack"){
				if(ghoulAnimationAttack.currentLabel == "attackEnd"){
					attacking = false;
				}
				if(ghoulAnimationAttack.currentLabel == "attackHit"){
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
			removeEventListener(Event.ENTER_FRAME,ghoulLoop);
			this.parent.removeChild(this);
		}
		public function ghoulAttack(targetRef):void{
			attacking = true;
			_targetRef = targetRef;
			if(!attackMoved){
				this.x += speed;
				attackMoved = true;
			}
		}
	}
	
}
