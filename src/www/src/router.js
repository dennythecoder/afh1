
window.mb = window.mb || {};

var toolbar = new httpVueLoader('src/components/toolbar.html'),
	toc = new httpVueLoader('src/components/toc.html'),
	reader = new httpVueLoader('src/components/reader.html'),
	home = new httpVueLoader('src/components/home.html'),
	bookmarks = new httpVueLoader('src/components/bookmarks.html'),
	searcher = new httpVueLoader('src/components/searcher.html');

mb.components = {
	'toolbar':toolbar,
	'toc': toc,
	'reader':reader,
	'home':home,
	'bookmarks':bookmarks,
	'searcher':searcher
	
};

for(var key in mb.components){
	Vue.component(key, mb.components[key]);
}

	

EPUBJS.filePath = 'lib/epub/libs/';

var routes = [
	{path:'/reader'},
	{path:'/reader/:cfi'},
	{path:'/bookmarks',component:bookmarks},
	{path:'/searcher',component:searcher},
	{path:'/toc', component:toc},
	{path:'/*', component: home}
];

mb.router = new VueRouter({routes:routes});













