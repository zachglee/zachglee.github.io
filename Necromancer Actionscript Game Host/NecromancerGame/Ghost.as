package  {
	
	import flash.display.*;
	import flash.events.*;
	
	public class Ghost extends SummonedMinion{

		public var attackMoved:Boolean = false;
		public var fading:Boolean = false;

		public function Ghost(xPos,necromancerFacing:String) {
			// constructor code
			physArmor = 8;
			magArmor = -5;
			speed = 3;
			attack = 3;
			dmgType = "magical"
			super(xPos,necromancerFacing);
			health = 15;
			addEventListener(Event.ENTER_FRAME,ghostLoop);
		}
		public function ghostLoop(e:Event):void{
			if (this.currentLabel == "attack"){
				if(ghostAnimationAttack.currentLabel == "attackEnd"){
					attacking = false;
				}
				if(ghostAnimationAttack.currentLabel == "attackHit"){
					if(this.hitTestObject(_targetRef)){
						_targetRef.takeHit(attack,dmgType);
					}
				}
			}
			if(health <= 0){
				remove();
			}
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
		}
		public function remove():void{
			removeEventListener(Event.ENTER_FRAME,ghostLoop);
			this.parent.removeChild(this);
		}
		public function ghostAttack(targetRef):void{
			attacking = true;
			_targetRef = targetRef;
			if(!attackMoved){
				this.x += speed;
				attackMoved = true;
			}
		}
	}
	
}
