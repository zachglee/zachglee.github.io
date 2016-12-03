package  {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	
	public class CastleMinion extends MovieClip{
		
		public var castleMinionSpeed:int = 3;
		public var left:Boolean = true;
		public var right:Boolean = false;
		public var moveCounter:int = 0;
		public var animationState:String = "";
		public var health:int = 100;
		public var physArmor:int = 2;
		public var magArmor:int = 2;
		public var attacking:Boolean = false;
		public var _targetRef:MovieClip;
		
		public function CastleMinion(xPos,yPos) {
			// constructor code
			this.x = xPos;
			this.y = yPos;
			addEventListener(Event.ENTER_FRAME,castleMinionLoop);
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
			if(health <= 0){
				removeCastleMinion();
			}
		}
		public function castleMinionLoop(e:Event):void{
			if(left && !attacking){
				this.x -= castleMinionSpeed;
				moveCounter += 1;
				if(moveCounter >= 100){
					moveCounter = 0;
					left = false;
					right = true;
					this.scaleX = -1;
				}
			}
			if (this.currentLabel == "attack"){
				if(castleMinionAnimationAttack.currentLabel == "attackEnd"){
					attacking = false;
				}
				if(castleMinionAnimationAttack.currentLabel == "attackHit"){
					if(this.hitTestObject(_targetRef)){
						_targetRef.takeHit(10,"physical");
					}
				}
			}
			if(right && !attacking){
				this.x += castleMinionSpeed;
				moveCounter += 1;
				if(moveCounter >= 100){
					moveCounter = 0;
					left = true;
					right = false;
					this.scaleX = 1;
				}
			}
			if(attacking){
				animationState = "attack";
			}else{
				animationState = "lope";
			}
			if (this.currentLabel != animationState){
				this.gotoAndStop(animationState);
			}
		}
		public function removeCastleMinion():void{
			removeEventListener(Event.ENTER_FRAME,castleMinionLoop);
			this.parent.removeChild(this);
		}
		public function castleMinionAttack(targetRef):void{
			attacking = true;
			_targetRef = targetRef;
		}
	}
	
}
