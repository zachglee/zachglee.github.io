package  {
	
	import flash.display.*;
	import flash.events.*;
	import flash.text.*;
	
	public class NecroMainClass extends Sprite{
		
		public static var back:Background = new Background;
		public static var corpseArray:Array = new Array();
		public static var necromancer:Necromancer = new Necromancer;
		public static var spiritSummoningBar:SpiritSummoningBar = new SpiritSummoningBar;
		public static var corpseTouchingArray:Array = new Array();
		public static var parallax:Parallax = new Parallax;
		public static var minionSummoningBar:MinionSummoningBar = new MinionSummoningBar;
		public static var zombiesArray:Array = new Array();
		public static var lootingBar:LootingBar = new LootingBar;
		public static var inventoryArray:Array = new Array();
		public static var inventory:Inventory = new Inventory;
		public static var ghoulsArray:Array = new Array();
		public static var castleMinionArray:Array = new Array();
		public static var ghostsArray:Array = new Array();
		
		public function NecroMainClass() {
			// constructor code
			if(stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init)
		}
		public function init(e:Event = null):void{
			removeEventListener(Event.ADDED_TO_STAGE, init);
			stage.addChild(parallax);
			stage.addChild(back);
			stage.addChild(necromancer);
			stage.addChild(spiritSummoningBar);
			stage.addChild(minionSummoningBar);
			stage.addChild(lootingBar);
			stage.addChild(inventory);
			addCorpse(-300,110);
			addCorpse(-100,110);
			addCorpse(-600,110);
			addCorpse(100,110);
			addCorpse(-850,110);
			addCastleMinion(900,30);
			addEventListener(Event.ENTER_FRAME,mainLoop);
		}
		public function mainLoop(e:Event):void{
			corpseTouchingArray = new Array();
			for(var i1=0 ; i1<corpseArray.length ; i1++){
				if(necromancer.hitTestObject(corpseArray[i1])){
					corpseTouchingArray.push(corpseArray[i1])
				}
			}
			for(var i2=0 ; i2<castleMinionArray.length ; i2++){
				for(var i3=0 ; i3<zombiesArray.length ; i3++){
					if(castleMinionArray[i2].hitTestObject(zombiesArray[i3])){
						zombiesArray[i3].zombieAttack(castleMinionArray[i2]);
						castleMinionArray[i2].castleMinionAttack(zombiesArray[i3]);
					}
				}
				for(var i4=0 ; i4<ghoulsArray.length ; i4++){
					if(castleMinionArray[i2].hitTestObject(ghoulsArray[i4])){
						ghoulsArray[i4].ghoulAttack(castleMinionArray[i2]);
						castleMinionArray[i2].castleMinionAttack(ghoulsArray[i4]);
					}
				}
				for(var i5=0 ; i5<ghostsArray.length ; i5++){
					if(castleMinionArray[i2].hitTestObject(ghostsArray[i5])){
						ghostsArray[i5].ghostAttack(castleMinionArray[i2]);
						castleMinionArray[i2].castleMinionAttack(ghostsArray[i5]);
					}
				}
			}
		}
		public function addCorpse(xPos,yPos):void{
			var corpse:Corpse = new Corpse(xPos,yPos);
			back.addChild(corpse);
			corpseArray.push(corpse);
		}
		public function addCastleMinion(xPos,yPos):void{
			var castleMinion:CastleMinion = new CastleMinion(xPos,yPos);
			back.addChild(castleMinion);
			castleMinionArray.push(castleMinion)
		}
		public static function addSummonedGhost(corpseRef:MovieClip,necromancerFacing:String):void{
			var ghost:Ghost = new Ghost(corpseRef.x,necromancerFacing);
			back.addChild(ghost);
			ghostsArray.push(ghost);
		}
		public static function addSummonedSpirit(corpseRef:MovieClip,spiritResistance:int):void{
			var summonedSpirit:SummonedSpirit = new SummonedSpirit(corpseRef.x,spiritResistance);
			back.addChild(summonedSpirit);
		}
		public static function addSummonedZombie(corpseRef:MovieClip,necromancerFacing:String):void{
			var zombie:Zombie = new Zombie(corpseRef.x,necromancerFacing);
			back.addChild(zombie);
			zombiesArray.push(zombie);
		}
		public static function addSummonedGhoul(corpseRef:MovieClip,necromancerFacing:String):void{
			var ghoul:Ghoul = new Ghoul(corpseRef.x,necromancerFacing);
			back.addChild(ghoul);
			ghoulsArray.push(ghoul);
		}
		public static function updateInventory(itemType:String):void{
			inventory.updateInventory(itemType);
		}
	}
	
}
