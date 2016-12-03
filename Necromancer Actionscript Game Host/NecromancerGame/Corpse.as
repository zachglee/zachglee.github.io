package  {
	
	import flash.display.*;
	import flash.events.*;
	
	public class Corpse extends MovieClip{
		
		public var used:Boolean = false;
		public var lootItemArray:Array = new Array("Blood","Bone","Knife","TinderBox","Pack");
		public var randomNumber : int = Math.floor(Math.random()*5);
		
		public function Corpse(xPos:int,yPos:int) {
			// constructor code
			this.x = xPos;
			this.y = yPos;
		}
		public function lootCorpse():void{
			NecroMainClass.inventoryArray.push(lootItemArray[randomNumber]);
			NecroMainClass.updateInventory(NecroMainClass.inventoryArray[NecroMainClass.inventoryArray.length - 1]);
			trace(NecroMainClass.inventoryArray);
		}
		public function removeCorpse():void{
			this.parent.removeChild(this);
		}
	}
}
