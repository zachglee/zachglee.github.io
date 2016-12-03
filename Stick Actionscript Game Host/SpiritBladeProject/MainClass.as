package  {
	import flash.events.*;
	import flash.events.KeyboardEvent;
	import flash.display.*;
	import flash.utils.Timer;

	public class MainClass extends Sprite{
		
		public static var zombiesArray:Array = new Array;
		var wizard:Wizard = new Wizard;
		
		public function MainClass() {
			// constructor code
			if(stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init)
		}
		function init(e:Event = null):void{
			removeEventListener(Event.ADDED_TO_STAGE, init);
			var zombieTimer:Timer = new Timer(1000,10);
			zombieTimer.addEventListener(TimerEvent.TIMER,addZombie);
			zombieTimer.start();
			
			stage.addChild(wizard);
			stage.addEventListener(Event.ENTER_FRAME,mainLoop);
		}
		
		function addZombie(e:TimerEvent =null):void{
			var zombie:Zombie = new Zombie(wizard);
			//zombie.instance = zombie;
			stage.addChild(zombie);
			zombiesArray.push(zombie)
		}
		function mainLoop(e:Event):void{
			for(var i1=0 ; i1<zombiesArray.length ; i1++){
				for(var i2=0 ; i2<Wizard.fireBallsArray.length ; i2++){
					if(Wizard.fireBallsArray[i2].hitTestObject(zombiesArray[i1])){
						zombiesArray[i1].zombieTakeHit("fireBall",i1);
						Wizard.fireBallsArray[i2].removeFireBall(i2);
					}
 				}
				for(var i3=0 ; i3<Wizard.LightningBoltArray.length ; i3++){
					if(Wizard.lightningBoltArray[i3].hitTestObject(zombiesArray[i1])){
						zombiesArray[i1].zombieTakeHit("lightningBolt",i3);
						Wizard.lightningBoltArray[i3].removeLightningBolt(i3);
					}
				}
 			}
		}
	}
	
}