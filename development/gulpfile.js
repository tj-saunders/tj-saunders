
var gulp = require('gulp'); 
const terser = require('gulp-terser');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var del = require('del');


//script paths
var jsFiles = [
	"src/stats.js",
	"src/TweenMax.2.1.2.min.js",
	"src/webfont.js",	
	"src/pixi.5.1.1.js",
	"src/jso.js",
	"src/pixi-sound.js",
	"src/PIXI.TextInput.js",	
	"src/Main.js",	
	"src/FileSaver.js",	
	"src/GameGlobals.js",
	"src/TextObject.js",
	"src/GameGlobals.js",
	"src/AnalyticsManager.js",
	"src/TransitionUI.js",		
	"src/ScreenManager.js",		
	"src/Screen.js",		
	"src/GraphicsManager.js",
	"src/SoundManager.js",	
	"src/CopyData.js",
	"src/CustomerTypesChartUI.js",		
	"src/BarChartUI.js",		
	"src/PreloaderScreen.js",		
	"src/SplashScreen.js",		
	"src/DebugCopyScreen.js",		
	"src/MainMenuScreen.js",		
	"src/LoginScreen.js",	
	"src/LoginScreen2.js",		
	"src/LoginScreenOffline.js",
	"src/LoginScreenOffline2.js",
	"src/LoginScreen2Online.js",
	"src/LocationScreen.js",		
	"src/LocationPanelUI.js",	
	"src/TemporaryPopup.js",	
	"src/PlannerScreen.js",		
	"src/TradeScreen.js",		
	"src/BusinessDashboardScreen.js",		
	"src/ResultsScreen.js",		
	"src/ResultsScreenContent.js",		
	"src/ReflectionScreen.js",		
	"src/ReflectionScreen2.js",		
	"src/ProductPlannerUI.js",		
	"src/BusinessPlannerUI.js",		
	"src/GameManager.js",		
	"src/Utils.js",		
	"src/OnboardingScreen.js",		
	"src/OnboardingScreen1.js",		
	"src/OnboardingScreen1b.js",		
	"src/OnboardingScreen2.js",		
	"src/OnboardingScreen3.js",		
	"src/OnboardingScreen4.js",		
	"src/OnboardingScreen5.js",		
	"src/CustomiseScreen.js",		
	"src/GameOverScreen.js",		
	"src/CustomerFeedbackScreen.js",		
	"src/CustomerFeedbackScollUIItem.js",		
	"src/LocalisationManager.js",		
	"src/Button.js",		
	"src/ButtonText.js",	
	"src/PopupElement.js",	
	"src/GenericConfirmPopup.js",
	"src/NewsflashPopup.js",		
	"src/MainMenuChallengeConfirmPopup.js",		
	"src/OkDialoguePopup.js",
	"src/InteractionManager.js",	
	"src/ScrollBox.js",		
	"src/BusinessUIScrollItem.js",	
	"src/PlannerUIScrollItem.js",	
	"src/PlannerUIYourStockItem.js",	
	"src/CustomerGraphics.js",	
	"src/ButtonSpriteText.js",	
	"src/ButtonSpriteToggle.js",	
	"src/TradeHUD.js",	
	"src/TradeHUDElement.js",		
	"src/BarUIElement.js",	
	"src/TopBarUI.js",	
	"src/BusinessDashboardItemDataUIObject.js",	
	"src/BusinessDashboardValueUIScrollItem.js",	
	"src/BusinessDashboardItemUIScrollItem.js",	
	"src/BusinessDashboardProductSalesUIItem.js",	
	"src/LocationData.js",		
	"src/ShopItemData.js",		
	"src/NewsflashData.js",	
	"src/MoneyAnimation.js",	
	"src/HelpPopupBox.js",	
	"src/TermsAndConditionsPopupBox.js",	
	"src/TermsAndConditionsPopupBoxOffline.js",
	"src/BusinessPlannerUpgradeData.js",		
	"src/WeeklyCostsCountdownPanel.js",		
	"src/CountdownText.js",		
	"src/Server.js",		
	"src/sha256.js",

	"src/**/*.js"

];
var jsDest = '../deploy/src';

function defaultTask(cb) {
  // place code for your default task here
  
 
  
  cb();
}

gulp.task('clean', function(cb) {
    del([jsDest + "/" + "configData.json", jsDest + "/" + "contentData.json"], cb);	
});

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('popup.min.js'))
        .pipe(gulp.dest(jsDest))
        //.pipe(rename('popup.min.js'))
        .pipe(terser()) //.pipe(uglify())        
        .pipe(gulp.dest(jsDest));
	});

gulp.task('copy', function () {
    
	gulp.src('src/configData.json')
        .pipe(gulp.dest(jsDest)),
	
	gulp.src('src/contentData.json')
        .pipe(gulp.dest(jsDest));
		
	gulp.src('server-config.json')
        .pipe(gulp.dest(jsDest));
			
});

//gulp.task('build-game', ['clean', 'scripts', 'copy']);

exports.default = defaultTask