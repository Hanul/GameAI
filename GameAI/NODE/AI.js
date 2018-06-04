/*
 * 온라인 게임에서 사용되는 인공지능
 */
GameAI.AI = CLASS({
	
	init : (inner, self) => {
		
		let id = UUID();
		
		let getId = self.getId = () => {
			return id;
		};
		
		// 인공지능 제거
		let remove = self.remove = () => {
			// 구현해야 함
		};
	}
});
