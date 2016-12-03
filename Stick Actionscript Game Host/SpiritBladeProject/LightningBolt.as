package  {
	import flash.display.MovieClip;
	import flash.events.Event;
	public class LightningBolt extends MovieClip{
		public var boltAge:int = 0;
		public function LightningBolt(wizard:Wizard,wizardFacing:String,lightningBoltPower:int) {
			// constructor code
			if(wizardFacing == "right"){
				this.x = wizard.x;
			}
			if(wizardFacing == "left"){
				this.x = wizard.x;
				this.scaleX = -1;
			}
			this.y = wizard.y - 30;
			trace(lightningBoltPower);
			addEventListener(Event.ENTER_FRAME,lightningBoltLoop);
		}
		public function removeLightningBolt():void {
    		this.removeEventListener(Event.ENTER_FRAME,lightningBoltLoop);
			this.parent.removeChild(this);
		}
		public function lightningBoltLoop(e:Event):void{
			boltAge += 1;
			if(boltAge >= 4){
				this.removeLightningBolt();
			}
		}

	}
	
}
