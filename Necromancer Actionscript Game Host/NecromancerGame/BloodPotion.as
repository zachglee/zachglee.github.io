package  {
	import flash.display.MovieClip;
	public class BloodPotion extends InventoryItem{

		public function BloodPotion(xPos:int,yPos:int) {
			// constructor code
			this.x = xPos;
			this.y = yPos;
			super();
			thisName = "Blood Potion";
		}
	}
}
