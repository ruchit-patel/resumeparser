console.log("---------------Save Resume list scripts loaded---------------");

frappe.listview_settings['Save Resume'] = {
    onload: function (listview) {
        // Add a button to the top of the list view
        listview.page.add_inner_button(__('View Selected Resume'), () => {
            const selected = listview.get_checked_items();
            if (selected.length === 1) {
                window.open(`/resume_search/detail/${selected[0].resume}`, '_blank');
            } else {
                frappe.msgprint(__('Please select a single resume to view'));
            }
        });
    },
    button: {
        show: function(doc) {
            return true;
        },
        get_label: function() {
            return __('View Resume');
        },
        get_description: function(doc) {
            return __('View details for resume {0}', [doc.resume])
        },
        action: function(doc) {
            // Simple redirect to resume detail page with doc.resume as parameter
            window.open(`/resume_search/detail/${doc.resume}`, '_blank');
        },
        // Add styling to make the button blue
        get_indicator: function(doc) {
            return [__('View'), 'blue', ''];
        }
    }
}