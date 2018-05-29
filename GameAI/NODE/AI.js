/*
 * 온라인 게임에서 사용되는 인공지능
 */
GameAI.AI = CLASS({
	
	init : (inner, self, params, handlers) => {
		//REQUIRED: params
		//REQUIRED: params.genre
		//REQUIRED: params.aggression
		//REQUIRED: handlers
		//OPTIONAL: handlers.findTarget
		//OPTIONAL: handlers.moveTo
		//OPTIONAL: handlers.shoot
		
		let moveTo = handlers.moveTo;
		let shoot = handlers.shoot;
		
		let id = UUID();
		
		let moveInterval = INTERVAL(1, () => {
			moveTo( RANDOM({
				min : 0,
				max : 1280
			}),  RANDOM({
				min : 0,
				max : 720
			}));
			
			shoot();
		});
		
		let getId = self.getId = () => {
			return id;
		};
		
		// 인공지능 제거
		let remove = self.remove = () => {
			
		};
	}
});
