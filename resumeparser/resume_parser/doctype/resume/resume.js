// Copyright (c) 2025, Sayaji Infotech and contributors
// For license information, please see license.txt

frappe.ui.form.on("Resume", {
	after_save(frm) {
		// Check the response from update_resume_fields
		if (frm.doc.duplicate_info) {
			const duplicate_info = JSON.parse(frm.doc.duplicate_info);
			const duplicate_id = duplicate_info.duplicate_id;
			const data = duplicate_info.data;
            frappe.warn('A duplicate resume was found. Would you like to update the existing resume?',
                'Selecting "Merge Duplicate Resume" will update the existing resume and delete the current entry',
                () => {
                    // Yes - Update the existing resume and delete current
					frappe.call({
						method: 'resumeparser.resume_parser.doctype.resume.resume.update_existing_resume',
						args: {
							duplicate_id: duplicate_id,
							new_data: data,
							name: frm.doc.name
						},
						freeze: true,
						callback: function(r) {
							if (!r.exc) {
								frappe.show_alert({
									message: __('Resume updated successfully'),
									indicator: 'green'
								});
								// Redirect to the existing resume
								setTimeout(() => {
									frappe.set_route('Form', 'Resume', duplicate_id);
								}, 1000);
							}
						}
					});

                },
                'Merge Duplicate Resume',
                true // Sets dialog as minimizable
            )
		}
	},

	refresh(frm) {
        frm.add_custom_button('View Resume', () => {
			window.location.replace(`/resume_search/detail/${frm.doc.name}`);
        }).addClass('btn-primary');
    }
});
