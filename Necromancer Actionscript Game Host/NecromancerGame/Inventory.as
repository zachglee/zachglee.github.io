package  {
	
	import flash.display.MovieClip;
	import flash.text.TextField;
	import flash.events.*;
	
	public class Inventory extends MovieClip{
		
		public static var inventoryText:TextField = new TextField;
		public static var inventoryGrid:Array = new Array();
		public static var column:int = 0;
		public static var row:int = 0;
		public static var bonesArray:Array = new Array();
		public static var bloodArray:Array = new Array();
		public static var invRef:MovieClip = new MovieClip();
		
		public function Inventory() {
			// constructor code
			this.x = 280;
			this.y = 20;
			this.alpha = 0;
			this.addChild(inventoryText);
			inventoryText.x = 110;
			inventoryText.y = 12;
			inventoryText.wordWrap = true;
			addEventListener(MouseEvent.ROLL_OVER,mouseOnInv);
			addEventListener(MouseEvent.ROLL_OUT,mouseOffInv);
			invRef = this;
			
				for(var i1=0; i1 < 6 ; i1++){
					var innerArray:Array = new Array();
					for(var i2=0;i2 < 2 ; i2++){
						var inventoryBox:InventoryGridBox = new InventoryGridBox();
						inventoryBox.x = (i1*40)+30;
						inventoryBox.y = (i2*33)+44;
						this.addChild(inventoryBox);
						innerArray.push(inventoryBox);
					}
					inventoryGrid.push(innerArray);
				}
			}
			
		public function updateInventory(itemType:String):void{
			if(row < 2 && itemType == "Pack"){
				var pack:Pack = new Pack();
				this.addChild(pack);
				pack.x = inventoryGrid[column][row].x;
				pack.y = inventoryGrid[column][row].y;
				column += 1;
			}
			if(row < 2 && itemType == "TinderBox"){
				var tinderbox:TinderBox = new TinderBox();
				this.addChild(tinderbox);
				tinderbox.x = inventoryGrid[column][row].x;
				tinderbox.y = inventoryGrid[column][row].y;
				column += 1;
			}
			if(row < 2 && itemType == "Blood"){
				var blood:Blood = new Blood();
				this.addChild(blood);
				blood.x = inventoryGrid[column][row].x;
				blood.y = inventoryGrid[column][row].y;
				bloodArray.push(blood);
				column += 1;
			}
			if(row < 2 && itemType == "Bone"){
				var bone:Bone = new Bone();
				this.addChild(bone);
				bone.x = inventoryGrid[column][row].x;
				bone.y = inventoryGrid[column][row].y;
				bonesArray.push(bone);
				column += 1;
			}
			if(row < 2 && itemType == "Knife"){
				var knife:Knife = new Knife();
				this.addChild(knife);
				knife.x = inventoryGrid[column][row].x;
				knife.y = inventoryGrid[column][row].y;
				column += 1;
			}
			if (column == 6){
				column = 0;
				row += 1;
			}
		}
		public static function bloodBoneCombine(ingredient1:MovieClip,ingredient2:MovieClip,xPos:int,yPos:int):void{
			trace("combine")
			ingredient1.removeSelf();
			ingredient2.removeSelf();
			var bloodPotion:BloodPotion = new BloodPotion(xPos,yPos);
			invRef.addChild(bloodPotion);
		}
		public function mouseOnInv(e:MouseEvent):void{
			this.alpha = 1;
		}
		public function mouseOffInv(e:MouseEvent):void{
			this.alpha = 0;
		}
		public static function updateText(itemType:String):void{
			inventoryText.text = itemType;
		}
	}
}
