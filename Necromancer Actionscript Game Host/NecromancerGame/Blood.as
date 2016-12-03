package  {
	import flash.display.MovieClip;
	import flash.events.*;
	public class Blood extends MovieClip{
		
		public var posRefX:int;
		public var posRefY:int;
		
		public function Blood() {
			addEventListener(MouseEvent.MOUSE_OVER,mouseOn);
			addEventListener(MouseEvent.MOUSE_OUT,mouseOff);
			addEventListener(MouseEvent.MOUSE_DOWN,drag);
			addEventListener(MouseEvent.MOUSE_UP,andDrop);
		}
		public function mouseOn(e:MouseEvent):void{
			Inventory.updateText("Blood");
		}
		public function mouseOff(e:MouseEvent):void{
			Inventory.updateText("");
		}
		public function drag(e:MouseEvent):void{
			posRefX = this.x;
			posRefY = this.y;
			this.startDrag();
		}
		public function andDrop(e:MouseEvent):void{
			this.stopDrag();
			if(Inventory.bonesArray.length > 0){
				for(var i1=0 ; i1<Inventory.bonesArray.length ; i1++){
					if(this.hitTestObject(Inventory.bonesArray[i1])){
						Inventory.bloodBoneCombine(this,Inventory.bonesArray[i1],Inventory.bonesArray[i1].x,Inventory.bonesArray[i1].y);
					}else if(i1 == Inventory.bonesArray.length - 1){
						this.x = posRefX;
						this.y = posRefY;
					}
				}
			}else{
				this.x = posRefX;
				this.y = posRefY;
			}
		}
		public function removeSelf():void{
			removeEventListener(MouseEvent.MOUSE_OVER,mouseOn);
			removeEventListener(MouseEvent.MOUSE_OUT,mouseOff);
			removeEventListener(MouseEvent.MOUSE_DOWN,drag);
			removeEventListener(MouseEvent.MOUSE_UP,andDrop);
			this.parent.removeChild(this);
		}
	}
}