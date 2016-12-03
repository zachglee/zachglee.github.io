package  {
	
	import flash.display.*;
	import flash.events.*;
	import flash.ui.Keyboard
	
	public class Parallax extends MovieClip{
		
		public var leftMoving:Boolean = false;
		public var rightMoving:Boolean = false;
		public var parallaxSpeed:int = 2;
		
		public function Parallax() {
			// constructor code
			this.x = 300;
			this.y = 283;
			addEventListener(Event.ENTER_FRAME,parallaxLoop);
			addEventListener(Event.ADDED_TO_STAGE,parallaxToStage);
		}
		private function parallaxToStage(e:Event):void{
			stage.addEventListener(KeyboardEvent.KEY_DOWN,parallaxKeyDownHandler);
			stage.addEventListener(KeyboardEvent.KEY_UP,parallaxKeyUpHandler);
		}
		public function parallaxKeyDownHandler(e:KeyboardEvent):void{
			if(e.keyCode == Keyboard.LEFT){
				leftMoving = true;
			}
			if(e.keyCode == Keyboard.RIGHT){
				rightMoving = true;
			}
		}
		public function parallaxKeyUpHandler(e:KeyboardEvent):void{
			if(e.keyCode == Keyboard.LEFT){
				leftMoving = false;
			}
			if(e.keyCode == Keyboard.RIGHT){
				rightMoving = false;
			}
		}
		public function parallaxLoop(e:Event):void{
			if(leftMoving){
				this.x += parallaxSpeed;
			}
			if(rightMoving){
				this.x -= parallaxSpeed;
			}
		}
	}
}
