package  {
	import flash.display.MovieClip;
	import flash.events.*;
	public class InventoryItem extends MovieClip{
		
		public var thisName:String;
		
		public function InventoryItem() {
			// constructor code
			addEventListener(MouseEvent.MOUSE_OVER,mouseOn);
			addEventListener(MouseEvent.MOUSE_OUT,mouseOff);
		}
		public function mouseOn(e:MouseEvent):void{
			Inventory.updateText(thisName);
		}
		public function mouseOff(e:MouseEvent):void{
			Inventory.updateText("");
		}
	}
	
}
