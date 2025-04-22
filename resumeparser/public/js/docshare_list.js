console.log("---------------DocShare list scripts loaded---------------");

frappe.listview_settings['DocShare'] = {
    onload: function (listview) {
        // Add a button to the top of the list view
        listview.page.add_inner_button(__('View Selected DocShare'), () => {
            const selected = listview.get_checked_items();
            if (selected.length === 1) {
                window.open(`/resume_search/detail/${selected[0].name}`, '_blank');
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
            return __('View DocShare');
        },
        get_description: function(doc) {
            return __('View details for this docshare');
        },
        action: function(doc) {
            // Simple redirect to docshare detail page with doc.name as parameter
            window.open(`/resume_search/detail/${doc.name}`, '_blank');
        },
        // Add styling to make the button blue
        get_indicator: function(doc) {
            return [__('View'), 'blue', ''];
        }
    }
}
