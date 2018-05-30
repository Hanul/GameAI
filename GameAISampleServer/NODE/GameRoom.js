GameAISampleServer.GameRoom = OBJECT({

	init : (inner, self) => {
		
		GameAISampleServer.ROOM('Game', (clientInfo, on, off, send, broadcastExceptMe) => {
			
			let enemyX = RANDOM({
				min : 0,
				max : 1280
			});
			let enemyY = RANDOM({
				min : 0,
				max : 720
			});
			
			let unitMoveSpeed = 600;
			
			let lastHeroMoveInfo = {
				fromX : 0,
				fromY : 0,
				toX : 0,
				toY : 0,
				time : Date.now()
			};
			
			// 누군가가 접속하면, 해당 유저와 상대할 AI를 생성합니다.
			let enemyAI = GameAI.AI({
				
				x : enemyX,
				y : enemyY,
				minMovableX : 0,
				maxMovableX : 1280,
				minMovableY : 0,
				maxMovableY : 720,
				
				genre : 'topview-fps',
				aggression : 100,
				accuracy : 100
			}, {
				findTargetPosition : () => {
					return {
						x : lastHeroMoveInfo.toX,
						y : lastHeroMoveInfo.toY
					};
				},
				moveTo : (x, y) => {
					send({
						methodName : 'moveEnemy',
						data : {
							id : enemyAI.getId(),
							x : x,
							y : y
						}
					});
				},
				shoot : (angle) => {
					send({
						methodName : 'shootEnemy',
						data : {
							id : enemyAI.getId(),
							angle : angle
						}
					});
				}
			});
			
			// AI를 출현시킵니다.
			send({
				methodName : 'showEnemy',
				data : {
					id : enemyAI.getId(),
					x : enemyX,
					y : enemyY
				}
			});
			
			// 유저가 이동할 때
			on('moveHero', (params) => {
				if (params !== undefined) {
					lastHeroMoveInfo.fromX = params.fromX;
					lastHeroMoveInfo.fromY = params.fromY;
					lastHeroMoveInfo.toX = params.toX;
					lastHeroMoveInfo.toY = params.toY;
					lastHeroMoveInfo.time = Date.now();
				}
			});
			
			// 유저가 공격할 때
			on('shootHero', (params) => {
				if (params !== undefined) {
					
					// AI에게 알립니다.
					enemyAI.announceTargetShoot();
				}
			});
			
			// 해당 유저의 접속이 끊어지면, AI를 제거합니다.
			on('__DISCONNECTED', () => {
				enemyAI.remove();
			});
		});
	}
});
