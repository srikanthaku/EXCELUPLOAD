sap.ui.define(["sap/ui/core/UIComponent"],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("FileUploaderBasic.Component", {

		metadata : {
			rootView : {
				"viewName": "FileUploaderBasic.view.FileUpload",
				"type": "XML",
				"async": true
			},
			dependencies : {
				libs : [
					"sap.ui.unified"
				]
			},
			includes : [
				"../style.css"
			],
			config : {
				sample : {
					files : [
						"View.view.xml",
						"Controller.controller.js"
					]
				}
			}
		}
	});

	return Component;

});