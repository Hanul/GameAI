/*
 * 온라인 게임에서 사용되는 인공지능
 */
GameAI.TopViewFPSAI = CLASS({
	
	preset : () => {
		return GameAI.AI;
	},
	
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
		
		let toX = x;
		let toY = y;
		
		let move = () => {
			
			let beforeX = toX;
			let beforeY = toY;
			
			toX = RANDOM({
				min : minMovableX,
				max : maxMovableX
			});
			toY = RANDOM({
				min : minMovableY,
				max : maxMovableY
			});
			
			if (toX < beforeX - 100) {
				toX = beforeX - 100;
			} else if (toX > beforeX + 100) {
				toX = beforeX + 100;
			}
			
			if (toY < beforeY - 100) {
				toY = beforeY - 100;
			} else if (toY > beforeY + 100) {
				toY = beforeY + 100;
			}
			
			moveTo(toX, toY);
		};
		
		let moveDelay;
		let createMoveDelay = RAR(() => {
			
			moveDelay = DELAY(RANDOM({
				min : 10,
				max : 100
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
				
				shoot(Math.atan2(toX - targetPosition.x + RANDOM({
					min : -30,
					max : 30
				}), targetPosition.y - toY + RANDOM({
					min : -30,
					max : 30
				})));
				
				createShootDelay();
			});
		});
		
		// 상대가 공격하는 것을 감지하고 이동
		let announceTargetShoot = self.announceTargetShoot = () => {
			// 확률적으로
			if (RANDOM(10) < 8) {
				move();
			}
		};
		
		let remove;
		OVERRIDE(self.remove, (origin) => {
			
			// 인공지능 제거
			remove = self.remove = () => {
				moveDelay.remove();
				shootDelay.remove();
			};
		});
	}
});
