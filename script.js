$(document).ready(function() {
	if ( $(window).width() < 650) { //This only executes if the screen is < 650px
		$('.module h3').on('click', function() {
		$(this).closest('.module').siblings().find('.content').slideUp(200);
		$(this).closest('.module').find('.content').slideToggle(function(){
			$("html,body").animate({scrollTop: $(this).offset().top - 50},300);
		});
	});
	}
});