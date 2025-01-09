sap.ui.define([
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function(jQuery, MessageToast, Controller, Dialog, Export, ExportTypeCSV) {
	"use strict";
	return Controller.extend("FileUploaderBasic.Controller", {
		handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] === "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
				}
				MessageToast.show(sMsg);
			}
		},
		handleUploadPress: function(event) {
			var fU = this.getView().byId("fileUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			// Create a File Reader object
			var reader = new FileReader();
			var t = this;
			reader.onload = function(event) {
				var strCSV = event.target.result;
				var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
				var noOfCols = 5;
				// To ignore the first row which is header
				var hdrRow = arrCSV.splice(0, noOfCols);
				var data = [];
				while (arrCSV.length > 0) {
					var obj = {};
					// extract remaining rows one by one
					var row = arrCSV.splice(0, noOfCols);
					for (var i = 0; i < row.length; i++) {
						obj[hdrRow[i]] = row[i].trim();
					}
					// push row to an array
					data.push(obj);
				}
				// Bind the data to the Table
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data);
				var oTable = t.byId("idTable");
				oTable.setModel(oModel);
			};
			reader.readAsBinaryString(file);
		},
		handleTypeMissmatch: function(oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function(key, value) {
				aFileTypes[key] = "*." + value;
			});
			var sSupportedFileTypes = aFileTypes.join(", ");
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") + " is not supported. Choose one of the following types: " +
				sSupportedFileTypes);
		},
		handleValueChange: function(oEvent) {
			MessageToast.show("Press 'Upload File' to upload file '" + oEvent.getParameter("newValue") + "'");
		},
		// This is the code for downloading excel file
		onDataExport: sap.m.Table.prototype.exportData || function(oEvent) {
			var oTable = this.byId("idTable");
			var oModel = oTable.getModel();
			var oExport = new Export({
				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
			     	exportType: new ExportTypeCSV({
					separatorChar: ",",
					charset: "utf-8"
				}),
				// Pass in the model created above
				models: oModel,
				// binding information for the rows aggregation
				rows: {
					path: "/"
				},
				// column definitions with column name and binding info for the content
				columns: [{
					name: "Sales Document",
					template: {
						content: "{Sales Document}"
					}
				}, {
					name: "Date",
					template: {
						content: "{Date}"
					}
				}, {
					name: "Type",
					template: {
						content: "{Type}"
					}
				}, {
					name: "Sales Org",
					template: {
						content: "{Sales Org}"
					}
				}, {
					name: "Category",
					template: {
						content: "{Category}"
					}
				}]
			});

			// download exported file
			oExport.saveFile().catch(function(oError) {
				sap.m.MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function() {
				oExport.destroy();
			});
		}

	});
});