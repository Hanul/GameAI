/*
 * 온라인 게임에서 사용되는 인공지능
 */
GameAI.AI = CLASS({
	
	init : (inner, self, params, handlers) => {
		//REQUIRED: params
		//REQUIRED: params.x
		//REQUIRED: params.y
		//REQUIRED: params.minMovableX
		//REQUIRED: params.maxMovableX
		//REQUIRED: params.minMovableY
		//REQUIRED: params.maxMovableY
		//REQUIRED: params.genre
		//REQUIRED: params.aggression
		//REQUIRED: params.accuracy
		//REQUIRED: handlers
		//OPTIONAL: handlers.findTargetPosition
		//OPTIONAL: handlers.moveTo
		//OPTIONAL: handlers.shoot
		
		let x = params.x;
		let y = params.y;
		let minMovableX = params.minMovableX;
		let maxMovableX = params.maxMovableX;
		let minMovableY = params.minMovableY;
		let maxMovableY = params.maxMovableY;
		let aggression = params.aggression;
		
		let findTargetPosition = handlers.findTargetPosition;
		let moveTo = handlers.moveTo;
		let shoot = handlers.shoot;
		
		// 장르가 탑뷰 FPS인 경우, 총알을 피하며 유저가 이동하려 하는 곳에 탄을 발사합니다.
		
		let id = UUID();
		
		let getId = self.getId = () => {
			return id;
		};
		
		let toX = x;
		let toY = y;
		
		let move = () => {
			
			toX = RANDOM({
				min : minMovableX,
				max : maxMovableX
			});
			toY = RANDOM({
				min : minMovableY,
				max : maxMovableY
			});
			
			moveTo(toX, toY);
		};
		
		let moveDelay;
		let createMoveDelay = RAR(() => {
			
			moveDelay = DELAY(RANDOM({
				min : 10,
				max : 200
			}) / 100, () => {
				
				move();
				
				createMoveDelay();
			});
		});
		
		let shootDelay;
		let createShootDelay = RAR(() => {
			
			shootDelay = DELAY(RANDOM({
				min : 5,
				max : 50
			}) / 100, () => {
				
				let targetPosition = findTargetPosition();
				
				shoot(Math.atan2(toX - targetPosition.x, targetPosition.y - toY));
				
				createShootDelay();
			});
		});
		
		// 상대가 공격하는 것을 감지하고 이동
		let announceTargetShoot = self.announceTargetShoot = () => {
			move();
		};
		
		// 인공지능 제거
		let remove = self.remove = () => {
			moveDelay.remove();
			shootDelay.remove();
		};
	}
});
