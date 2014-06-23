// JavaScript Document - Handles Popup Creation and Behavior

currentpopup = undefined;

//POPUP CLASS
POPUP = {
    TINY: "tiny",
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
    XLARGE: "xlarge"
}
function Popup(data) {
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.img = data.img;
    this.value = data.value;
    this.bordercolor = data.bordercolor;
    this.output = data.ht || "";
    this.size = data.size || "medium";
    if(data.fnc === undefined)
        data.fnc = function() { };
    
    Popup.prototype.run = data.fnc;
    
    
    Popup.prototype.show = function() {
        hideHovertag();
        currentpopup = this;
        $('#myModal').html('<div style="width:100%;text-align:right"><button class="close-reveal-modal" style="color:inherit;font-size:1.5em">&#215;</button></div><table style="width:100%;vertical-align:top;" class="popupstatic"><tr><td style="vertical-align:top;width:100%;"><span class="popuptitle"></span><span class="popupsubtitle"></span><div class="popupbody"></div></td><td style="text-align:right"><img id="popupimg" src=""></img></td></tr></table><div class="popupcontent"></div>');
        if(this.title !== undefined)
            $('.popuptitle').html(this.title+"<br>");
        if(this.subtitle !== undefined)
            $('.popupsubtitle').html(this.subtitle+"<br><br>");
        else
            $('.popupsubtitle').css('display','none');
        if(this.img !== undefined)
            $('#popupimg').attr('src', this.img);
        if(this.value !== undefined)
            $('.popupbody').html(this.value);
        else
            $('.popupbody').css('display','none');
        if(this.bordercolor !== undefined) {
            $('#myModal').css('border', "solid 2px "+this.bordercolor);
        } else
            $('#myModal').css('border-width', '1px');
        //Populate Popup
        $('.popupcontent').html(ht);
        this.run();
        this.postPopup();
    };
    Popup.prototype.postPopup = function() {
        //Manage size  
        $('#myModal').removeClass('tiny small medium large xlarge').addClass(this.size);
        $('#myModal').foundation('reveal', 'open');
        $('#myModal').focus();
        $(document).on('close', '[data-reveal]', function () {
            this.close(false);
        });
    };
    
    Popup.prototype.close = function(callback) {
        if(currentpopup !== undefined)	
            PanelOnPopupClose(currentpopup.title);

        currentpopup = undefined;
        if(callback !== false)
            $('.popup').foundation('reveal', 'close');
    };
}

function closePopup(callback) {
    currentpopup.close();
}