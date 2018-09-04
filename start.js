/* Startpage template Javascript file */
jQuery(function($) {

	$(document).ready(function(){

        var objlist     = []; // all posts
        var tagfilter   = [];
        var catfilter   = [];
        var filterClass = '*';
        var selectedCat = false;
        var postID      = '';

        var theoryCategory = 'artikelen';
        var overviewCategory = 'bulletin';

        // setup display posts
        var markupHTMLContent = function(result){

            $('#leftmenucontainer .contentbox, #maincontentcontainer .contentbox, #rightcontentcontainer .contentbox, #infocontent .contentbox').empty();
            var htmllist = '', oc = 0;

            $.each( result, function(idx,obj){

                objlist[obj.id] = obj;

                var html = '',
                objfilterclasses = '',
                itemtype = 0,
                display_tags = gethtmlListTags( obj.tags ),
                display_cats = gethtmlListCats( obj.cats );

                $(obj.tags).each(function( x , tag ){
                    objfilterclasses += ' '+tag;
                });
                $(obj.cats).each(function( x , cat ){
                    if( cat == theoryCategory ){
                        itemtype = 1; // left content
                        objfilterclasses += ' menubutton';
                    }
                    if( cat == overviewCategory ){
                        itemtype = 2; // main/start content
                        objfilterclasses += ' overviewcontent';
                    }
                    objfilterclasses += ' '+cat;
                });
                var catreverse = obj.cats.reverse();
                if(oc = 0){
                    objfilterclasses += ' base';
                }
                if( obj.type == 'page' ){
                    itemtype = 3; // left content
                    objfilterclasses += ' contentpage';
                }

                html += '<div id="'+obj.type+'-'+obj.id+'" data-id="'+obj.id+'" data-slug="'+obj.slug+'" class="item '+obj.imgorient+' '+objfilterclasses+'" ';
                html += 'data-link="'+obj.link+'" data-author="'+obj.author+'" data-timestamp="'+obj.timestamp+'" data-category="'+catreverse[0]+'" ';
                html += 'data-tags="'+obj.tags+'" data-cats="'+obj.cats+'">';
                html += '<div class="itemcontent"><div class="intro">';

                html += '<div class="coverimage">';
                if(obj.image && obj.image != ''){
                    html += '<div class="stage '+obj.imgorient+'" data-url="'+obj.imgurl+'">'+obj.image;
                    html += '<div class="optionfullscreen button">[]</div>';
                    html += '</div>';
                }else if( obj.type == 'post' ){
                    html += '<div class="mediaplaceholder '+obj.imgorient+'"><h3>'+obj.title+'</h3><div class="optionfullscreen button">[]</div></div>';
                } //html += '<div class="excerpt">'+obj.excerpt+'</div>';
                html += '</div>';
                html += '<div class="title">';
                html += '<h3>'+obj.title+'</h3><div class="matchweight moderate">0</div>';
                html += '<div class="author">'+obj.author+'</div></div></div>';
                html += '<div class="itemcatbox">'+display_cats+'</div><div class="itemtagbox">'+display_tags+'</div>';
                //html += JSON.stringify( obj.tags );
                html += '<div class="main"><div class="textbox"></div></div>'; //'+obj.content+'

                html += '</div>';
                html += '<div class="infotoggle button"><span>+</span></div>';
                html += '</div>';
                oc++;

                htmllist += html;

                if( itemtype == 1 ){
                    $('#leftmenucontainer .contentbox').append( html );
                }else if( itemtype == 2 ){
                    $('#maincontentcontainer .contentbox').append( html );
                }else if( itemtype == 3 ){
                    $('#infocontent .contentbox').append( html );
                }else{
                    $('#rightcontentcontainer .contentbox').append( html );
                }

                // reorder specifics
                $('#maincontentcontainer .intro .title').each( function( ){
                    $(this).parent().parent().find('.main').css({ 'top': '40px' }).appendTo( $(this).parent() );
                    $(this).height('40px').prependTo( $(this).parent() );
                });

            });

            console.log( JSON.stringify(objlist) );

        };

        // display clickable tags
        var gethtmlListTags = function( itemtags ){
            var tags = JSON.parse(site_data['tagdata']); //console.log(tags);
            var html = '';
            for(i=0;i<tags.length;i++){
                for(t=0;t<itemtags.length;t++){
                    if( tags[i]['slug'] == itemtags[t] ){
                        html += '<a href="#tags='+tags[i]['slug']+'" class="tagbutton '+tags[i]['slug']+'" data-tag="'+tags[i]['slug']+'">'+tags[i]['name']+'</a> ';
                    }
                }
            }
            return html;
        };

        // display clickable categories
        var gethtmlListCats = function( itemcats ){
                //alert(JSON.stringify(site_data['catdata']));
            var cats = JSON.parse(site_data['catdata']);
                //console.log(cats);
            var html = '';
            for(t=0;t<itemcats.length;t++){
                if( itemcats[t] != overviewCategory && itemcats[t] != theoryCategory ){
                    html += '<div class="categoryname">'+itemcats[t]+'</div> ';
                }
            }
                /*
                for(i=0;i<cats.length;i++){
                    for(t=0;t<itemcats.length;t++){
                        if( cats[i]['slug'] == itemcats[t] ){
                            html += '<a href="#cats='+cats[i]['slug']+'" class="catbutton '+cats[i]['slug']+'" data-cats="'+cats[i]['slug']+'">'+cats[i]['cat_name']+'</a> ';
                        }
                    }
                }*/
            return html;
        };

            // display tag menu
            var markupHTMLTagMenu = function( tags ){
                var html = '';
                for(i=0;i<tags.length;i++){
                    html += '<a href="#tags='+tags[i]['slug']+'" class="tagbutton '+tags[i]['slug']+'" data-tag="'+tags[i]['slug']+'">'+tags[i]['name']+'</a>';
                }
                $('#rightmenucontainer .contentbox').html( html );

                if( $('#rightmenucontainer #tagmenu').length < 1 ){
                    $('#rightmenucontainer .contentbox').prepend('<div id="tagmenu"></div>');
                }
            };

            var markupHTMLSlideContents = function( container ){

                if( container.find('.contentbox .slidebar').length < 1){
                    container.find('.contentbox').append('<div class="slidebar"></div>');
                    var items  = container.find('.item');
                    items.appendTo('.slidebar');
                    container.find('.contentbox').append('<div class="leftslidenav button"><span> < </span></div><div class="rightslidenav button"><span> > </span></div>');
                }else{
                    var items  = container.find('.slidebar .item').removeClass('active');
                }
                items.first().addClass('active');//.slideDown();

                container.on( 'click', '.rightslidenav', function(){
                    container.find('.slidebar .active').removeClass('active').addClass('oldActive');
                    if ( container.find('.slidebar .oldActive').is(':first-child')) {
                        items.last().addClass('active').css({ 'float':'left' });
                    }else{
                        container.find('.slidebar .oldActive').prev().addClass('active').css({ 'float':'right' });
                    }
                    container.find('.slidebar .oldActive').css({ 'float':'left' }).removeClass('oldActive');
                });

               container.on( 'click', '.leftslidenav', function(){
                    container.find('.slidebar .active').removeClass('active').addClass('oldActive');
                    if ( container.find('.slidebar .oldActive').is(':last-child') ) {
                        items.first().css({ 'float':'left' }).addClass('active');
                    }else{
                        container.find('.slidebar .oldActive').next().css({ 'float':'left' }).addClass('active');
                    }
                    container.find('.slidebar .oldActive').css({ 'float':'right' }).removeClass('oldActive');
                });

            }



            function activateIsotope(){

            // init isotope
            //filterClass

            var container = $('#rightcontentcontainer .contentbox');
            container.isotope({

                itemSelector: '.item',
                layoutMode: 'masonry',
                animationEngine: 'best-available',
                transitionDuration: '0.6s',
                masonry: {
                    //isFitWidth: true,
                    columnWidth: container.innerWidth()/4,
                    gutter: 0,
                },
                getSortData: {
                    /*byCategory: function (elem) { // sort randomly
                            return $(elem).data('category') === selectedCat ? 0 : 1;
                    },*/
                    byTagWeight: '.matchweight parseInt',
                },
                sortBy : 'byTagWeight', //[ 'byCategory', 'byTagWeight' ],
                sortAscending: {
                          //byCategory: true, // name ascendingly
                          byTagWeight: false, // weight descendingly
                },
            });

            var w = container.innerWidth()/4;
            container
            .isotope('reloadItems')
            .isotope('updateSortData')
            .isotope({ masonry: { columnWidth: w } })
            .isotope({ filter: filterClass })
            .isotope({
                sortBy : 'byTagWeight', //[ 'byCategory', 'byTagWeight' ], //
                sortAscending: {
                    //byCategory: true, // name ascendingly
                    byTagWeight: false, // weight descendingly
                },
            }).isotope( 'layout' );

			/* if more content loaded use:
            .isotope('updateSortData')
	        .isotope('reloadItems')*/

            };







            // set Data
            if( site_data['postdata'].length > 0 ){
                markupHTMLContent( JSON.parse(site_data['postdata']) );
                markupHTMLSlideContents( $('#maincontentcontainer') );
            }
            if( site_data['tagdata'].length > 0 ){
                markupHTMLTagMenu( JSON.parse(site_data['tagdata']) );
            }
            activateIsotope();






            // match tag weights
            var calculateTagWeight = function( obj ){
                    var mc = 0;
                    var tags = $(obj).data('tags').split(',');
                    if( tags.length > 0  && tagfilter.length > 0){
                        for(i=0;i<tags.length;i++){
                            if( $.inArray( tags[i], tagfilter ) > -1 ){
                                mc++;
                            }
                        }
                    }
                    $(obj).find('.matchweight').text(mc);

                    // Apply Item Matchweight Size
                    $(obj).removeClass('size-l size-m size-s');
                    var percent = 100 / tagfilter.length * mc;
                    var newSize = 'size-s';
                    if( percent > 65 ){
                        newSize = 'size-l';
                    }else if( percent > 30 ){
                        newSize = 'size-m';
                    }$(obj).addClass(newSize);
                    if( $(obj).parent('#rightcontentcontainer .contentbox').length  ){
                        $(obj).addClass(newSize);
                    }

            }


            // order items by tagweight
            var applyTagWeight = function (){
                // calc match weight
                $('.item').each( function( idx, obj ){
                    calculateTagWeight( obj );
                });

                // order items by match weight
                 /*
                var container = $('#rightcontentcontainer .contentbox');
                var items = $.makeArray(container.children(".item"));
                items.sort(function(a, b) {
                  var textA = +$(a).find('.matchweight').text();
                  var textB = +$(b).find('.matchweight').text();
                  if (textA < textB) return 1;
                  if (textA > textB) return -1;
                  return 0;
                });
                container.empty();
                $.each(items, function( idx, obj) {
                    container.append(obj);
                });*/



                // order left menu items by match weight
                //if( $('body.articlemenu').length > 0 ){
                    var menu = $('#leftmenucontainer .contentbox');
                    var options = $.makeArray(menu.children(".menubutton"));
                    options.sort(function(a, b) {
                      var textA = +$(a).find('.matchweight').text();
                      var textB = +$(b).find('.matchweight').text();
                      if (textA < textB) return 1;
                      if (textA > textB) return -1;
                      return 0;
                    });
                    menu.empty();
                    $.each(options, function( idx, obj) {
                        menu.append(obj);
                    });

                //}
                // TODO.. apply Masonry (isotope)
            }

            // On select clickable tags
            var applyTagSelection = function( ){

                tagfilter = [];
                catfilter = [];
                postID = '';
                // set Tag Menu
                $('#tagmenu').html('');
                $('.item .main').removeClass('active');
                $('#rightmenucontainer .contentbox > .tagbutton.selected').each( function(idx,obj){
                    $('#tagmenu').append( $(obj).clone() );
                    tagfilter.push( $(obj).data('tag') );
                });

                // set Selected Tagbuttons Active
                $( '.tagbutton' ).removeClass( 'selected' );
                for(i=0;i<tagfilter.length;i++){
                    $( '.tagbutton.'+tagfilter[i] ).addClass('selected');
                }

                $('#rightmenuplaceholder .togglebox h4 .tagcount').html('');
                if( tagfilter.length > 0 ){
                    $('#rightmenuplaceholder .togglebox h4 .tagcount').html(' ['+tagfilter.length+']');
                }

                // order
                applyTagWeight();

               // activateIsotope();
                var box = $('#rightcontentcontainer');
                var selected = $('#rightcontentcontainer .contentbox .selected').prepend();
                var container = $('#rightcontentcontainer .contentbox');

                container
                    .isotope('updateSortData')
                    .isotope({ filter: filterClass })
                    .isotope({
                        sortBy : 'byTagWeight', //[ 'byCategory', 'byTagWeight' ], //
                        sortAscending: {
                              //byCategory: true, // name ascendingly
                              byTagWeight: false, // weight descendingly
                        },
                    })
                    .isotope('layout');

                box.one('webkitTransitionEnd otransitionend oTransitionEnd msTransisitonEnd transitionend', function(e){
                    var w = container.innerWidth()/4;
                    container.isotope('updateSortData').isotope({ masonry: { columnWidth: w } }).isotope('layout');
                    //container.isotope('reLayout');
                });

                $('html, body').animate({scrollTop:0}, 400);
                console.log(tagfilter);

            }

            // On select clickable Items
            var applyItemSelection = function(){

                tagfilter = $('.item.selected').data('tags').split(',');

                $('#tagmenu').empty();
                $('.tagbutton').removeClass( 'selected' );
                for(i=0;i<tagfilter.length;i++){
                    $( '.tagbutton.'+tagfilter[i] ).addClass('selected');
                }

                catfilter = $('.item.selected').data('cats').split(',');
                postID = $('.item.selected').data('id');

                filterClass = '';

                if( tagfilter.length > 0 ){
				filterClass = '.'+tagfilter.join(',.');
                }

                // order by tags
                applyTagSelection();

                console.log( catfilter );
                console.log( postID );

            }

            // On select clickable LeftMenu Items
            var applyLeftContent = function(){
                    $('.item').removeClass('selected');
                    $('.item .main .textbox').html('');
                    var content = $('#leftmenucontainer .menubutton:first').clone();
                    $('#leftmenucontainer .menubutton:first').addClass('active');
                    content.find('.main .textbox').html( objlist[content.data('id')].content );
                    content.find('.main').addClass('active');

                    $('#leftcontentcontainer .contentbox').html( content.removeClass('menubutton').addClass('selected') );
                    $('#leftcontentcontainer .contentbox .title, #leftcontentcontainer .contentbox .main').insertAfter('#leftcontentcontainer .contentbox .intro');
                    applyItemSelection();
            }




            // toggle left menu
            $('body').on('click', '#leftmenucontainer .togglebox', function(){

                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');

                $('body').toggleClass('articlemenu');
            });

            // toggle right menu
            $('body').on('click', '#rightmenuplaceholder .togglebox', function(){
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');

                $('body').toggleClass('filtermenu');
            });

            // toggle tag from main menu
            $('body').on('click', '#rightmenucontainer .tagbutton', function( event ){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                // contentfilter
                $( '.item' ).removeClass( 'selected' );
                $(this).toggleClass('selected');

                // order by tags
                applyTagSelection( );

                // display
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');

                $('body').removeClass('overview theory');
                $('body').addClass('practice');
            });

            // toggle tag from item or right menu (tag deselect button)
            $('body').on('click', '#tagmenu .tagbutton, .item .tagbutton', function( event ){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                // contentfilter
                $( '.item' ).removeClass( 'selected' );
                var el = $('#rightmenucontainer .contentbox > .tagbutton.'+ $(this).data('tag') );
                el.toggleClass('selected');

                // order by tags
                applyTagSelection();

                // display
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');

                $('body').removeClass('overview theory');
                $('body').addClass('practice');
            });



            // button left menu
            $('body').on('click', '#leftmenucontainer .menubutton', function(){

                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');

                $('body').removeClass( 'overview practice' );
                $('body').addClass('theory');

                $(this).prependTo($(this).parent());
                $('html, body').animate({scrollTop:0}, 400);

                // order by selected button id
                applyLeftContent();
            });

            // item right content click
            $('body').on('click', '#rightcontentcontainer .item .itemcontent .intro', function(){

                // display
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');

                $('body').removeClass('overview theory');
                $('body').addClass('practice');

                // contentfilter

                var selecteditem =  $(this).parent().parent();
                selecteditem.prependTo( selecteditem.parent() );
                $('html, body').animate({scrollTop:0}, 400);
                $('.item').removeClass('selected active');
                $('.item .main .textbox').empty();
                selecteditem.addClass('selected active');

                // order by selected item id
                applyItemSelection();

            });

            $('body').on('click', '.item .button', function(){
                $(this).toggleClass('active');
                if( $(this).parent().find('.main .textbox').html() == ''){
                    $('.item .main .textbox').empty();
                    $(this).parent().find('.main .textbox').html( objlist[$(this).parent().data('id')].content );
                    $(this).parent().find('.main').addClass('active');
                }else{
                    $(this).parent().find('.main').removeClass('active');
                    $('.item .main .textbox').empty();
                }
            });

            // toggle slide info content
            $('body').on('click', '#topbar .leftside .menubutton, #topspace .closebutton', function( event ){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                $('#infocontainer .contentpage.active').removeClass('active');

                $('#infocontainer,#topspace .closebutton').toggleClass( 'active' );

                $('#infocontainer .contentpage[data-link="'+$('#infomenu ul li:first-child a').attr('href')+'"]').addClass( 'active' )
                .find('.main .textbox').html( objlist[ $('#infocontainer .contentpage[data-link="'+$('#infomenu ul li:first-child a').attr('href')+'"]').data('id') ].content );
                $('#infocontainer').slideToggle(300);
                //$('#infocontainer .contentpage.active');
            });

            // toggle info pages
            $('body').on('click', '#infomenu ul li a', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }

                $('#infocontainer .contentpage.active').removeClass('active');
                $('#infocontainer .contentpage[data-link="'+$(this).attr('href')+'"]').find('.main .textbox').html( objlist[ $('#infocontainer .contentpage[data-link="'+$(this).attr('href')+'"]').data('id') ].content );
                $('#infocontainer .contentpage[data-link="'+$(this).attr('href')+'"]').addClass('active');

            });

            // toggle slide main content
            $('body').on('click', '.switchbutton span', function( event ){
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');

                if( $('body').hasClass('overview') ){

                    $('body').removeClass( 'overview filtermenu' );

                    // order by (first) left button id
                    applyLeftContent();

                    $('body').addClass( 'articlemenu theory');

                }else if( $('body').hasClass('practice') ){

                    $('body').removeClass( 'practice filtermenu' );

                    applyLeftContent();
                    $('body').addClass( 'articlemenu theory');

                }else if( $('body').hasClass('theory') ){

                    $('body').removeClass( 'theory overview articlemenu' );

                    applyTagSelection();
                    $('body').addClass('practice');
                }
            });

            // button home start content
            $('body').on('click', '#topbar .leftside .custom-logo-link', function( event ){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');

                /*
                // set Data
                if( site_data['postdata'].length > 0 ){
                    markupHTMLContent( JSON.parse(site_data['postdata']) );
                    markupHTMLSlideContents( $('#maincontentcontainer') );
                }
                if( site_data['tagdata'].length > 0 ){
                    markupHTMLTagMenu( JSON.parse(site_data['tagdata']) );
                }
                activateIsotope();
                */

                $('body').removeClass( 'theory practice articlemenu filtermenu' );

                markupHTMLSlideContents( $('#maincontentcontainer') );

                $('body').addClass('overview');
            });

            // Init
            // $('body').addClass('theory'),$('body').addClass('practice'),$('body').addClass('articlemenu'),$('body').addClass('filtermenu');
            $('body').addClass('overview');

	});

    $(window).load(function() {


    });

    $(document).ajaxStart(function() {
    });

    $(document).ajaxComplete(function() { // http://api.jquery.com/ajaxstop/

    });

});
