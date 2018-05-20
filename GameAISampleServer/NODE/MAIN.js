GameAISampleServer.MAIN = METHOD({

	run : () => {
		
		// 릴레이 서버 실행
		SkyRelay.Server(CONFIG.relayServerPort);
	}
});
