$(document).ready(function() {
	if ( $(window).width() < 600) { //This only executes if the screen is < 600px
		$('.module h3').on('click', function() {
		$(this).closest('.module').siblings().find('.content').slideUp(200);
		$(this).closest('.module').find('.content').slideToggle(function(){
			$("html,body").animate({scrollTop: $(this).offset().top - 80},300);
		});
	});
	};
});
	