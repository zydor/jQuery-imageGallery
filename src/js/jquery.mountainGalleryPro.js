

(function ( $ ) {
    $.fn.isOnScreen = function(){

	 var win = $(window);

	 var viewport = {
	     top : win.scrollTop(),
	     left : win.scrollLeft()
	 };
	 viewport.right = viewport.left + win.width();
	 viewport.bottom = viewport.top + win.height();

	 var bounds = this.offset();
	 bounds.right = bounds.left + this.outerWidth();
	 bounds.bottom = bounds.top + this.outerHeight();

	 return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

   };
	 
    $.fn.MountainGalleryPro = function( options ) {

        var settings = $.extend({
            item: ".item",
            description: ".desc",
            inscription: ".insc"
        }, options );
	  
	  //$(this).css({opacity : 0});
	  var fotosRoot = this;
	  var MainArea = false;
	  
           function base64Encode(inputStr) 
            {
               var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
               var outputStr = "";
               var i = 0;
               
               while (i < inputStr.length)
               {
                   //all three "& 0xff" added below are there to fix a known bug 
                   //with bytes returned by xhr.responseText
                   var byte1 = inputStr.charCodeAt(i++) & 0xff;
                   var byte2 = inputStr.charCodeAt(i++) & 0xff;
                   var byte3 = inputStr.charCodeAt(i++) & 0xff;
            
                   var enc1 = byte1 >> 2;
                   var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
                   
                   var enc3, enc4;
                   if (isNaN(byte2))
                   {
                       enc3 = enc4 = 64;
                   }
                   else
                   {
                       enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                       if (isNaN(byte3))
                       {
                           enc4 = 64;
                       }
                       else
                       {
                           enc4 = byte3 & 63;
                       }
                   }
            
                   outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
                } 
               
                return outputStr;
            }
		
	  var currentMousePos = { x: -1, y: -1 };
	  $(document).mousemove(function(event) {
		currentMousePos.x = event.pageX;
		currentMousePos.y = event.pageY;
	  });	  
	  
	  $(this).addClass("MountainPro-container");
	  $(this).css({opacity : 0});
	  $(this).animate(
		{opacity : 1 }, 3000,'swing',  
		function(){  
		    			  
		}   
	  );  
        $(this).children(settings.item).each(function( index, element ) {
		$(element).addClass("MountainPro-item");	
		$(element).children(settings.description).addClass("MountainPro-desc").hide();
		element.request = new XMLHttpRequest();
		element.request.src = $(element).find("img").attr("src");
		element.request.parent = element;
		$(element.request.parent).attr("img",element.request.src)
		$(element.request.parent).attr("aimg",$(element.request.parent).find("a").attr("href"))
		$(element).find("img").detach();
		element.request.onloadstart = function(){
		    $(this.parent).append('<div class="preloaderBar" ><div class="progress-content" ></div></div>');
		    this.preloader = $(this.parent).find(".preloaderBar");
		    $(this.preloader).css({position: "relative", top: "50%", left: "50%", marginLeft : "-75px", width: "150px", height: "15px", border : "1px solid rgba(6, 9, 13, 0.6)" , background : "rgba(6, 9, 13, 0.3)"});
		    $(this.preloader).find(".progress-content").css({width : "0%" , height: "100%",  background : "rgba(255, 255, 255, 0.3)" });

		};
		element.request.onprogress = function(e){
		    if (e.lengthComputable)
			  $(this.preloader).find(".progress-content").css({width : (( e.loaded / e.total ) * 100) +"%"});
		    else
			this.preloader.removeAttribute("value");				    
		};
		element.request.onload = function(){
		    
		    $(this.parent).attr("loaded","true");
		    $(this.parent).find("a").append('<img class="item-img" />');		    
		    $(this.parent).find("a").click(openImg);

		    this.img = $(this.parent).find(".item-img");
		    $(this.preloader).detach();
		    $(this.parent).css({opacity : 0});
		    $(this.img).attr("src","data:image/jpeg;base64," + base64Encode(this.responseText));
		    //$(this.parent).find(".item-img").load( function(){
			  $(this.parent).animate(
			     {minWidth :  $(this.img).width() }, 600,'swing',  
			     function(){                    
				$(this).animate(
				  {opacity : 1 }, 1500,'swing',  
				  function(){                    
				  }   
				); 
			     }   
			   ); 		
		    //});
		    
		};
		element.request.onloadend = function(){
		    $(this.preloader).detach();				
		};
		element.request.open("GET", element.request.src, true);
		element.request.overrideMimeType('text/plain; charset=x-user-defined'); 
		
		if($(element).isOnScreen()){
		    if(!$(element.request.parent).attr("loaded")) element.request.send(null);
		} 
		
		$(window).scroll(function() {
		    if($(element).isOnScreen() && !$(element.request.parent).attr("loaded")) element.request.send(null);	
		});
		
//		$(fotosRoot).find("a").click(function(){
//		    console.log("s")
//		    if(!$(element.request.parent).attr("loaded")) element.request.send(null);
//		});	

		
		
	  });
	
        $(this).append('<div class="MountainPro-inscription"></div>');
        
        $(this).children(settings.item).hover(function(e) {

            if($(e.target).is(settings.item)){
                var content = $(e.target).find(settings.inscription).html();
            }
            else {
                var content = $(e.target).closest(settings.item).find(settings.inscription).html(); 
            }
            
            $('.MountainPro-inscription').css({
                opacity : 0
            });
            $(".MountainPro-inscription").html(content)
            
            if(content) {
                $(".MountainPro-inscription").html($(e.target).parent(settings.item).find(settings.inscription).html());
                var offset = $(e.target).offset();   
                
                winW = $(window).width();
                winH = $(window).height();
                if(winH/2 > offset.top){
                    var animTop = offset.top + $(e.target).height() + 10;
                    $('.MountainPro-inscription').css({
                        top : offset.top + $(e.target).height() + 30
                    });
                }
                else {
                    var animTop = offset.top - $('.MountainPro-inscription').height() - 10;
                    $('.MountainPro-inscription').css({
                        top : offset.top - $('.MountainPro-inscription').height() + 20
                    });                        
                }

                if(winW/2 > offset.left){
                    $('.MountainPro-inscription').css({
                        left: (offset.left + $(e.target).width() + 10)
                    });
                } 
                else {
                    $('.MountainPro-inscription').css({
                        left: (offset.left - $('.MountainPro-inscription').width() - 10)
                    });                
                }
            
                $('.MountainPro-inscription').stop().animate({ 
                    opacity:1.0,
                    top : animTop
                }, 700);
            }
        },
        function(e) {
            var offset = $(e.target).offset();
            $('.MountainPro-inscription').stop().animate({ 
                opacity:0.0
            }, 200);
        });
        
	  var openImg = function(event){
		if(MainArea == false) {
		    console.log("openImg");
		    MainArea = true;
		} else {
		    return false;
		}
		
		var source = event.target || event.srcElement;
		source = $(source).parent();
	
		$(".MountainPro-item").each(function( index, element ){

		    $(element).attr("loaded","true");
		    $(element).find("a > img").detach();
		    $(element).find("a").append('<img class="item-img" />');	
		    $(element).find("img").attr("src",$(element).attr("img"));
		    $(element).attr("loaded","true");
		});


		
		fullscreenMode = false;
		if (screenfull.enabled) {
		    screenfull.request();
		    fullscreenMode = true;
		    $(".MountainPro-fullscreen").css({backgroundImage: "url(styles/Full_screen_off.png)"});
		}

		$(fotosRoot).animate(
		   {opacity :  0 }, 600,'swing',  
		   function(){
			 $(fotosRoot).hide();
			 $(fotosRoot).after('<div id="MountainPro-main" class="MountainPro-main" ><img class="MountainPro-main-img" /><div id="MountainPro-thumbnails" class="MountainPro-thumbnails"></div><div class="MountainPro-description"><img class="MountainPro-description-arrow" src="./styles/img-down-arrow.png"><p></p></div><div  class="MountainPro-navi-bar" ><div class="MountainPro-inner-wrapper"><div class="MountainPro-navi MountainPro-close"></div><div class="MountainPro-navi MountainPro-previous"></div><div  class="MountainPro-navi MountainPro-next"></div></div></div><div class="MountainPro-setup"></div><div class="MountainPro-fullscreen"></div><img class="MountainPro-img-up-arrow MountainPro-img-arrow" src="./styles/img-up-arrow.png" /><img class="MountainPro-img-down-arrow MountainPro-img-arrow" src="./styles/img-down-arrow.png" /><img class="MountainPro-img-right-arrow MountainPro-img-arrow" src="./styles/img-right-arrow.png" /><img class="MountainPro-img-left-arrow MountainPro-img-arrow" src="./styles/img-left-arrow.png" /><div class="MountainPro-notification" style="display:none;"><img class="MountainPro-close-notyfication" src="./styles/cross.png" />Wstępny podpowiedź co tu się dzieje ( to bedzie jeszcze poprawione ): <br/> używaj strzałek po prawej stronie lub strzałek na klawiaturze bądź miniaturek po lewej aby przeglądać kolejne zdjęcia <br/> gdy minaturki lub nawigacja po prawej znikną wystarczy najchac myszką by pojawiły sie ponownie... <br/> w przypadku panoram lub zdjęc które nie mieszczą się na ekranie będziesz o tym informaowany przy pomocy strzałek w rogach ekranu. Używaj myszki by przwijać zdjęcie lub panoramy<br/> have fun !</div></div>');
			 $(".MountainPro-close-notyfication").click(function(){
			    $(".MountainPro-notification").hide();
			 });
			 var MountainProDescription = false;
			 $(".MountainPro-description-arrow").click(function(){
			     if(!MountainProDescription){
				   MountainProDescription = true;
				$(".MountainPro-description").stop().animate(
				     {bottom : - $(".MountainPro-description").height() }, 300,'swing',  
					   function(){       
						 $(".MountainPro-description-arrow").attr("src","./styles/img-up-arrow.png");
					   }   
				 );
			     } else {
				   MountainProDescription = false;
				$(".MountainPro-description").stop().animate(
				     {bottom : 0 }, 300,'swing',  
					   function(){       
						 $(".MountainPro-description-arrow").attr("src","./styles/img-down-arrow.png");
					   }   
				 );				   
			     }
					 
			 });			 
			 $(".MountainPro-setup").click(function(){
			    $(".MountainPro-notification").show();
			 });	
			 $(".MountainPro-fullscreen").click(function(){
			     
				if(fullscreenMode){
				    $(".MountainPro-fullscreen").css({backgroundImage: "url(styles/Full_screen_view.png)"});
				    fullscreenMode = false;
                                    screenfull.exit();
				} else {
				    if (screenfull.enabled) {
					  fullscreenMode = true;
					  $(".MountainPro-fullscreen").css({backgroundImage: "url(styles/Full_screen_off.png)"});
					  screenfull.request();
				    }
				}
			 });	
			 $(".MountainPro-close").click(function(){
                             	if(fullscreenMode){
				    $(".MountainPro-fullscreen").css({backgroundImage: "url(styles/Full_screen_view.png)"});
				    fullscreenMode = false;
                                    screenfull.exit();
				}
			     $(".MountainPro-main").animate(
				    {opacity : 0 }, 300,'swing',  
					  function(){       
						$(".MountainPro-main").detach();
						MainArea = false;
						$(fotosRoot).css({opacity : 1}).show();
						$(fotosRoot).find(settings.item).each(function( index, element ) {
						    $(element).append('<a href="'+$(element).attr("aimg")+'" ><img src="'+$(element).attr("img")+'" class="item-img" /></a>');	
						    $(element).find("a").click(openImg);
						    $(element).css( {minWidth :  $(element).find("img").width()});
						});
					  }   
				);
			 });
			 $("body").keydown(function(event) {

				if (event.which == 38) {   
				    next();
				} else if(event.which == 40 ) {
				    previous();
				}
			  });			 		 
			 $(".MountainPro-next").click(function(){
				previous();
			 });
			 $(".MountainPro-previous").click(function(){
				next();
			 });	
			 
			 function next(){
			     var hit = false;
			     $("#MountainPro-thumbnails").find("a").each(function(index,element){					   
				   if(hit){
					 loadImg($(element).attr("href"));
					 return false;
				   }
				   if($(element).attr("href") == $(".MountainPro-main-img").attr("source")) hit = true;

			     });			     
			 }
			 function previous(){
			     var previous = false;
			     $("#MountainPro-thumbnails").find("a").each(function(index,element){
				   if($(element).attr("href") == $(".MountainPro-main-img").attr("source")){
					 console.log($(element).attr("href")+" "+$(".MountainPro-main-img").attr("source"));
					 if(previous) loadImg(previous);
					 return false;
				   }
				   previous = $(element).attr("href")

			     });				     
			 }
			 
			 $(".MountainPro-navi")
			 .mouseover(function(){
                             $(this).css({opacity: 1})
//			     $(this).stop().animate(
//				    {
//                                        opacity : 1
//                                    }, 300,'swing',  
//					  function(){       
//
//					  }   
//				)

			 })
			 .mouseout(function(){
                             $(this).css({opacity: 0.5})
//			     $(this).stop().animate(
//				    {opacity : 0.5 }, 300,'swing',  
//					  function(){       
//
//					  }   
//				)					  
			 });
			 setTimeout(function() {
				$(".MountainPro-thumbnails").animate(
				    {opacity : 0 }, 5000,'swing',  
					  function(){       

					  }   
				)
                        
				$(".MountainPro-navi").animate(
				    {
                                        backgroundPosition: "30% 20%" 
                                    }, 5000,'swing',  
					  function(){       

					  }   
				)                        
			 }, 12000); 
                         $(".MountainPro-navi-bar")
                            .mouseover(function(){
                                 $(".MountainPro-navi").stop().animate(
                                        {
                                            backgroundPosition: 0 
                                        }, 500,'swing',  
                                            function(){       

                                            }   
                                  )					  
                            })
                            .mouseout(function(){
                                 $(".MountainPro-navi").stop().animate(
                                        {
                                            backgroundPosition: 100 
                                        }, 3000,'swing',  
                                            function(){       

                                            }   
                                  )					  
                           })                         
                         
			 $(".MountainPro-thumbnails")
				   .mouseover(function(){
					 $(this).stop().animate(
						{opacity : 1 }, 300,'swing',  
						    function(){       

						    }   
					  )
					 
				   })
				   .mouseout(function(){
					 $(this).stop().animate(
						{opacity : 0 }, 3000,'swing',  
						    function(){       

						    }   
					  )					  
				   })
				   
			  $(".MountainPro-thumbnails")
				   //.css({width : 100, height : $(document).height() })
				   .append($(settings.item).find("a"))
				   .find("img")
				   .mouseover(function(){
					 $(this).css({ borderColor : "white"});
					 $(this).after('<img/>');
					 $(this).next()
                                                   .attr("src",$(this).attr("src"))
						   .css({ border : "1px solid graytext", height : 150, opacity : 0, position: "absolute", top: $(this).offset().top , left : 260  } )
						   .animate(
							  {opacity : 1 }, 500,'swing',  
								function(){       

								}   
						    ).addClass("MountainPro-thumbnail-temp");
						   
				   }).mouseout(function(){
					 $(this).css({ borderColor : "graytext"});
					  $(".MountainPro-thumbnail-temp").animate(
					   {opacity : 0 }, 100,'swing',  
						 function(){       
						     $(this).detach();
						 }   
					 ); 					 
				   });
			 $(".MountainPro-thumbnails").find("img").css({height: 20});
			 $(".MountainPro-thumbnails").find("a").click(function(){				     
				loadImg($(this).attr("href"));
				return false;
			  });
			 

			 loadImg($(source).attr("href"));
			 
		   }   
		 ); 
		return false;
	  };
	    
	  var loadImg = function(source){	
		try {
		    clearInterval(scrollInterval);
		    scrollIntervalFactor = false;
		} catch(e){

		}		
		
		$(".MountainPro-img-arrow").css({opacity : 0});
		$(".MountainPro-main-img-panorama").detach()
		console.log("loadImg"+ source);
		$(window).unbind("mousemove");
		var desc = $(fotosRoot).find("div[aimg='"+source+"'] .MountainPro-desc").html();
		
		if(source.search("-360") > -1){
		    $(".MountainPro-main-img").after('<div class="MountainPro-main-img MountainPro-main-img-panorama"></div>');
		    $(".MountainPro-main-img-panorama").css({opacity : 0, background : "url("+source+")"});
		    $("img.MountainPro-main-img").css({display: "none"});
		    $(".MountainPro-main-img").attr("pan","360");
		} else {
		    $(".MountainPro-main-img").attr("pan","");
		     $("img.MountainPro-main-img").css({display: ""});
		}
		$(".MountainPro-main-img").attr("source",source);
		request = new XMLHttpRequest();
		request.onloadstart = function(){
		    $(".MountainPro-main").append('<div class="preloaderBar" ><div class="progress-content" ></div></div>');
		    this.preloader = $(".MountainPro-main").find(".preloaderBar");
		    $(this.preloader).css({position: "absolute", top: "50%", left: "50%", marginLeft : "-75px", width: "150px", height: "15px", border : "1px solid rgba(6, 9, 13, 0.7)" , background : "rgba(6, 9, 13, 0.5)"});
		    $(this.preloader).find(".progress-content").css({width : "0%" , height: "100%",  background : "rgba(255, 255, 255, 0.5)" });
		    $(".MountainPro-description").animate(
			    {opacity : 0 }, 200,'swing',  
			    function(){  
				  $(".MountainPro-description").html();
			    });

		};
		request.onprogress = function(e){
		    if (e.lengthComputable)
			  $(this.preloader).find(".progress-content").css({width : (( e.loaded / e.total ) * 100) +"%"});
		    else
			this.preloader.removeAttribute("value");				    
		};
		request.onload = function(){

		    $(".MountainPro-main").attr("loaded","true");
		    $(".MountainPro-main-img").css({opacity : 0 , marginLeft: "", marginTop : ""});
		    $(this.preloader).detach();
		    //$(this.parent).find(".item-img").load( function(){
			  $(".MountainPro-main-img").attr("src","data:image/jpeg;base64," + base64Encode(this.responseText));
			  $(".MountainPro-main-img-panorama").css({width: $("img.MountainPro-main-img").width(), height : $("img.MountainPro-main-img").height() });
				imgW = $(".MountainPro-main-img").width();
				imgH = $(".MountainPro-main-img").height();
				winW = $(window).width();
				winH = $(window).height();
				threshold = 0.5;				 
				if(winH < imgH){
				    ration = ((imgH - winH)/2)/(threshold*winH);
				    mtop = ration*(currentMousePos.y - winH * threshold);
				    $(".MountainPro-main-img").css({top : ((winH - imgH)/2), marginTop : -mtop });
				} else {
				    $(".MountainPro-main-img").css({top : ""});
				}
				
				if(winW < imgW){
				    ration = ((imgW - winW)/2)/(threshold*winW);
				    left = ration*(currentMousePos.x -  winW * threshold);	
				    $(".MountainPro-main-img").css({left : ((winW - imgW)/2), marginLeft : -left  });
				} else {
				    $(".MountainPro-main-img").css({left : ""});
				}
				scrollIntervalFactor = false;
				scrollInterval = false;
				bindScrollImg();
				showImgArrows();
                          $(".MountainPro-description > p").html(desc);
                          if(desc != "") {
                            $(".MountainPro-description").animate(
                                    {opacity : 1 }, 1000,'swing',  
                                    function(){  

                                    });
                          }
		    
			  $(".MountainPro-main-img").animate(
			    {opacity : 0 }, 200,'swing',  
			    function(){    
				$(".MountainPro-main-img").animate(
				  {opacity : 1 }, 800,'swing',  
				  function(){    

				  }   
				); 
			    }   
			  );
		    

		    //});

		};
		request.onloadend = function(){
		    //$(this.preloader).detach();				
		};

		request.open("GET", source, true);
		request.overrideMimeType('text/plain; charset=x-user-defined'); 
		request.send(null);

		return false;
	  };
	  
	  var bindScrollImg = function(){
		$(window).bind("mousemove", function(e){
		    imgW = $(".MountainPro-main-img").width();
		    imgH = $(".MountainPro-main-img").height();
		    winW = $(window).width();
		    winH = $(window).height();		    
		    showImgArrows(); 
		    threshold = 0.5;
		    if(winH < imgH){			  
			  ration = ((imgH - winH)/2)/(threshold*winH); 
//			  if(e.pageY > winH * (1 - threshold)   ){
//				mtop = ration*(e.pageY - winH * (1-threshold));
//				$(".MountainPro-main-img").css({marginTop : -mtop });
//			  } else if (e.pageY <  winH * threshold ) {
				mtop = ration*(e.pageY - winH * threshold);
				$(".MountainPro-main-img").css({marginTop : -mtop });
//			  }

		    }
		    
		    if(winW < imgW){
			  ration = ((imgW - winW)/2)/(threshold*winW); 
//			  if(e.pageX > winW * (1-threshold)   ){
//				left = ration*(e.pageX - winW * (1-threshold));
//				$(".MountainPro-main-img").css({marginLeft : -left });
//			  } else if (e.pageX <  winW * threshold ) {
				left = ration*(e.pageX -  winW * threshold);
				$(".MountainPro-main-img").css({marginLeft : -left });
				if($(".MountainPro-main-img").attr("pan") == "360"){
				    
				    $(".MountainPro-img-left-arrow").css({opacity : 1});
				    $(".MountainPro-img-right-arrow").css({opacity : 1});
				    
				    if(e.pageX > winW * (0.99)   ){
					  if(!scrollIntervalFactor){
						scrollIntervalFactor = true;
//						scrollInterval = setInterval(function(){
//						    $(".MountainPro-main-img-panorama").css({width : $(".MountainPro-main-img-panorama").width()+5, left : $(".MountainPro-main-img-panorama").position().left-5});
//						},1);
						$(".MountainPro-main-img-panorama").animate(
						    {width : $(".MountainPro-main-img-panorama").width()+9999, left : $(".MountainPro-main-img-panorama").position().left-9999 },
						    10000,
						    'linear',  
						    function(){  

						 });						
					  }
				    } else if (e.pageX <  winW * 0.01 ) {
					  if(!scrollIntervalFactor){
						scrollIntervalFactor = true;						
						//scrollInterval = setInterval(function(){
						    //$(".MountainPro-main-img-panorama").css({width : $(".MountainPro-main-img-panorama").width()+5, left : $(".MountainPro-main-img-panorama").position().left+5});
						//},1);
						$(".MountainPro-main-img-panorama").animate(
						    {width : $(".MountainPro-main-img-panorama").width()+9999, left : $(".MountainPro-main-img-panorama").position().left+9999 },
						    10000,
						    'linear',  
						    function(){  

						 });
					  }
				    } else {
					  clearInterval(scrollInterval);
					  if(scrollIntervalFactor) $(".MountainPro-main-img-panorama").stop()
					  scrollIntervalFactor = false;
				    }
				}
				    
//			  }
		    }

		});
	  };
	  
	  var showImgArrows = function(){
		
		imgW = $(".MountainPro-main-img").width();
		imgH = $(".MountainPro-main-img").height();
		winW = $(window).width();
		winH = $(window).height();
		if($(".MountainPro-main-img").attr("pan") == "360")
		    imgP = $(".MountainPro-main-img-panorama").offset();
		else {
    		    imgP = $(".MountainPro-main-img").offset();
		}
		

		if(imgP.top + imgH > winH + 5)  $(".MountainPro-img-down-arrow").css({opacity : 1 });
		else  $(".MountainPro-img-down-arrow").css({opacity : 0 });
		if(imgP.top < -5) $(".MountainPro-img-up-arrow").css({opacity : 1 });
		else $(".MountainPro-img-up-arrow").css({opacity : 0 });

		
		if($(".MountainPro-main-img").attr("pan") == "360"){
		    $(".MountainPro-img-left-arrow").css({opacity : 1});
		    $(".MountainPro-img-right-arrow").css({opacity : 1});
		} else {
		    if(imgP.left + imgW > winW + 5)  $(".MountainPro-img-right-arrow").css({opacity : 1 });
		    else  $(".MountainPro-img-right-arrow").css({opacity : 0 });
		    if(imgP.left < -5) $(".MountainPro-img-left-arrow").css({opacity : 1 });
		    else $(".MountainPro-img-left-arrow").css({opacity : 0 });		    
		}
		
	  };
 
    };
 
}( jQuery ));


