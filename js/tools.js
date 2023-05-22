$(document).ready(function() {

    $('body').on('focus', '.form-input input, .form-input textarea', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.form-input input, .form-input textarea', function() {
        $(this).parent().removeClass('focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        } else {
            $(this).parent().removeClass('full');
        }
    });

    $('form').each(function() {
        initForm($(this));
    });

});

function initForm(curForm) {
	curForm.find('.form-input input').each(function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

    curForm.find('.form-input input:focus, .form-input textarea:focus').each(function() {
        $(this).trigger('focus');
    });

    curForm.find('.form-input input').blur(function(e) {
        $(this).val($(this).val()).change();
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            if (curForm.hasClass('ajax-form')) {
                curForm.addClass('loading');
                var formData = new FormData(form);

                $.ajax({
                    type: 'POST',
                    url: curForm.attr('action'),
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    data: formData,
                    cache: false
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    curForm.find('.message').remove();
                    curForm.append('<div class="message message-error"><div class="message-text">Сервис временно недоступен, попробуйте позже.</div></div>')
                    curForm.removeClass('loading');
                }).done(function(data) {
                    curForm.find('.message').remove();
                    if (data.status) {
                        curForm.html('<div class="message message-success"><div class="message-text">' + data.message + '</div></div>')
                    } else {
                        curForm.append('<div class="message message-error"><div class="message-text">' + data.message + '</div></div>')
                    }
                    curForm.removeClass('loading');
                });
            } else {
                form.submit();
            }
        }
    });
}