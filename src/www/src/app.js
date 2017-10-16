window.mb = window.mb || {};
mb.store = mb.store || {};

mb.app = new Vue({
	
	el:'#app',
	data:{
		store:mb.store
	},
	components:{
		'toc':toc,
		'reader':reader,
		'toolbar':toolbar
	},
	router:mb.router
	
});



