package  {
	
	import flash.display.MovieClip
	import flash.events.Event;
	
	public class Enemy extends EnemyMC {
	private var _hp:Number = 1;
	private var _player:MovieClip = null;
		public function Enemy(player:MovieClip,xPos:Number,yPos:Number,hp:Number) {
			_player = player;
			_hp = hp;
			this.y = yPos;
			this.x = xPos;
			this.stop();
			addEventListener(Event.ENTER_FRAME,enemyLoop);
			
		}
		public function enemyLoop(e:Event):void{
			if (_player.x < this.x){
				this.x -= 3;
			}
			if (_player.x > this.x){
				this.x += 3;
			}
			if(this.hitTestObject(_player)){
				enemyAttack();
			}
		}
		public function enemyAttack():void{
			if (this.currentFrame == 1){
				this.gotoAndPlay(2);
			}
		}
	}
	
}