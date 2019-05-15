/*global jQuery */
/*global define */

(function (factory) {
	if (typeof define === 'function' && define.amd) {

		// AMD. Register as an anonymous module.
		define(['jquery',
			'./DateBootstrapAdapter',
			'./DateMaterialAdapter',
			'./TimeJQueryUIAdapter',
			'./TimeBootstrapAdapter',
			'./UploadJQueryUIAdapter',
			'./UploadBootstrapAdapter',
			'./ButtonJQueryUIAdapter',
			'./ButtonBootstrapAdapter',
			'./ButtonMaterialAdapter',
			'./ToolbarJQueryUIAdapter',
			'./ToolbarBootstrapAdapter',
			'./DatatableJQueryUIAdapter',
			'./DatatableBootstrapAdapter',
			'./DatatableMaterialAdapter',
			'./TableJQueryUIAdapter',
			'./TableBootstrapAdapter',
			'./ValidateJQueryUIAdapter',
			'./ValidateBootstrapAdapter',
			'./ValidateMaterialAdapter',
			'./FeedbackJQueryUIAdapter',
			'./FeedbackBootstrapAdapter',
			'./FeedbackMaterialAdapter',
			'./DialogBootstrapAdapter',
			'./DialogMaterialAdapter',
			'./MessageBootstrapAdapter',
			'./MessageMaterialAdapter',
			'./CalendarBootstrapAdapter'
		], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($, Templates,
	DateBootstrapAdapter,
	DateMaterialAdapter,
	TimeJQueryUIAdapter,
	TimeBootstrapAdapter,
	UploadJQueryUIAdapter,
	UploadBootstrapAdapter,
	ButtonJQueryUIAdapter,
	ButtonBootstrapAdapter,
	ButtonMaterialAdapter,
	ToolbarJQueryUIAdapter,
	ToolbarBootstrapAdapter,
	DatatableJQueryUIAdapter,
	DatatableBootstrapAdapter,
	DatatableMaterialAdapter,
	TableJQueryUIAdapter,
	TableBootstrapAdapter,
	ValidateJQueryUIAdapter,
	ValidateBootstrapAdapter,
	ValidateMaterialAdapter,
	FeedbackJQueryUIAdapter,
	FeedbackBootstrapAdapter,
	FeedbackMaterialAdapter,
	DialogBootstrapAdapter,
	DialogMaterialAdapter,
	MessageBootstrapAdapter,
	MessageMaterialAdapter,
	CalendarBootstrapAdapter
) {
	return $;
}));
