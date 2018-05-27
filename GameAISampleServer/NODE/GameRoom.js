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
			
			// 누군가가 접속하면, 해당 유저와 상대할 AI를 생성합니다.
			let enemyAI = GameAI.AI({
				x : enemyX,
				y : enemyY,
				genre : 'topview-fps',
				aggression : 100
			}, {
				findTarget : () => {
					
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
				}
			});
			
			send({
				methodName : 'showEnemy',
				data : {
					id : enemyAI.getId(),
					x : enemyX,
					y : enemyY
				}
			});
			
			// 해당 유저의 접속이 끊어지면, AI를 제거합니다.
			on('__DISCONNECTED', () => {
				enemyAI.remove();
			});
		});
	}
});
