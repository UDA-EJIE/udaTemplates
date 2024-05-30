/*!
 * Copyright 2024 E.J.I.E., S.A.
 *
 * Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 * Solo podrá usarse esta obra si se respeta la Licencia.
 * Puede obtenerse una copia de la Licencia en
 *
 *      http://ec.europa.eu/idabc/eupl.html
 *
 * Salvo cuando lo exija la legislación aplicable o se acuerde por escrito, 
 * el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 * SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 * Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 * que establece la Licencia.
 */

jQuery(document).ready(function() {
	const MOCKURL = $.rup_utils.getUrlVar('mockUrl');
	const USERNAMES = $.parseJSON(($.rup_utils.getUrlVar('userNames')));

	window.initRupI18nPromise.then(function() {
		// Crea el select de seleccion.
		$('#userCombo').rup_select({
			data: USERNAMES,
			allowClear: false,
			selected: 'udaAnonymousUser'
		});

		// Comprueba que haya feedback y si no lo crea.
		if ($('.rup-feedback').size() === 0) {
			$('#content').prepend($('<div id=\'logFeedback\'/>').addClass('logFeedback').rup_feedback({
				type: 'ok',
				closeLink: true,
				delay: 2500,
				fadeSpeed: 500,
				block: true
			})).width($('#content').width());
		} else {
			$('#content').css('margin-top', '10em');
		}

		// Especifica el funcionamiento del botón para que se envíen los datos y para que se almacene la cookie de usuario.
		$('#loginButtonObject').bind('click', function() {
			$.rup_utils.setCookie('udaMockUserName', $('#userCombo').rup_select('getRupValue'), { duration: 0, path: '/' });

			if (MOCKURL !== undefined && MOCKURL !== null && MOCKURL !== '') {
				$(location).attr('href', MOCKURL);
			} else {
				$('.rup-feedback').rup_feedback('set', $.rup.i18nParse($.rup.i18n.app, 'loginUserMock.logginOk1') + $('#userCombo').rup_select('getRupValue') + $.rup.i18nParse($.rup.i18n.app, 'loginUserMock.logginOk2')).feedback_principal.rup_feedback('show');
			}
		});
	});

	//Se especifica el funcionamiento del botón para que se envíen los datos y para que se almacene la cookie de usuario 
	$('#loginButtonObject').bind('click', function() {

		if (MOCKAJAXURL !== undefined && MOCKAJAXURL !== null && MOCKAJAXURL !== '') {
			$.rup_utils.setCookie('udaMockUserName', $('#userCombo').rup_select('getRupValue'), { duration: 0, path: '/' });

			var ajaxOptions = {};
			ajaxOptions.success = function(data) {
				$('#mockPageContent').parent().html(data);
			};
			ajaxOptions.url = MOCKAJAXURL;
			ajaxOptions.type = 'GET';
			ajaxOptions.dataType = 'text';
			$.rup_ajax(ajaxOptions);

		} else {
			$('.rup-feedback').rup_feedback('set', $.rup.i18nParse($.rup.i18n.app, 'loginUserMock.logginOk1') + $('#userCombo').rup_select('getRupValue') + $.rup.i18nParse($.rup.i18n.app, 'loginUserMock.logginOk2')).feedback_principal.rup_feedback('show');
		}
	});
});