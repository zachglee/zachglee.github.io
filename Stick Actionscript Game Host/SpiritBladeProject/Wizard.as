package  {
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	import flash.display.Stage;
	public class Wizard extends MovieClip {
		
		public static var leftPressed:Boolean = false;
		public static var rightPressed:Boolean = false;
		public static var wizardSpeed:int = 5;
		public static var fireBallCount:int = 0;
		public static var fireBallStored:int = 3;
		public static var lightningBoltPower:int = 0;
		public static var lightningBoltStored:int = 3;
		public static var lightningBoltCount:int = 0;
		public static var lightningBoltCharging:Boolean = false;
		public static var wizardFacing:String = "right";
		public static var fireBallsArray:Array = new Array;
		
		public function Wizard() {
			this.x = 38;
			this.y = 351;
			addEventListener(Event.ENTER_FRAME,wizardLoop);
			addEventListener(Event.ADDED_TO_STAGE,wizardToStage);
		}
		
		private function wizardToStage(e:Event):void{
			stage.addEventListener(KeyboardEvent.KEY_DOWN,wizardKeyDownHandler);
			stage.addEventListener(KeyboardEvent.KEY_UP,wizardKeyUpHandler);
		}
		
		public function wizardKeyDownHandler(e:KeyboardEvent):void{
			if(e.keyCode == Keyboard.LEFT){
				leftPressed = true;
				this.scaleX = -1;
				wizardFacing = "left";
			}
			if(e.keyCode == Keyboard.RIGHT){
				rightPressed = true;
				this.scaleX = 1;
				wizardFacing = "right";
			}
			if(e.keyCode == Keyboard.A){
				if(fireBallCount < fireBallStored){
					var fireBall:FireBall = new FireBall(this,wizardFacing);
					stage.addChild(fireBall);
					fireBallCount += 1;
				}
			}
			if(e.keyCode == Keyboard.S){
				if(lightningBoltCount < lightningBoltStored){
					lightningBoltCharging = true;
				}
			}
		}
		
		public function wizardKeyUpHandler(e:KeyboardEvent):void{
			if(e.keyCode == Keyboard.LEFT){
				leftPressed = false;
			}
			if(e.keyCode == Keyboard.RIGHT){
				rightPressed = false;
			}
			if(e.keyCode == Keyboard.S){
				if(lightningBoltCount < lightningBoltStored){
					var lightningBolt:LightningBolt = new LightningBolt(this,wizardFacing,lightningBoltPower)
					stage.addChild(lightningBolt);
					lightningBoltCharging = false;
					lightningBoltPower = 0;
					lightningBoltCount += 1;
				}
			}
		}
		
		public function wizardLoop(e:Event):void{
			if(leftPressed){
				this.x -= wizardSpeed;
			}
			if(rightPressed){
				this.x += wizardSpeed
			}
			if(lightningBoltCharging){
				lightningBoltPower += 1;
			}
		}

	}
	
}
