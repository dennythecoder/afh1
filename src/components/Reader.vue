<template>
	<div class="reader">
		<toolbar :is-chapter="true" @next-page="nextPage" @prev-page="prevPage">
			<div v-inserted="init" class="content" :style="styleObj" :id="id">
			</div>

		</toolbar>

	</div>
</template>


<style>
.reader {

	height: 80vh;
	width: 95%;
	padding-right: 10px;
	padding-left: 10px;
	margin: 0 0;
	position: absolute;
	top: 0vh;
	z-index: -1;
}

.content {

	min-height: 80vh !important;

	width: 95%;
}
</style>



<script>	

import Hammer from "hammerjs";

export default {

	data() {

		return {
			id: 'epubViewer',
			resizeCount: 0,
			bookmarks: [],
			currentCfi: ''
		}
	},
	methods: {

		prevPage() {
			vm.placeSwipeListener();
		},
		nextPage() {
			mb.store.nextPage();
		},



		gotoCfi(cfi) {
			//expecting string like this -- epubcfi(/6/2[titlepage]!/4/1:0)
			mb.store.gotoCfi(cfi);
			this.placeSwipeListener();
		},
		placeSwipeListener() {
			var vm = this;
			var iframe = document.querySelector('#epubViewer iframe');
			if (!iframe || !iframe.contentDocument) { return; }
			var el = iframe.contentDocument.body;
			if (!el.hasListener) {
				var hammertime = new Hammer(el);

				function swipeLeft() {
					vm.nextPage();

				}
				function swipeRight() {
					vm.prevPage();
				}

				hammertime.on('swipeleft', swipeLeft);
				hammertime.on('swiperight', swipeRight);
			}

			el.hasListener = true;
		},


		init() {
			var vm = this;


			var el = document.getElementById(vm.id);
			var computedStyle = window.getComputedStyle(el);
			vm.book = ePub('docs/AFH-1/',
				{
					width: computedStyle.width,
					height: computedStyle.height
				});


			vm.book.renderTo('epubViewer');
			vm.book.on('renderer:locationChanged', function(location) {
				vm.currentCfi = location.replace(/\//g, '-');
				mb.store.$forceUpdate();
			});
			vm.book.forceSingle();



			if (vm.$route.params.cfi) {
				vm.gotoCfi('epubcfi(' + vm.$route.params.cfi.replace(/-/g, '/') + ')');

			}
			mb.store.setBook(vm.book);

			vm.book.getToc()
				.then(function(chapters) {
					chapters.forEach(function(chapter) {
						mb.store.chapters.push(chapter);
					});
				});
			vm.placeSwipeListener();
			mb.store.generatePagination();
		}
	},
	computed: {
		styleObj() {
			var resizeCount = this.resizeCount;
			var height = window.innerHeight - 60 + 'px';
			var width = window.innerWidth - 40 + 'px';
			return {

				height: '85vh',
				width: width,
				margin: 'auto'
			}
		},

		isVisible() {
			return mb.store.isReader;
		}

	},
	watch: {
		isVisible(newValue) {
			if (newValue) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'visible';
			}
		},
		'$route.params.cfi': function(val) {
			if (val && mb.store.isBookInitialized) {
				this.gotoCfi('epubcfi(' + val.replace(/-/g, '/') + ')');
			}
		}

	}
};
</script>