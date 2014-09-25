tinymce.init({
    mode : "specific_textareas",
    editor_selector: "richtext",
    toolbar_items_size: 'small',
    plugins: "code fullscreen visualblocks",
    toolbar: "visualblocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code fullscreen",
    menubar: false,
    statusbar: false,
    theme: "modern",
    skin: 'custom'
});

$('#controlTagList').selectize({
    delimiter: ',',
    persist: false,
    create: function (input) {
        return {
            value: input,
            text: input
        }
    }
});

$("#controlDate").datepicker();

$("#controlSelectList").selectize();

$("#controlSelectListMulti").selectize();

$('#multiupload').fileapi({
    multiple: true,
    onComplete: function (evt, uiEvt) {
        setFileComplete('#multiupload1');
    },
    onUpload: function (evt, uiEvt) {
        setFileUpload('#multiupload1');
    },
    elements: {
        ctrl: { upload: '.js-upload' },
        empty: { show: '.b-upload__hint' },
        emptyQueue: { hide: '.js-upload' },
        list: '.js-files',
        progress: '.js-progress',
        file: {
            tpl: '.js-file-tpl',
            preview: {
                el: '.b-thumb__preview',
                width: 80,
                height: 80
            },
            upload: { show: '.progress', hide: '.b-thumb__rotate' }
        }
    }
});

function setFileComplete(elm) {
    $(elm).find(".js-file-tpl").each(function () {
        if ($(this).find(".b-thumb__del").css("display") == "none") {
            $(this).find(".b-thumb__uploading").css("display", "none");
            $(this).find(".b-thumb__del__upload").css("display", "block");
            $(this).find(".b-thumb__download").css("display", "block");
        }
        $(elm).find(".js-progress").css("width", "0%");
    });
}

function setFileUpload(elm) {
    $(elm).find(".js-file-tpl").each(function () {
        if ($(this).find(".b-thumb__download").css("display") == "none") {
            $(this).find(".b-thumb__rotate").css("display", "none");
            $(this).find(".b-thumb__del").css("display", "none");
            $(this).find(".b-thumb__uploading").css("display", "block");
        }
    });
}

var $select = $("#controlRelatedContentType").selectize();

$(".date span").click(function () {
    $(this).prev().focus()
});

$(".sidebar-nav").click(function () {
    $(".sidebar-nav").removeClass("active");
    $(this).addClass("active");
    var isVisible = $(this).next().is(":visible");
    $(".sidebar-nav-submenu").hide(200);
    if (!isVisible) {
        $(this).next().show(200);
    }
});

$(".sidebar-nav-submenu a").click(function () {
    $(".sidebar-nav-submenu a").removeClass("active");
    $(this).addClass("active");
});

function show(page) {
    $(".page").hide();
    $("#" + page).show();
    $(".page .body").scrollTop(0);
}

