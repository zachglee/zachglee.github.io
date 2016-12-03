package  {
	
	import flash.display.*;
	import flash.events.*;
	import flash.ui.Keyboard
	
	public class Background extends MovieClip{
		
		public var leftMoving:Boolean = false;
		public var rightMoving:Boolean = false;
		public var backSpeed:int = 6;
		
		public function Background() {
			// constructor code
			this.x = 1008;
			this.y = 246;
			addEventListener(Event.ENTER_FRAME,backLoop);
			addEventListener(Event.ADDED_TO_STAGE,backToStage);
		}
		private function backToStage(e:Event):void{
			stage.addEventListener(KeyboardEvent.KEY_DOWN,backKeyDownHandler);
			stage.addEventListener(KeyboardEvent.KEY_UP,backKeyUpHandler);
		}
		public function backKeyDownHandler(e:KeyboardEvent):void{
			if(e.keyCode == Keyboard.LEFT){
				leftMoving = true;
			}
			if(e.keyCode == Keyboard.RIGHT){
				rightMoving = true;
			}
		}
		public function backKeyUpHandler(e:KeyboardEvent):void{
			if(e.keyCode == Keyboard.LEFT){
				leftMoving = false;
			}
			if(e.keyCode == Keyboard.RIGHT){
				rightMoving = false;
			}
		}
		public function backLoop(e:Event):void{
			if(leftMoving){
				this.x += backSpeed;
			}
			if(rightMoving){
				this.x -= backSpeed;
			}
		}
	}
}
