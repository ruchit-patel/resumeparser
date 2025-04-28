console.log("---------------Save Resume list scripts loaded---------------");


frappe.listview_settings['Save Resume'] = {
    onload: function (listview) {
        listview.filter_area.add([[listview.doctype, 'user', '=', frappe.session.user]]);
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