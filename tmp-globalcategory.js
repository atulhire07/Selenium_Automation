$(document).ready(function () {

    $(".locationsId").multiselect({
        multiple: false,
        header: "Select Location",
        selectedList: 1
    }).multiselectfilter();
    $(".locationsId").multiselect();
    $(".ui-multiselect").css("width", "173px");
    $(".ui-multiselect").css("height", "37px");

    $(".search_focus").multiselect({
        open: function () {
            $(this).multiselect("widget").find("input[type='search']:first").focus();
        }
    });


    $(".add_btn").click(function () { 

        var base_url = $('#base_url').val();
        $('#show_add_po').html("");
        var limit = $("#limit").val();
        var page = $("#page").val();
        var categoryName = $("#categoryName").val();

        var loca_id = $("#locations_id").val();

        var table = $.ajax({
            type: "POST",
            async: false,
            data: {limit: limit, page: page, categoryName: categoryName, locations_id: loca_id},
            url: base_url + "globalCategory/add_category/"
        }).responseText;



//    $('#show_add_printer').html(table);
        $('#login-box').html(table);
        $('#login-box').css({
            'margin-left': '-420px',
            'width': '800px',
            'margin-bottom': '10px',
            //'position': 'absolute',
            'top': window.scrollY + 110,
        });
        $('#mask').show();

        var opt = {};
        opt.date = {preset: 'datetime'};
        $("#cutDateTime").scroller('destroy').scroller($.extend(opt['date'], {
            theme: 'ios7',
            mode: 'scroller',
            display: 'modal',
            dateFormat: 'yy-mm-dd',
            stepMinute: 1
        }));
        $("#deliveryDateTime").scroller('destroy').scroller($.extend(opt['date'], {
            theme: 'ios7',
            mode: 'scroller',
            display: 'modal',
            dateFormat: 'yy-mm-dd',
            stepMinute: 1
        }));


        $("#new_category_id").multiselect({
            multiple: false,
            header: "Select Category",
            selectedList: 1
        }).multiselectfilter();
        $("#locationId").multiselect({selectedList: 1}).multiselectfilter();
        $(".locationId").multiselect();
        $("#icon_color").minicolors();
        $("#cat_printersId option:contains(" + "No Printer" + ")").attr('selected', 'selected');
        $("#cat_printersId").multiselect({
            // multiple: false,
            // header: "Select Attribute",
            selectedList: 1
        }).multiselectfilter();
        $("#discount").multiselect({
            // multiple: false,
            // header: "Select Attribute",
            selectedList: 1
        }).multiselectfilter();
        $("#cat_printersId").multiselect();
        $(".ui-multiselect").css("width", "160px");
        $("#discount").next().css({"width": "167", "height": "37px"});
        //$(".ui-widca").css("width","280px");
        $(".ui-multiselect").css("height", "37px");


        $("#cat_printersId").multiselect({selectedText: function (numChecked, numTotal, checkedItems) {
                flag = 0;
                var no_printer = '';
                checkedItems.forEach(function (item) {
                    console.log(item);
                    var temp = $(item).parent().parent().attr('class').replace(/\s+/, ' ').split(' ');
                    temp2 = temp[temp.length - 1].split('_');

                    if ($(item).next().text().indexOf('No Printer') == -1)
                    {

                        if ($(item).attr('checked') == 'checked') {
                            //console.log('Checked == Checked');
                            flag = 1;
                        }

                    } else {

                        /*
                         Here I'm storing the "No Printer" item into no_printer variable. 
                         */
                        no_printer = item;
                    }

                    /*
                     If flag=1 then that means some other printer is selected and in this case no printer should be
                     unselect even if perviously it was selected
                     */
                    if ((flag === 1)) {

                        if ($(no_printer).attr('checked') == 'checked')
                        {
                            numChecked--;
                        }
                        $(no_printer).attr('checked', false);
                        $('#cat_printersId option[value="' + $(no_printer).val() + '"]').removeAttr('selected')
                        $(no_printer).attr('aria-selected', false);

                    }
                });
                return numChecked + ' of ' + numTotal + ' checked';
            }
        });

        $("#discount").multiselect({selectedText: function (numChecked, numTotal, checkedItems) {
                flag = 0;
                var no_discount = '';
                checkedItems.forEach(function (item) {
                    //console.log(item);
                    var temp = $(item).parent().parent().attr('class').replace(/\s+/, ' ').split(' ');
                    temp2 = temp[temp.length - 1].split('_');

                    if ($(item).next().text().indexOf('No Discount') == -1)
                    {
                        if ($(item).attr('checked') == 'checked') {
                            //console.log('Checked == Checked');
                            flag = 1;
                        }
                    } else {
                        /*
                         Here I'm storing the "No Printer" item into no_discount variable. 
                         */
                        no_discount = item;
                    }

                    /*
                     If flag=1 then that means some other printer is selected and in this case no printer should be
                     unselect even if perviously it was selected
                     */
                    if ((flag === 1)) {

                        if ($(no_discount).attr('checked') == 'checked')
                        {
                            numChecked--;
                        }
                        $(no_discount).attr('checked', false);
                        $('#discount option[value="' + $(no_discount).val() + '"]').removeAttr('selected')
                        $(no_discount).attr('aria-selected', false);

                    }
                });
                return numChecked + ' of ' + numTotal + ' checked';
            }

        });

        $('.toggle-confirm').each(function (index, value) {

            $(value).toggleconfirm();
            $(value).toggleconfirm('click', function () {

                var status = 1;

                if ($(value).find('input[type=checkbox]').attr('checked') == 'checked') {
                    status = 0;
                }
                return 1;
            });
        });
        $('.toggle').each(function (index, value) {

            $(value).toggleconfirm();
            $(value).toggleconfirm('click', function () {

                var status = 1;

                if ($(value).find('input[type=checkbox]').attr('checked') == 'checked') {
                    status = 0;
                }
                return 1;
            });
        });

        function displayVals() {
            var singleValues = $("#printersInterfaceId").val();
            var text_interface = $("#printersInterfaceId option[value='" + singleValues + "']").text();
            if ($.trim(text_interface) == 'IP')
                $("#show_ip").show();
            else
                $("#show_ip").hide();
        }
        displayVals();

        $("#printersInterfaceId").change(displayVals);

//      	function displayVals() {
//							var singleValues = $("#printersInterfaceId").val();	
//							var text_interface = $("#printersInterfaceId option[value='"+singleValues+"']").text();
//							if($.trim(text_interface) == 'IP')
//								$("#show_ip").show();
//							else
//								$("#show_ip").hide();	
//				}
//	displayVals();

        //$("#printersInterfaceId").change(displayVals);

        $(".search_focus").multiselect({
            open: function () {
                $(this).multiselect("widget").find("input[type = 'search']:first").focus();
            }
        });

    });

    $("#add_global_category").live('click', function ()
    {

        var isValid = $("#category_form").valid();
        isValid = $("#category_form").valid();

        if ($("#delievryHrs").val() != "") {
            $("#deliveryDateTime").removeClass("required_new");
            $('#deliveryDateTime').removeClass('error');
            $('#deliveryDateTime').next().remove('label');
        } else {
            $("#deliveryDateTime").addClass("required_new");
        }

        if (!isValid)
        {
            return false;
        } else
        {
            $("#fade").show();
            $("#ajax_loader").show();


            var printer = $("#cat_printersId").val();

            var input = $("<input>").attr("type", "hidden").attr("name", "cat_printer_id").val(printer);
            $('#category_form').append($(input));

            var location = $("#locationId").val();

            var input = $("<input>").attr("type", "hidden").attr("name", "location_id").val(location);
            $('#category_form').append($(input));
            var new_category_id = $("#new_category_id").val();

            var input = $("<input>").attr("type", "hidden").attr("name", "category_id").val(new_category_id);
            $('#category_form').append($(input));
            var discount = $("#discount").val();
            //alert(discount);
            var input = $("<input>").attr("type", "hidden").attr("name", "discount_1").val(discount);
            $('#category_form').append($(input));

            var isUpdateOverriden = $("#isUpdateOverridden:checked").val();
//                        alert(isUpdateOverriden);
            var input = $("<input>").attr("type", "hidden").attr("name", "isUpdateOverridden").val(isUpdateOverriden);
            $('#category_form').append($(input));

            var step = $('#step').val();
            url = $('#base_url').val() + "globalCategory/addGlobalCategory";
            $('#category_form').attr("method", "post");
            $('#category_form').attr("action", url);
            if ($('#category_form').attr("target") == "ajax-temp")
                $('#category_form').removeAttr("target");
            $('#category_form').submit();
            return false;

        }

    });

    $("#update_global_category").live('click', function () {
        var isValid = $("#category_form").valid();
        isValid = $("#category_form").valid();
        if (!isValid)
        {
            return false;
        } else
        {
//            $("#fade").show();
//            $("#ajax_loader").show();

            var printer = $("#cat_printersId").val();


            var input = $("<input>").attr("type", "hidden").attr("name", "cat_printer_id").val(printer);
            $('#category_form').append($(input));

            var location = $("#locationId").val();

            var input = $("<input>").attr("type", "hidden").attr("name", "location_id").val(location);
            $('#category_form').append($(input));

            var discount = $("#discount").val();
            //alert(discount);
            var input = $("<input>").attr("type", "hidden").attr("name", "discount_1").val(discount);
            $('#category_form').append($(input));
            var new_category_id = $("#new_category_id").val();

            var input = $("<input>").attr("type", "hidden").attr("name", "categoryId").val(new_category_id);
            $('#category_form').append($(input));
            var isUpdateOverriden = $("#isUpdateOverridden:checked").val();
//                        alert(isUpdateOverriden);
            var input = $("<input>").attr("type", "hidden").attr("name", "isUpdateOverridden").val(isUpdateOverriden);
            $('#category_form').append($(input));

            var step = $('#step').val();
            url = $('#base_url').val() + "globalCategory/updateGlobalCategory";
            $('#category_form').attr("method", "post");
            $('#category_form').attr("action", url);
            if ($('#category_form').attr("target") == "ajax-temp")
                $('#category_form').removeAttr("target");
            $('#category_form').submit();
            return false;

        }

    });

    $("#back").live('click', function () {
        $('#show_add_printer').html("");
        $('#login-box').html("");
        $(".no_data").show();
        $('#mask').hide();
    });
    $("#cancel").live('click', function () {
        $('#show_add_printer').html("");
        $('#login-box').html("");
        $(".no_data").show();
        $('#mask').hide();
    });

    $(".update_category").live('click', function () {

        $('#show_add_po').html("");
        $('.show_edit_po').html("");

        var base_url = $("#base_url").val();

        var limit = $("#limit").val();
        var page = $("#page").val();
        var categoryName = $("#categoryName").val();

        var locations_id = $("#locations_id").val();

        $('#login-box').html("");
        var id = $(this).attr('lang');
        $("#ajax_loader").show();
        $('#mask').show();
        url = base_url + "globalCategory/getGlobalCategoryById/" + id
        var table = $.ajax({
            url: url,
            type: 'POST',
            async: true,
            data: {limit: limit, page: page, categoryName: categoryName, locations_id: locations_id},
            success: function (table) {

                $('#login-box').html(table);
                $('#login-box').css({
                    'margin-left': '-420px',
                    'width': '800px',
                    'margin-bottom': '10px',
                    'position': 'absolute',
                    'top': window.scrollY + 130,
                });
                $("#ajax_loader").hide();
                $('#mask').show();

                var opt = {};
                opt.date = {preset: 'datetime'};
                $("#cutDateTime").scroller('destroy').scroller($.extend(opt['date'], {
                    theme: 'ios7',
                    mode: 'scroller',
                    display: 'modal',
                    dateFormat: 'yy-mm-dd',
                    stepMinute: 1
                }));
                $("#deliveryDateTime").scroller('destroy').scroller($.extend(opt['date'], {
                    theme: 'ios7',
                    mode: 'scroller',
                    display: 'modal',
                    dateFormat: 'yy-mm-dd',
                    stepMinute: 1
                }));


                $("#new_category_id").multiselect({
                    multiple: false,
                    header: "Select Category",
                    selectedList: 1
                }).multiselectfilter();
                $("#locationId").multiselect({
                    // multiple: false,
                    // header: "Select Attribute",
                    selectedList: 1
                }).multiselectfilter();
                $("#discount").multiselect({
                    // multiple: false,
                    // header: "Select Attribute",
                    selectedList: 1
                }).multiselectfilter();
                $("#cat_printersId").multiselect({
                    // multiple: false,
                    // header: "Select Attribute",
                    selectedList: 1
                }).multiselectfilter();
                $(".locationId").multiselect();
                $("#icon_color").minicolors();
                $("#discount").multiselect();
                $("#cat_printersId").multiselect();
                $(".ui-multiselect").css("width", "160px");
        $("#discount").next().css({"width": "167", "height": "37px"});
        //$(".ui-widca").css("width","280px");
        $(".ui-multiselect").css("height", "37px");

                $(".multiselect").click(function () {
                    console.log('clicked');
                    $("[type=search]").focus();
                });

                $(".search_focus").multiselect({
                    open: function () {
                        $(this).multiselect("widget").find("input[type='search']:first").focus();
                    }
                });

                $("#discount").multiselect({selectedText: function (numChecked, numTotal, checkedItems) {
                        flag = 0;
                        var no_discount = '';
                        checkedItems.forEach(function (item) {
                            //console.log(item);
                            var temp = $(item).parent().parent().attr('class').replace(/\s+/, ' ').split(' ');
                            temp2 = temp[temp.length - 1].split('_');

                            if ($(item).next().text().indexOf('No Discount') == -1)
                            {
                                if ($(item).attr('checked') == 'checked') {
                                    //console.log('Checked == Checked');
                                    flag = 1;
                                }
                            } else {
                                /*
                                 Here I'm storing the "No Printer" item into no_discount variable. 
                                 */
                                no_discount = item;
                            }

                            /*
                             If flag=1 then that means some other printer is selected and in this case no printer should be
                             unselect even if perviously it was selected
                             */
                            if ((flag === 1)) {

                                if ($(no_discount).attr('checked') == 'checked')
                                {
                                    numChecked--;
                                }
                                $(no_discount).attr('checked', false);
                                $('#discount option[value="' + $(no_discount).val() + '"]').removeAttr('selected')
                                $(no_discount).attr('aria-selected', false);

                            }
                        });
                        return numChecked + ' of ' + numTotal + ' checked';
                    }
                });

                $("#cat_printersId").multiselect({selectedText: function (numChecked, numTotal, checkedItems) {
                        flag = 0;
                        var no_printer = '';
                        checkedItems.forEach(function (item) {
//                            console.log(item);
                            var temp = $(item).parent().parent().attr('class').replace(/\s+/, ' ').split(' ');
                            temp2 = temp[temp.length - 1].split('_');

                            if ($(item).next().text().indexOf('No Printer') == -1)
                            {

                                if ($(item).attr('checked') == 'checked') {
                                    //console.log('Checked == Checked');
                                    flag = 1;
                                }

                            } else {

                                /*
                                 Here I'm storing the "No Printer" item into no_printer variable. 
                                 */
                                no_printer = item;
                            }

                            /*
                             If flag=1 then that means some other printer is selected and in this case no printer should be
                             unselect even if perviously it was selected
                             */
                            if ((flag === 1)) {

                                if ($(no_printer).attr('checked') == 'checked')
                                {
                                    numChecked--;
                                }
                                $(no_printer).attr('checked', false);
                                $('#cat_printersId option[value="' + $(no_printer).val() + '"]').removeAttr('selected');
                                $('#cat_printersId option[value="' + $(no_printer).val() + '"]').prop('disabled', true)
                                $(no_printer).attr('aria-selected', false);

                            } else {
                                $('#cat_printersId option[value="' + $(no_printer).val() + '"]').prop('disabled', false)
                            }
                        });
                        return numChecked + ' of ' + numTotal + ' checked';
                    }
                });

                $("#discount").multiselect({selectedText: function (numChecked, numTotal, checkedItems) {
                        flag = 0;
                        var no_discount = '';
                        checkedItems.forEach(function (item) {
                            //console.log(item);
                            var temp = $(item).parent().parent().attr('class').replace(/\s+/, ' ').split(' ');
                            temp2 = temp[temp.length - 1].split('_');

                            if ($(item).next().text().indexOf('No Discount') == -1)
                            {
                                if ($(item).attr('checked') == 'checked') {
                                    //console.log('Checked == Checked');
                                    flag = 1;
                                }
                            } else {
                                /*
                                 Here I'm storing the "No Printer" item into no_discount variable. 
                                 */
                                no_discount = item;
                            }

                            /*
                             If flag=1 then that means some other printer is selected and in this case no printer should be
                             unselect even if perviously it was selected
                             */
                            if ((flag === 1)) {

                                if ($(no_discount).attr('checked') == 'checked')
                                {
                                    numChecked--;
                                }
                                $(no_discount).attr('checked', false);
                                $('#discount option[value="' + $(no_discount).val() + '"]').removeAttr('selected')
                                $(no_discount).attr('aria-selected', false);

                            }
                        });
                        return numChecked + ' of ' + numTotal + ' checked';
                    }
                });

                $('.toggle-confirm').each(function (index, value) {

                    $(value).toggleconfirm();
                    $(value).toggleconfirm('click', function () {

                        var status = 1;

                        if ($(value).find('input[type=checkbox]').attr('checked') == 'checked') {
                            status = 0;
                        }
                        return 1;
                    });
                });
                $('.toggle').each(function (index, value) {

                    $(value).toggleconfirm();
                    $(value).toggleconfirm('click', function () {

                        var status = 1;

                        if ($(value).find('input[type=checkbox]').attr('checked') == 'checked') {
                            status = 0;
                        }
                        return 1;
                    });
                });

            }
        });

    });

    $("#searchId").change(function (event) {

        var searchId = $(this).val();
        var locationsId = $("#locations_id").val();
        var categoryName = $("#categoryName").val();
        var base_url = $("#base_url").val();
        //alert(base_url);
//        location.href = $('#base_url').val() + "globalCategory?locationsId=" + locationsId + "&limit=" + searchId;

        if ($("#locations_id").val() == null) {
            var locationId = $("#locationsId").val();
            location.href = $('#base_url').val() + "globalCategory?locationsId=" + locationsId + "&categoryName=" + categoryName + "&limit=" + searchId;
        } else {
            location.href = $('#base_url').val() + "globalCategory?locationsId=" + locationsId + "&categoryName=" + categoryName + "&limit=" + searchId;
        }

    });

    $(".upload_btn").click(function(){
       $(".uploadfile_btn").trigger("click");
    });
        
    $(".uploadfile_btn").change(function(){
        $("#ajax_loader").show();
        $('#mask').show();
        var file = $('#fileInput')[0].files[0];
        if (file) {
        var fileName = file.name;
        var fileExtensionPattern = /\.(xlsx|xls)$/i; // Regex pattern to match .xlsx and .xls extensions
        if (fileExtensionPattern.test(fileName)) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var fileData = e.target.result;
                var formData = new FormData();
                var baseUrl = $("#base_url").val();
                formData.append('uploadFile', file);
                $.ajax({
                   url: baseUrl + "globalCategory/uploadCategoryFormat/",
                    type: 'POST',
                    data: formData,
                    processData: false, // Important
                    contentType: false, // Important
                    async: false,                   
                     success: function(response) {                        
                        $('#login-box').html(response);
                        $('#login-box').css({
                            'background' : 'gray' ,
                            'margin-left': '-420px',
                            'width': '800px',
                            'margin-bottom': '10px',
                            'position': 'absolute',
                            'top': window.scrollY + 130
                        });
                        $("#ajax_loader").hide();
                        $('#mask').show();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert('File upload failed: ' + textStatus + ' ' + errorThrown);
                    }
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid Excel file (.xlsx or .xls).');
        }
    } else {
        alert('Please select a file first.');
    }
    });
    
    $("#back_upload").live('click', function () {
        $('#login-box').html("");
        $('#mask').hide();
        $(".uploadfile_btn").val("");
    });
    
    $("#close_upload").live('click', function () {
        $('#login-box').html("");
        $('#mask').hide();
        $(".uploadfile_btn").val("");
    });
    
     $('.download_btn').click(function(){
        var fileName = 'Category.xlsx'; // Replace with your actual file name
        var baseUrl = $("#base_url").val(); // Ensure baseUrl is set correctly
        window.location.href = baseUrl + "globalCategory/downloadFile/" + fileName;
    });
});
function generatedisplayName(value) {
    document.getElementById('displayName').value = value;
}
