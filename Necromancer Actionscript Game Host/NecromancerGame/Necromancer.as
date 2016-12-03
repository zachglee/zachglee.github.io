package  {
	
	import flash.events.*;
	import flash.display.*;
	import flash.ui.Keyboard;
	
	public class Necromancer extends MovieClip{
		
		public static var necromancerFacing:String = "right";
		public var leftPressed:Boolean = false;
		public var rightPressed:Boolean = false;
		public var animationState:String = "idle";
		public static var touchingCorpse:Boolean = false;
		public var spiritSummoning:Boolean =  false;
		public var charmSummoning:Boolean = false;
		public var intimidationSummoning:Boolean = false;
		public var forceSummoning:Boolean = false;
		public static var spiritProgress:int = 0;
		public var spiritResistance:int = 0;
		public static var necroExperience:int = 0;
		public static var experienceLimit:int = 3;
		public static var necroLevel:int = 0;
		public static var necroSkillPoints:int = 0;
		public static var minionSummoning:Boolean = false;
		public var zombieSummoning:Boolean = false;
		public var ghoulSummoning:Boolean = false;
		public var ghostSummoning:Boolean = false;
		public static var minionProgress:int = 0;
		public var looting:Boolean = false;
		public static var lootProgress:int = 0;
		
		public function Necromancer(){
			this.x = 65;
			this.y = 355;
			addEventListener(Event.ENTER_FRAME,necromancerLoop);
			addEventListener(Event.ADDED_TO_STAGE,necromancerToStage);
		}

		private function necromancerToStage(e:Event):void{
			stage.addEventListener(KeyboardEvent.KEY_DOWN,necromancerKeyDownHandler);
			stage.addEventListener(KeyboardEvent.KEY_UP,necromancerKeyUpHandler);
		}
		public function necromancerKeyDownHandler(e:KeyboardEvent):void{
			if(e.keyCode == Keyboard.LEFT){
				leftPressed = true;
				this.scaleX = -1;
				necromancerFacing = "left";
			}
			if(e.keyCode == Keyboard.RIGHT){
				rightPressed = true;
				this.scaleX = 1;
				necromancerFacing = "right";
			}
			if(NecroMainClass.corpseTouchingArray.length > 0 && NecroMainClass.corpseTouchingArray[0].used == false){
				if(e.keyCode == Keyboard.A){
					//summon spirit
					spiritSummoning = true;
					minionSummoning = false;
					looting = false;
					//trace("spirit");
				}
				if(e.keyCode == Keyboard.S){
					//raise minion
					minionSummoning = true;
					spiritSummoning = false;
					looting = false;
					//trace("minion");
				}
				if(e.keyCode == Keyboard.D){
					//loot
					looting = true;
					minionSummoning = false;
					spiritSummoning = false;
				}
			}
			if(NecroMainClass.corpseTouchingArray.length > 0 && spiritSummoning && !minionSummoning && NecroMainClass.corpseTouchingArray[0].used == false){
				if(e.keyCode == Keyboard.Q){
					//charm
					charmSummoning = true;
					intimidationSummoning = false;
					forceSummoning = false;
				}
				if(e.keyCode == Keyboard.W){
					//intimidation
					intimidationSummoning = true;
					forceSummoning = false;
					charmSummoning = false;
				}
				if(e.keyCode == Keyboard.E){
					//force
					forceSummoning = true;
					charmSummoning = false;
					intimidationSummoning = false;
				}
			}else{
				charmSummoning = false;
				intimidationSummoning = false;
				forceSummoning = false;
			}
			if(NecroMainClass.corpseTouchingArray.length > 0 && minionSummoning && !spiritSummoning && NecroMainClass.corpseTouchingArray[0].used == false){
				if(e.keyCode == Keyboard.Q){
					//zombie
					zombieSummoning = true;
					ghostSummoning = false;
					ghoulSummoning = false;
				}
				if(e.keyCode == Keyboard.W){
					//ghost
					ghostSummoning = true;
					ghoulSummoning = false;
					zombieSummoning = false;
				}
				if(e.keyCode == Keyboard.E){
					//ghoul
					ghoulSummoning = true;
					zombieSummoning = false;
					ghostSummoning = false;
				}
			}else{
				zombieSummoning = false;
				ghostSummoning = false;
				ghoulSummoning = false;
			}
		}
		public function necromancerKeyUpHandler(e:KeyboardEvent):void{
			if(e.keyCode == Keyboard.LEFT){
				leftPressed = false;
			}
			if(e.keyCode == Keyboard.RIGHT){
				rightPressed = false;
			}
			if(e.keyCode == Keyboard.Q){
				//charm
				charmSummoning = false;
				zombieSummoning = false;
			}
			if(e.keyCode == Keyboard.W){
				//intimidation
				intimidationSummoning = false;
				ghostSummoning = false;
			}
			if(e.keyCode == Keyboard.E){
				//force
				forceSummoning = false;
				ghoulSummoning = false;
			}
			if(e.keyCode == Keyboard.D){
				//unloot
				looting = false;
			}
		}
		public static function addExp():void{
			necroExperience += 1;
			if(necroExperience >= experienceLimit){
				necroLevel += 1;
				experienceLimit += 3;
				necroSkillPoints += 1;
			}
		}
		public function necromancerLoop(e:Event){
			if(charmSummoning){
				spiritProgress += 2;
			}
			if(intimidationSummoning){
				spiritProgress += 5;
			}
			if(forceSummoning){
				spiritProgress += 10;
			}
			if(spiritProgress > 0){
				spiritProgress -= 1;
			}
			if(spiritProgress >= 300){
				spiritProgress = 0;
				spiritSummoning = false;
				if(intimidationSummoning){
					spiritResistance = 1;
				}
				if(forceSummoning){
					spiritResistance = 2;
				}
				NecroMainClass.addSummonedSpirit(NecroMainClass.corpseTouchingArray[0],spiritResistance);
				NecroMainClass.corpseTouchingArray[0].used = true;
				//NecroMainClass.corpseArray.splice(NecroMainClass.corpseTouchingArray[0])
			}
			
			if(zombieSummoning || ghostSummoning || ghoulSummoning){
				minionProgress += 2;
			}
			if(minionProgress > 0){
				minionProgress -= 1;
			}
			if(minionProgress >= 100){
				minionProgress = 0;
				if(zombieSummoning){
					NecroMainClass.addSummonedZombie(NecroMainClass.corpseTouchingArray[0],necromancerFacing);
					NecroMainClass.corpseTouchingArray[0].used = true;
					NecroMainClass.corpseTouchingArray[0].removeCorpse();
				}
				if(ghostSummoning){
					NecroMainClass.addSummonedGhost(NecroMainClass.corpseTouchingArray[0],necromancerFacing);
					NecroMainClass.corpseTouchingArray[0].used = true;
				}
				if(ghoulSummoning){
					NecroMainClass.addSummonedGhoul(NecroMainClass.corpseTouchingArray[0],necromancerFacing);
					NecroMainClass.corpseTouchingArray[0].used = true;
					NecroMainClass.corpseTouchingArray[0].removeCorpse();
				}
				minionSummoning = false;
			}
			if(looting && NecroMainClass.corpseTouchingArray[0].used == false){
				lootProgress += 1;
			}
			if(!looting){
				lootProgress = 0;
			}
			if(lootProgress >= 100){
				NecroMainClass.corpseTouchingArray[0].lootCorpse()
				lootProgress = 0;
				NecroMainClass.corpseTouchingArray[0].used = true;
			}
			if(leftPressed || rightPressed){
				animationState = "walking";
			}else{
				animationState = "idle";
			}
			if (this.currentLabel != animationState){
				this.gotoAndStop(animationState);
			}
		}
	}
}